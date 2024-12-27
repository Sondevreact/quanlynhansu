const Department = require('../models/Department');
const { validateDepartment } = require('../utils/validation'); // Import validateDepartment
const User = require('../models/User'); // Import User model
const Project = require('../models/Project'); // Import Project model

exports.getAllDepartments = async () => {
  try {
    return await Department.find(); 
  } catch (error) {
    throw new Error(error.message);
  }
};

// Tạo mới phòng ban
exports.createDepartment = async (departmentData) => {
  try {
    // Validate department data
    const { error } = validateDepartment(departmentData);
    if (error) throw new Error(error.details[0].message); // Throw error if validation fails

    // Check if department already exists
    const existingDepartment = await Department.findOne({ name: departmentData.name });
    if (existingDepartment) {
      throw new Error('Phòng ban này đã tồn tại.');
    }

    // Create a new department if validation passes
    const department = new Department(departmentData);
    return await department.save();
  } catch (error) {
    throw new Error(error.message);
  }
};

// Cập nhật phòng ban
exports.updateDepartment = async (departmentId, departmentData) => {
  try {
    // Validate department data before update
    const { error } = validateDepartment(departmentData);
    if (error) throw new Error(error.details[0].message); // Throw error if validation fails

    // Find and update the department
    const department = await Department.findByIdAndUpdate(departmentId, departmentData, { new: true });
    if (!department) {
      throw new Error("Phòng ban không tồn tại.");
    }

    return department;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Xóa mềm phòng ban (soft delete)
// exports.softDeleteDepartment = async (departmentId) => {
//   try {
//     const department = await Department.findByIdAndUpdate(
//       departmentId,
//       { deletedAt: new Date() }, // Gán giá trị deletedAt để đánh dấu phòng ban là đã bị xóa
//       { new: true }
//     );
//     return department;
//   } catch (error) {
//     throw new Error(error.message);
//   }
// };
exports.softDeleteDepartment = async (departmentId) => {
  try {
    // Kiểm tra nếu có dự án nào liên kết với phòng ban và chưa hoàn tất
    const linkedProjects = await Project.find({
      departmentId: departmentId,
      status: { $in: ['ongoing', 'on-hold'] }
    });

    if (linkedProjects.length > 0) {
      throw new Error(
        "Không thể xóa phòng ban vì vẫn còn dự án đang hoạt động hoặc tạm dừng liên kết với phòng ban này."
      );
    }
    const linkedEmployees = await User.find({ departmentId: departmentId });
    if (linkedEmployees.length > 0) {
      throw new Error("Không thể xóa phòng ban vì còn nhân viên liên kết.");
    }
    
    // Xóa mềm phòng ban nếu không có ràng buộc
    const department = await Department.findByIdAndUpdate(
      departmentId,
      { deletedAt: new Date() }, // Đánh dấu phòng ban đã bị xóa
      { new: true }
    );

    if (!department) {
      throw new Error("Phòng ban không tồn tại.");
    }

    return department;
  } catch (error) {
    throw new Error(error.message);
  }
};
// Khôi phục phòng ban (restore soft delete)
exports.restoreDepartment = async (departmentId) => {
  try {
    const department = await Department.findByIdAndUpdate(
      departmentId,
      { deletedAt: null }, // Xóa giá trị deletedAt để khôi phục phòng ban
      { new: true }
    );
    return department;
  } catch (error) {
    throw new Error(error.message);
  }
};


exports.assignManagerToDepartment = async (departmentId, managerId) => {
  try {
    // Tìm người dùng và kiểm tra vai trò
    const user = await User.findById(managerId);
    if (!user || user.role !== 'manager') {
      throw new Error('Người dùng không hợp lệ hoặc không phải manager.');
    }

    // Kiểm tra nếu manager đã thuộc phòng ban khác
    const existingDepartment = await Department.findOne({ managerId });
    if (existingDepartment) {
      throw new Error('Manager đã thuộc một phòng ban khác.');
    }

    // Tìm phòng ban và cập nhật
    const department = await Department.findById(departmentId);
    if (!department) {
      throw new Error('Phòng ban không tồn tại.');
    }

    // Gán manager vào phòng ban
    department.managerId = managerId;
    await department.save();

    // Gán departmentId cho user
    user.departmentId = departmentId;
    await user.save();

    return department;
  } catch (error) {
    throw new Error(error.message);
  }
};
exports.addEmployeeToDepartment = async (departmentId, employeeId) => {
  try {
    // Tìm người dùng và kiểm tra vai trò
    const user = await User.findById(employeeId);
    if (!user || user.role !== 'employee') {
      throw new Error('Người dùng không hợp lệ hoặc không phải nhân viên.');
    }

    // Tìm phòng ban
    const department = await Department.findById(departmentId);
    if (!department) {
      throw new Error('Phòng ban không tồn tại.');
    }

    // Kiểm tra nếu nhân viên đã thuộc phòng ban này
    if (department.employeeIds.includes(employeeId)) {
      throw new Error('Nhân viên đã thuộc phòng ban này.');
    }

    // Thêm nhân viên vào phòng ban
    department.employeeIds.push(employeeId);
    await department.save();

    // Gán departmentId cho user
    user.departmentId = departmentId;
    await user.save();

    return department;
  } catch (error) {
    throw new Error(error.message);
  }
};


// Xóa nhân viên khỏi phòng ban
exports.removeEmployeeFromDepartment = async (departmentId, employeeId) => {
  try {
    const department = await Department.findById(departmentId);
    if (!department) {
      throw new Error('Phòng ban không tồn tại.');
    }

    // Xóa nhân viên khỏi danh sách
    department.employeeIds = department.employeeIds.filter(id => id.toString() !== employeeId);
    await department.save();

    // Cập nhật departmentId trong thông tin nhân viên
    const user = await User.findById(employeeId);
    if (user) {
      user.departmentId = null;
      await user.save();
    }

    return department;
  } catch (error) {
    throw new Error(error.message);
  }
};