const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const crypto = require('crypto');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.API_BASE_URL + "/api/auth/google/callback"
},
async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ email: profile.emails[0].value });

    if (!user) {
      // Nếu người dùng không tồn tại, tạo một người dùng mới
      user = new User({
        googleId: profile.id,
        email: profile.emails[0].value,
        password: crypto.randomBytes(16).toString('hex'),
        fullName: profile.displayName, 
        role: 'employee', 
        isActive: true, 
        phone: '',
      });
       await user.save();
      } else if (!user.googleId) {
        // Nếu người dùng đã tồn tại nhưng không có Google ID, cập nhật người dùng
        user.googleId = profile.id;
        //user.avatar_image = profile.photos[0].value; // Cập nhật avatar nếu cần
        await user.save();
      }

      if (!user.phone || user.phone === '') {
        return done(null, user, { needPhoneNumber: true }); 
      }

    const token = jwt.sign({
      message: "Login successful by hàm passport",
      id: user._id,
      role: user.role, 
    }, process.env.JWT_SECRET, { expiresIn: '9h' });
    
    
    return done(null, { user, token }); 
  } catch (err) {
    return done(err, null);  
  }
}));

passport.serializeUser((user, done) => {
  done(null, user._id); 
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});


