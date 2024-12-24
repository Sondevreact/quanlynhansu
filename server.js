const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Load biến môi trường
dotenv.config();

// Kết nối MongoDB
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(require("cors")());
app.use(require("helmet")());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/departments", require("./routes/departmentRoutes"));
app.use("/api/projects", require("./routes/projectRoutes"));
app.use("/api/leaves", require("./routes/leaveRoutes"));

// Error Handler Middleware
app.use(require("./middlewares/errorHandler"));

// Lắng nghe server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
