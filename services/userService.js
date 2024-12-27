const User = require('../models/User');
const { hashPassword, generateToken } = require('../utils/tokenUtils'); // Giả sử bạn có các hàm này
const { validateUser } = require('../utils/validation'); // Hàm validate user
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

// Cập nhật User
exports.updateUser = async (userId, userData) => {
  try {
    const user = await User.findByIdAndUpdate(userId, userData, { new: true });
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Xóa mềm User (soft delete)
exports.softDeleteUser = async (userId) => {
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { deletedAt: new Date() },
      { new: true }
    );
    return user;
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
