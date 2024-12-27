const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const path = require('path');

// console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID);
// console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET);
// console.log('PORT:', process.env.PORT);

const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/db');
const session = require('express-session');
const passport = require('passport');

require('./middlewares/passportConfig');
require('dotenv').config();

connectDB();

const app = express();
// Cấu hình views và EJS
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('views', './views'); 
app.set('view engine', 'ejs');

app.use(session({
  secret: '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',
  resave: false,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

// Sử dụng các middleware để xử lý body và CORS
app.use(cors());  // Giúp ứng dụng có thể giao tiếp với các nguồn gốc khác
app.use(express.json());  // Để xử lý body JSON
// app.use(bodyParser.urlencoded({ extended: true })); // Xử lý form-urlencoded
// app.use(bodyParser.json()); 

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/departments', require('./routes/departmentRoutes'));
// app.use('/api/projects', require('./routes/projectRoutes'));
// app.use('/api/leaves', require('./routes/leaveRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
