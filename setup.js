const fs = require("fs");
const path = require("path");

// Danh sách thư mục cần tạo
const folders = [
  "config",
  "controllers",
  "models",
  "routes",
  "middlewares",
  "utils",
];

// Danh sách file cần tạo với nội dung mặc định
const files = {
  "config/db.js": `const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(\`MongoDB connected: \${conn.connection.host}\`);
  } catch (error) {
    console.error(\`Error: \${error.message}\`);
    process.exit(1);
  }
};

module.exports = connectDB;`,

  "config/dotenv.js": `const dotenv = require("dotenv");

// Load env variables
dotenv.config();`,

  "controllers/authController.js": `exports.login = (req, res) => {
  res.send("Login functionality");
};

exports.register = (req, res) => {
  res.send("Register functionality");
};`,

  "controllers/userController.js": `exports.getAllUsers = (req, res) => {
  res.send("Get all users functionality");
};

exports.getUser = (req, res) => {
  res.send("Get user by ID functionality");
};`,

  "controllers/departmentController.js": `exports.getDepartments = (req, res) => {
  res.send("Get all departments functionality");
};`,

  "controllers/projectController.js": `exports.getProjects = (req, res) => {
  res.send("Get all projects functionality");
};`,

  "controllers/leaveController.js": `exports.getLeaves = (req, res) => {
  res.send("Get all leaves functionality");
};`,

  "models/User.js": `const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: { type: String, enum: ["admin", "employee"], default: "employee" },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);`,

  "models/Department.js": `const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
}, { timestamps: true });

module.exports = mongoose.model("Department", departmentSchema);`,

  "models/Project.js": `const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
}, { timestamps: true });

module.exports = mongoose.model("Project", projectSchema);`,

  "models/Task.js": `const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: { type: String, enum: ["pending", "in-progress", "completed"], default: "pending" },
}, { timestamps: true });

module.exports = mongoose.model("Task", taskSchema);`,

  "models/DailyReport.js": `const mongoose = require("mongoose");

const dailyReportSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: String,
}, { timestamps: true });

module.exports = mongoose.model("DailyReport", dailyReportSchema);`,

  "models/Leave.js": `const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  startDate: Date,
  endDate: Date,
  reason: String,
}, { timestamps: true });

module.exports = mongoose.model("Leave", leaveSchema);`,

  "routes/authRoutes.js": `const express = require("express");
const router = express.Router();
const { login, register } = require("../controllers/authController");

router.post("/login", login);
router.post("/register", register);

module.exports = router;`,

  "routes/userRoutes.js": `const express = require("express");
const router = express.Router();
const { getAllUsers, getUser } = require("../controllers/userController");

router.get("/", getAllUsers);
router.get("/:id", getUser);

module.exports = router;`,

  "middlewares/authMiddleware.js": `const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

module.exports = protect;`,

  "middlewares/errorHandler.js": `const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

module.exports = errorHandler;`,

  "utils/tokenUtils.js": `const jwt = require("jsonwebtoken");

exports.generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};`,

  "utils/validation.js": `const Joi = require("joi");

exports.validateUser = (data) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });

  return schema.validate(data);
};`,

  ".env": `PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret`,

  ".gitignore": `node_modules
.env`,
};

// Tạo thư mục nếu chưa tồn tại
const createFolder = (folderName) => {
  if (!fs.existsSync(folderName)) {
    fs.mkdirSync(folderName, { recursive: true });
    console.log(`Created folder: ${folderName}`);
  }
};

// Tạo file nếu chưa tồn tại
const createFile = (fileName, content) => {
  if (!fs.existsSync(fileName)) {
    fs.writeFileSync(fileName, content);
    console.log(`Created file: ${fileName}`);
  }
};

// Tạo thư mục
folders.forEach(createFolder);

// Tạo file
Object.entries(files).forEach(([fileName, content]) => {
  createFile(fileName, content);
});

console.log("Project setup completed!");
