const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const passport = require('passport');
const User = require('../models/User'); // Đảm bảo import model User

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateRegister, validateLoginMiddleware } = require('../middlewares/authMiddleware');

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',   passport.authenticate('google', { session: false }), authController.googleLoginCallback);

router.post('/google/login', authController.googleLogin);
// Route render form thêm số điện thoại
router.get('/add-phone-number', (req, res) => {
  if (!req.user) {
    return res.redirect('/api/auth/google'); // Chuyển hướng đến trang Google login nếu chưa đăng nhập
  }
  res.render('add-phone-number'); // Render form nhập số điện thoại
});

// Route xử lý form thêm số điện thoại
router.post('/add-phone-number', async (req, res) => {
  const { phone } = req.body;

  // Log thông tin từ form
  console.log('Form data:', req.body);
  console.log('Phone number submitted:', phone);

  // Kiểm tra xem số điện thoại có được cung cấp không
  if (!phone) {
    return res.render('add-phone-number', { error: 'Phone number is required' });
  }

  // Kiểm tra số điện thoại có ít nhất 10 chữ số
  const phoneNumberRegex = /^\d{10,}$/; // Regex để kiểm tra ít nhất 10 chữ số
  if (!phoneNumberRegex.test(phone)) {
    return res.render('add-phone-number', { error: 'Phone number must be at least 10 digits long' });
  }

  try {
    // Kiểm tra số điện thoại đã tồn tại trong hệ thống cho người dùng khác
    const existingUser = await User.findOne({ phone, _id: { $ne: req.user._id } });
    if (existingUser) {
      return res.render('add-phone-number', { error: 'Phone number already in use' });
    }

    // Cập nhật số điện thoại cho người dùng hiện tại
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.phone = phone;
    await user.save();

    // Sau khi cập nhật thành công, chuyển hướng đến trang chủ hoặc trang tiếp theo
    return res.redirect('/'); // Chuyển hướng sau khi thành công

  } catch (error) {
    console.error('Error adding phone number:', error);
    return res.status(500).render('add-phone-number', { error: 'Internal Server Error' });
  }
});


// Route cho đăng ký và đăng nhập, tích hợp middleware validate
router.post('/register', validateRegister, authController.register);
router.post('/login', validateLoginMiddleware, authController.login);

module.exports = router;
