const User = require('../models/User');
const { validateUser, validateLogin } = require('../utils/validation');
const { generateToken, hashPassword } = require('../utils/tokenUtils');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


exports.googleLogin = async (token) => {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const userInfo = ticket.getPayload();

  let user = await User.findOne({ googleId: userInfo.sub });

  if (!user) {
    user = await User.findOne({ email: userInfo.email });
    if (!user) {
      user = new User({
        googleId: userInfo.sub,
        email: userInfo.email,
        fullName: userInfo.name,
        isActive: true,
        role: 'employee',
      });
      await user.save();
    }
  }

  const jwtToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '9h' }
  );

  return { token: jwtToken, user };
};

exports.register = async (userData) => {
  const { error } = validateUser(userData);
  if (error) throw new Error(error.details[0].message);

  const {  fullName, email, password, role, departmentId, position, phone, dob, address, dateOfJoining, isActive  } = userData;

  const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
  if (existingUser)
    throw new Error(existingUser.email === email
      ? 'Email này đã được đăng ký.'
      : 'Số điện thoại này đã được đăng ký.');

  const hashedPassword = await hashPassword(password);
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
  
  const savedUser = await newUser.save();
  const token = generateToken(savedUser._id, savedUser.role);
  return { token, user: savedUser };
};

exports.login = async (email, password) => {
  const { error } = validateLogin({ email, password });
  if (error) throw new Error(error.details[0].message);

  const user = await User.findOne({ email });
  if (!user) throw new Error('Email không tồn tại.');

  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) throw new Error('Mật khẩu không chính xác.');

  const token = generateToken(user._id, user.role);
  return { token, user };
};

exports.googleLoginCallback = async (user) => {
  const token = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }   
  );

  return { message: 'Login successful', token, user };
};
