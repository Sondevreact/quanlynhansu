const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Tạo JWT Token
const generateToken = (userId, role) => {
  const payload = { id: userId, role: role };  // Payload chứa id người dùng và role
  const secret = process.env.JWT_SECRET;       // Mã bí mật từ biến môi trường
  const options = { expiresIn: '30d' };        // Thời gian hết hạn (1 giờ)

  return jwt.sign(payload, secret, options);   // Tạo token và trả về
};

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// Xác thực JWT Token
const verifyToken = (token) => {
  const secret = process.env.JWT_SECRET;  // Mã bí mật từ biến môi trường

  try {
    const decoded = jwt.verify(token, secret);  // Xác thực token và giải mã
    return decoded;  // Trả về thông tin giải mã
  } catch (err) {
    throw new Error('Invalid or expired token');  // Lỗi nếu token không hợp lệ hoặc hết hạn
  }
};

// Lấy thông tin người dùng từ token
const getUserFromToken = (token) => {
  try {
    const decoded = verifyToken(token);  // Giải mã token
    return decoded;  // Trả về thông tin người dùng
  } catch (err) {
    throw new Error('Unauthorized');
  }
};

module.exports = { generateToken,hashPassword, verifyToken, getUserFromToken };
