const userService = require("../services/userService");

// Lấy danh sách tất cả User
exports.getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Tạo mới User
exports.createUser = async (req, res) => {
  try {
    const newUser = await userService.createUser(req.body);
    res.status(201).json({ message: 'Đăng ký thành công.',newUser });
    // res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Cập nhật User
exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await userService.updateUser(req.params.id, req.body);
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Xóa mềm User (soft delete)
exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await userService.softDeleteUser(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User soft deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Khôi phục User (restore soft delete)
exports.restoreUser = async (req, res) => {
  try {
    const restoredUser = await userService.restoreUser(req.params.id);
    if (!restoredUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User restored successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
