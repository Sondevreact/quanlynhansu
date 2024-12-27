// const express = require("express");
// const router = express.Router();
// const userController = require("../controllers/userController");

// // Route để lấy tất cả người dùng
// router.get("/", userController.getAllUsers);

// // Route để tạo người dùng mới
// router.post("/", userController.createUser);

// // Route để cập nhật người dùng
// router.put("/:id", userController.updateUser);

// // Route để xóa người dùng (xóa mềm)
// router.delete("/:id", userController.deleteUser);

// // Route để khôi phục người dùng
// router.put("/restore/:id", userController.restoreUser);

// module.exports = router;
const express = require('express');
const router = express.Router();
const { protect, authorizeRole } = require('../middlewares/authMiddleware');
const userController = require('../controllers/userController');

// Route để lấy tất cả người dùng (chỉ cho admin)
router.get("/", protect, authorizeRole('admin'), userController.getAllUsers);

// Route để tạo người dùng mới (admin hoặc manager)
router.post("/", protect, authorizeRole('admin', 'manager'), userController.createUser);

// Route để cập nhật người dùng (chỉ admin hoặc người dùng có quyền cập nhật bản thân)
router.put("/:id", protect, authorizeRole('admin', 'manager'), userController.updateUser);

// Route để xóa người dùng (chỉ admin)
router.delete("/:id", protect, authorizeRole('admin'), userController.deleteUser);

// Route để khôi phục người dùng (chỉ admin)
router.put("/restore/:id", protect, authorizeRole('admin'), userController.restoreUser);

module.exports = router;
