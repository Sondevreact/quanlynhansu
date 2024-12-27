// controllers/departmentController.js
const departmentService = require("../services/departmentService");

// Lấy danh sách phòng ban
exports.getAllDepartments = async (req, res) => {
  try {
    const departments = await departmentService.getAllDepartments();
    res.status(200).json(departments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Tạo mới phòng ban
exports.createDepartment = async (req, res) => {
  try {
    const newDepartment = await departmentService.createDepartment(req.body);
    res.status(201).json(newDepartment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Cập nhật phòng ban
exports.updateDepartment = async (req, res) => {
  try {
    const updatedDepartment = await departmentService.updateDepartment(req.params.id, req.body);
    res.status(200).json(updatedDepartment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Xóa mềm phòng ban (soft delete)
exports.deleteDepartment = async (req, res) => {
  try {
    const deletedDepartment = await departmentService.softDeleteDepartment(req.params.id);
    if (!deletedDepartment) {
      return res.status(404).json({ message: "Phòng ban không tìm thấy" });
    }
    res.status(200).json({ message: "Phòng ban đã bị xóa" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Khôi phục phòng ban (restore soft delete)
exports.restoreDepartment = async (req, res) => {
  try {
    const restoredDepartment = await departmentService.restoreDepartment(req.params.id);
    if (!restoredDepartment) {
      return res.status(404).json({ message: "Phòng ban không tìm thấy" });
    }
    res.status(200).json({ message: "Phòng ban đã được khôi phục" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// // Gán manager vào phòng ban bằng params
exports.assignManager = async (req, res) => {
  try {
    const { departmentId, managerId } = req.params;

    // Kiểm tra dữ liệu đầu vào
    if (!departmentId || !managerId) {
      return res.status(400).json({ message: 'Thiếu thông tin departmentId hoặc managerId.' });
    }

    // Gọi service để gán manager
    const updatedDepartment = await departmentService.assignManagerToDepartment(departmentId, managerId);

    res.status(200).json(updatedDepartment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// Thêm nhân viên vào phòng ban bằng params
exports.addEmployee = async (req, res) => {
  try {
    const { departmentId, employeeId } = req.params;

    // Kiểm tra dữ liệu đầu vào
    if (!departmentId || !employeeId) {
      return res.status(400).json({ message: 'Thiếu thông tin departmentId hoặc employeeId.' });
    }

    // Gọi service để thêm nhân viên
    const updatedDepartment = await departmentService.addEmployeeToDepartment(departmentId, employeeId);

    res.status(200).json(updatedDepartment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};



exports.removeEmployee = async (req, res) => {
  try {
    const { departmentId, employeeId } = req.body;
    const updatedDepartment = await departmentService.removeEmployeeFromDepartment(departmentId, employeeId);
    res.status(200).json(updatedDepartment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
