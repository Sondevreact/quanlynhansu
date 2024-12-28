const authService = require('../services/authService');

exports.googleLogin = async (req, res) => {
  try {
    const { token, user } = await authService.googleLogin(req.body.token);
    res.json({ message: "Login successful", token, user });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(400).json({ message: error.message });
  }
};

exports.register = async (req, res) => {
  try {
    const { token, user } = await authService.register(req.body);
    res.status(201).json({ message: 'Đăng ký thành công.', token, user });
  } catch (error) {
    console.error('Register error:', error);
    res.status(400).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { token, user } = await authService.login(req.body.email, req.body.password);
    res.json({ message: 'Đăng nhập thành công.', token, user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.googleLoginCallback = async (req, res) => {
  try {
    const { user } = req;  // user được Passport tự động thêm vào request
    const { token, user: userData } = await authService.googleLoginCallback(user);

    res.json({ message: 'Login successful', token, user: userData });
  } catch (error) {
    console.error('Google Login Callback Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
