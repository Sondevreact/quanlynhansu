const mongoose = require('mongoose');
const User = require('./models/User');
const Department = require('./models/Department');
const Project = require('./models/Project');
const Task = require('./models/Task');
const DailyReport = require('./models/DailyReport');
const Leave = require('./models/Leave');

mongoose.connect('mongodb+srv://quanlynhansubyson:Gcd191140@quanlynhansu.frdem.mongodb.net/?retryWrites=true&w=majority&appName=quanlynhansu')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log(err));

// Tạo người dùng mẫu
const user = new User({
  fullName: 'Hữu',
  email: 'huu@example.com',
  password: 'hashedPassword',
  role: 'employee',
  departmentId: null, // Không có department ID ngay lập tức
  position: 'Developer',
  phone: '123456789',
  dob: '1990-01-01',
  address: 'Hà Nội',
  dateOfJoining: '2020-01-01',
  isActive: true
});

user.save()
  .then(user => {
    console.log('User created:', user);

    // Tạo phòng ban mẫu với managerId là ID của người dùng đã tạo
    const department = new Department({
      name: 'IT Department',
      description: 'Phòng phát triển phần mềm',
      managerId: user._id // Sử dụng ID của người dùng đã tạo
    });

    department.save()
      .then(department => {
        console.log('Department created:', department);

        // Cập nhật departmentId cho user
        user.departmentId = department._id;
        user.save()
          .then(() => {
            console.log('User updated with department ID:', user);

            // Tạo dự án mẫu
            const project = new Project({
              name: 'Quản Lý Nhân Sự Công Ty',
              description: 'Hệ thống quản lý nhân sự',
              startDate: new Date(),
              endDate: new Date(),
              status: 'ongoing',
              members: [user._id],
              managerId: user._id,
              departmentId: department._id
            });

            project.save()
              .then(project => {
                console.log('Project created:', project);

                // Tạo công việc mẫu
                const task = new Task({
                  projectId: project._id,
                  assigneeId: user._id,
                  title: 'Phân tích yêu cầu',
                  description: 'Phân tích yêu cầu hệ thống quản lý nhân sự',
                  deadline: new Date(),
                  status: 'in-progress',
                });

                task.save()
                  .then(task => console.log('Task created:', task))
                  .catch(err => console.log(err));

                // Tạo báo cáo hàng ngày mẫu với workShift và isHoliday
                const dailyReport = new DailyReport({
                  userId: user._id,
                  date: new Date(),
                  tasks: [
                    {
                      task: 'Tạo Tài Khoản',
                      project: 'Quản Lý Nhân Sự Công Ty',
                      hoursSpent: 4,
                      workType: 'Coding',
                      workShift: 1,  // Công việc trong giờ hành chính
                      issues: 'Không có vấn đề.'
                    },
                    {
                      task: 'Đăng Nhập',
                      project: 'Quản Lý Nhân Sự',
                      hoursSpent: 4,
                      workType: 'Meeting',
                      workShift: 2,  // Công việc làm thêm giờ
                      issues: 'Không có vấn đề.'
                    }
                  ],
                  status: 'pending',
                  approvedBy: user._id,
                  notes: 'Hoàn thành công việc đúng hạn.'
                });

                dailyReport.save()
                  .then(report => console.log('Daily Report created:', report))
                  .catch(err => console.log(err));

                // Tạo yêu cầu nghỉ phép mẫu
                const leave = new Leave({
                  userId: user._id,
                  type: 'Sick Leave',
                  startDate: new Date(),
                  endDate: new Date(),
                  reason: 'Ốm',
                  status: 'pending',
                  approvedBy: user._id
                });

                leave.save()
                  .then(leave => console.log('Leave request created:', leave))
                  .catch(err => console.log(err));

              })
              .catch(err => console.log(err));
          })
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));

  })
  .catch(err => console.log(err));
