const User = require('../models/User');
const Project = require('../models/Project'); // Giả sử bạn có mô hình Project
const Department = require('../models/Department'); // Import Department model

const { hashPassword, generateToken } = require('../utils/tokenUtils'); // Giả sử bạn có các hàm này
const { validateUser ,validateUserUpdate} = require('../utils/validation'); // Hàm validate user
// Lấy danh sách tất cả User (không lấy người dùng đã bị xóa mềm)
exports.getAllUsers = async () => {
  try {
    return await User.find({ deletedAt: null });
  } catch (error) {
    throw new Error(error.message);
  }
};

// Tạo mới User
exports.createUser = async (userData) => {
  try {
    const { error } = validateUser(userData);
    if (error) throw new Error(error.details[0].message);

    const { fullName, email, password, role, departmentId, position, phone, dob, address, dateOfJoining, isActive } = userData;

    // Kiểm tra xem email hoặc số điện thoại đã tồn tại chưa
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    
    if (existingUser)
      throw new Error(existingUser.email === email
        ? 'Email này đã được đăng ký.'
        : 'Số điện thoại này đã được đăng ký.');

    // Băm mật khẩu
    const hashedPassword = await hashPassword(password);

    // Tạo người dùng mới
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      role,
      departmentId,
      position,
      phone,
      dob,
      address,
      dateOfJoining,
      isActive
    });

    // Lưu người dùng vào cơ sở dữ liệu
    const savedUser = await newUser.save();

    // Tạo token JWT
    const token = generateToken(savedUser._id, savedUser.role);

    // Trả về thông tin người dùng và token
    return { token, user: savedUser };

  } catch (error) {
    throw new Error(error.message);
  }
};



exports.updateUser = async (userId, userData) => {
  try {
    
    // Validate the user data (similar to createUser)
    const { error } = validateUserUpdate(userData);
    if (error) throw new Error(error.details[0].message);

    // Kiểm tra xem người dùng có tồn tại không
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Kiểm tra nếu người dùng đang là manager và muốn thay đổi vai trò
    if (user.role === 'manager' && userData.role !== 'manager') {
      // Kiểm tra các dự án mà người dùng đang quản lý
      const projectsManagedByUser = await Project.find({ managerId: userId });

      // Nếu người dùng đang quản lý ít nhất một dự án, thông báo yêu cầu admin gỡ khỏi quản lý trước
      if (projectsManagedByUser.length > 0) {
        const projectNames = projectsManagedByUser.map(project => project.name).join(', ');
        throw new Error(`User đang quản lý các dự án: ${projectNames}. Vui lòng gỡ người dùng khỏi các dự án này trước khi thay đổi vai trò.`);
      }

      // Kiểm tra nếu người dùng là manager của phòng ban
      if (user.departmentId) {
        const departmentsManagedByUser = await Department.find({ managerId: userId });

        // Nếu người dùng quản lý ít nhất một phòng ban, thông báo yêu cầu admin gỡ khỏi phòng ban trước
        if (departmentsManagedByUser.length > 0) {
          const departmentNames = departmentsManagedByUser.map(department => department.name).join(', ');
          throw new Error(`User đang quản lý các phòng ban: ${departmentNames}. Vui lòng gỡ người dùng khỏi các phòng ban này trước khi thay đổi vai trò.`);
        }
      }
    }

    // Kiểm tra xem email hoặc số điện thoại có bị trùng không (nếu có thay đổi)
    const { email, phone } = userData;
    if (email && email !== user.email) {
      const existingUserByEmail = await User.findOne({ email });
      if (existingUserByEmail) throw new Error("Email này đã được đăng ký.");
    }

    if (phone && phone !== user.phone) {
      const existingUserByPhone = await User.findOne({ phone });
      if (existingUserByPhone) throw new Error("Số điện thoại này đã được đăng ký.");
    }

    // Tiến hành cập nhật người dùng nếu không có vấn đề gì
    const updatedUser = await User.findByIdAndUpdate(userId, userData, { new: true });

    if (!updatedUser) {
      throw new Error("User update failed");
    }

    return { status: 'success', updatedUser };
  } catch (error) {
    throw new Error(error.message);
  }
};


exports.softDeleteUser = async (userId) => {
  try {
    // Kiểm tra xem người dùng có tồn tại không
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Kiểm tra xem người dùng có thuộc phòng ban nào không
    if (user.departmentId) {
      throw new Error("Người dùng phải được xóa khỏi phòng ban trước khi xóa");
    }
 // Kiểm tra xem người dùng có phải là quản lý dự án nào không
    const projectsManagedByUser = await Project.find({ managerId: userId });
    if (projectsManagedByUser.length > 0) {
      throw new Error("Người dùng là người quản lý trong một dự án. Xóa chức vụ trước khi xóa.");
    }
    // Kiểm tra xem người dùng có thuộc dự án nào không
    const userInProjects = await Project.find({ managerId: userId, members: userId });
    if (userInProjects.length > 0) {
      throw new Error("Người dùng phải được xóa khỏi dự án trước khi xóa mềm");
    }

    // Tiến hành xóa mềm người dùng
    const deletedUser = await User.findByIdAndUpdate(
      userId,
      { deletedAt: new Date() },
      { new: true }
    );

    return deletedUser;
  } catch (error) {
    throw new Error(error.message);
  }
};
// Khôi phục User (restore soft delete)
exports.restoreUser = async (userId) => {
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { deletedAt: null },
      { new: true }
    );
    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};
