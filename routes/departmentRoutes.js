const express = require('express');
const router = express.Router();
const { protect, authorizeRole } = require('../middlewares/authMiddleware');
const departmentController = require('../controllers/departmentController');


// Lấy danh sách phòng ban (admin, manager)
router.get('/', protect, authorizeRole('admin', 'manager'), departmentController.getAllDepartments);

// Tạo mới phòng ban (admin, manager)
router.post('/', protect, authorizeRole('admin', 'manager'), departmentController.createDepartment);

// Cập nhật phòng ban (admin, manager)
router.put('/:id', protect, authorizeRole('admin', 'manager'), departmentController.updateDepartment);

// Xóa mềm phòng ban (admin)
router.delete('/:id', protect, authorizeRole('admin'), departmentController.deleteDepartment);

// Khôi phục phòng ban (admin)
router.put('/restore/:id', protect, authorizeRole('admin'), departmentController.restoreDepartment);

// Xóa nhân viên khỏi phòng ban
router.delete('/:departmentId/manager/:managerId', departmentController.removeManagerFromDepartment);

router.put('/remove-employee', protect, authorizeRole('admin', 'manager'), departmentController.removeEmployee);

router.put('/:departmentId/employee/:employeeId', protect, authorizeRole('admin', 'manager'),departmentController.addEmployee);

router.put('/:departmentId/manager/:managerId',protect, authorizeRole('admin', 'manager'), departmentController.assignManager);

module.exports = router;
