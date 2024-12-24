const mongoose = require('mongoose');

const dailyReportSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Người tạo báo cáo
  date: { type: Date, required: true }, // Ngày báo cáo
  tasks: [
    {
      task: { type: String, required: true }, // Tên công việc
      project: { type: String, required: true }, // Tên dự án
      hoursSpent: { type: Number, required: true }, // Số giờ làm
      workType: { 
        type: String, 
        enum: ['Coding', 'Meeting', 'FixBug', 'Other'], 
        required: true 
      }, // Loại công việc
      workShift: { 
        type: Number, 
        required: true 
      }, // Loại ca làm (trong giờ hoặc ngoài giờ)
      issues: { type: String } // Các vấn đề gặp phải
    }
  ],
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  }, // Trạng thái báo cáo
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Người phê duyệt (nếu có)
  notes: { type: String }, // Ghi chú báo cáo
}, { timestamps: true });

module.exports = mongoose.model('DailyReport', dailyReportSchema);  
