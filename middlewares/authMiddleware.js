const { verifyToken } = require('../utils/tokenUtils');
const { validateUser, validateLogin } = require('../utils/validation');
// Middleware phân quyền theo vai trò
const authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: Bạn không có quyền truy cập vào tài nguyên này.' });
    }
    next();
  };
};
// Middleware bảo vệ route
const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Lấy token từ header Authorization

  if (!token) {
    return res.status(401).json({ message: 'Không có token, yêu cầu đăng nhập.' });
  }

  try {
    // Giải mã token và lưu thông tin người dùng vào req.user
    const decoded = verifyToken(token);
    req.user = decoded;  // Lưu thông tin người dùng vào request để dùng trong các route sau
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token không hợp lệ.' });
  }
};
// Middleware validate request cho đăng ký
const validateRegister = (req, res, next) => {
  const { error } = validateUser(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

// Middleware validate request cho đăng nhập
const validateLoginMiddleware = (req, res, next) => {
  const { error } = validateLogin(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

module.exports = { protect, validateRegister,
  validateLoginMiddleware, authorizeRole  };
