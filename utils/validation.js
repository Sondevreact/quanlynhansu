const Joi = require("joi");

exports.validateUser = (data) => {
  const schema = Joi.object({
    fullName: Joi.string().min(3).required().messages({
      'string.empty': 'Tên không được để trống.',
      'string.min': 'Tên phải có ít nhất 3 ký tự.'
    }),
    email: Joi.string().email().required().messages({
      'string.email': 'Email không hợp lệ.',
      'string.empty': 'Email không được để trống.'
    }),
    password: Joi.string().min(6).required().messages({
      'string.min': 'Mật khẩu phải có ít nhất 6 ký tự.',
      'string.empty': 'Mật khẩu không được để trống.'
    }),
    role: Joi.string().valid('admin', 'employee', 'manager').required().messages({
      'any.only': 'Vai trò không hợp lệ (chỉ chấp nhận admin, employee, hoặc manager).',
      'string.empty': 'Vai trò không được để trống.'
    }),
    // departmentId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required().messages({
    //   'string.pattern.base': 'Department ID không hợp lệ.',
    //   'string.empty': 'Department ID không được để trống.'
    // }),
    position: Joi.string().required().messages({
      'string.empty': 'Chức vụ không được để trống.'
    }),
    phone: Joi.string().pattern(/^[0-9]{10,11}$/).required().messages({
      'string.pattern.base': 'Số điện thoại phải là 10 hoặc 11 chữ số.',
      'string.empty': 'Số điện thoại không được để trống.'
    }),
    dob: Joi.date().less('now').required().messages({
      'date.less': 'Ngày sinh phải là ngày trong quá khứ.',
      'date.base': 'Ngày sinh không hợp lệ.',
      'date.empty': 'Ngày sinh không được để trống.'
    }),
    address: Joi.string().required().messages({
      'string.empty': 'Địa chỉ không được để trống.'
    }),
    dateOfJoining: Joi.date().required().messages({
      'date.base': 'Ngày gia nhập không hợp lệ.',
      'date.empty': 'Ngày gia nhập không được để trống.'
    }),
    isActive: Joi.boolean().required().messages({
      'boolean.base': 'Trạng thái hoạt động không hợp lệ.',
      'any.required': 'Trạng thái hoạt động là bắt buộc.'
    })
  });

  return schema.validate(data);
};
const stripFields = () => ({
  _id: Joi.any().strip(),
  departmentId: Joi.any().strip(),
  deletedAt: Joi.any().strip(),
  createdAt: Joi.any().strip(),
  updatedAt: Joi.any().strip(),
  __v: Joi.any().strip()
});

exports.validateUserUpdate = (data) => {
  const schema = Joi.object({
    ...stripFields(),
    fullName: Joi.string().min(3).max(50).optional().messages({
      'string.min': 'Tên phải có ít nhất 3 ký tự.',
      'string.max': 'Tên không được dài quá 50 ký tự.'
    }),
    email: Joi.string().email().optional().messages({
      'string.email': 'Email không hợp lệ.'
    }),
    password: Joi.string().min(6).optional().messages({
      'string.min': 'Mật khẩu phải có ít nhất 6 ký tự.'
    }),
    role: Joi.string().valid('admin', 'employee', 'manager').optional().messages({
      'any.only': 'Vai trò không hợp lệ (chỉ chấp nhận admin, employee, hoặc manager).'
    }),
    position: Joi.string().optional().messages({
      'string.empty': 'Chức vụ không hợp lệ.'
    }),
    phone: Joi.string().pattern(/^[0-9]{10,11}$/).optional().messages({
      'string.pattern.base': 'Số điện thoại phải là 10 hoặc 11 chữ số.'
    }),
    dateOfJoining: Joi.date().optional().messages({
      'date.base': 'Ngày gia nhập không hợp lệ.'
    }),
    dob: Joi.date()
    .max(new Date(new Date().setFullYear(new Date().getFullYear() - 18)))
    .required()
    .messages({
      'date.max': 'Người dùng phải ít nhất 18 tuổi.',
      'date.base': 'Ngày sinh không hợp lệ.',
      'date.empty': 'Ngày sinh không được để trống.'
    }),  
    address: Joi.string().optional().messages({
      'string.empty': 'Địa chỉ không hợp lệ.'
    }),
   
    isActive: Joi.boolean().optional().messages({
      'boolean.base': 'Trạng thái hoạt động không hợp lệ.'
    })
  });

  return schema.validate(data);
};

// Validation for department data
exports.validateDepartment = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required().messages({
      'string.empty': 'Tên phòng ban không được để trống.',
      'string.min': 'Tên phòng ban phải có ít nhất 3 ký tự.'
    }),
    description: Joi.string().optional().allow('').messages({
      'string.base': 'Mô tả phải là một chuỗi ký tự.'
    }),
    managerId: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .optional()
      .allow(null)
      .messages({
        'string.pattern.base': 'ID quản lý không hợp lệ.',
      }),
    deletedAt: Joi.date().optional().allow(null).messages({
      'date.base': 'Trường deletedAt phải là ngày hợp lệ.'
    }),
  });

  return schema.validate(data);
};

// Validate cho thông tin đăng nhập (login)
exports.validateLogin = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Email không hợp lệ.',
      'string.empty': 'Email không được để trống.'
    }),
    password: Joi.string().min(6).required().messages({
      'string.min': 'Mật khẩu phải có ít nhất 6 ký tự.',
      'string.empty': 'Mật khẩu không được để trống.'
    })
  });

  return schema.validate(data);
};

// Validate cho yêu cầu nghỉ phép (leave request)
exports.validateLeaveRequest = (data) => {
  const schema = Joi.object({
    type: Joi.string().valid('Sick Leave', 'Vacation', 'Other').required().messages({
      'any.only': 'Loại nghỉ phép không hợp lệ.',
      'string.empty': 'Loại nghỉ phép không được để trống.'
    }),
    startDate: Joi.date().required().messages({
      'date.base': 'Ngày bắt đầu không hợp lệ.',
      'date.empty': 'Ngày bắt đầu không được để trống.'
    }),
    endDate: Joi.date().greater(Joi.ref('startDate')).required().messages({
      'date.greater': 'Ngày kết thúc phải sau ngày bắt đầu.',
      'date.empty': 'Ngày kết thúc không được để trống.'
    }),
    reason: Joi.string().required().messages({
      'string.empty': 'Lý do nghỉ phép không được để trống.'
    })
  });

  return schema.validate(data);
};

// Validate cho yêu cầu tạo dự án
exports.validateProject = (data) => {
  const schema = Joi.object({
    name: Joi.string().required().messages({
      'string.empty': 'Tên dự án không được để trống.'
    }),
    description: Joi.string().optional(),
    startDate: Joi.date().required().messages({
      'date.base': 'Ngày bắt đầu không hợp lệ.',
      'date.empty': 'Ngày bắt đầu không được để trống.'
    }),
    endDate: Joi.date().greater(Joi.ref('startDate')).required().messages({
      'date.greater': 'Ngày kết thúc phải sau ngày bắt đầu.',
      'date.empty': 'Ngày kết thúc không được để trống.'
    }),
    status: Joi.string().valid('ongoing', 'completed', 'pending').required().messages({
      'any.only': 'Trạng thái không hợp lệ.',
      'string.empty': 'Trạng thái không được để trống.'
    }),
  });

  return schema.validate(data);
};

// Validate cho thông tin báo cáo hàng ngày (Daily Report)
exports.validateDailyReport = (data) => {
  const schema = Joi.object({
    date: Joi.date().required().messages({
      'date.base': 'Ngày báo cáo không hợp lệ.',
      'date.empty': 'Ngày báo cáo không được để trống.'
    }),
    tasks: Joi.array().items(
      Joi.object({
        task: Joi.string().required().messages({
          'string.empty': 'Tên công việc không được để trống.'
        }),
        project: Joi.string().required().messages({
          'string.empty': 'Tên dự án không được để trống.'
        }),
        hoursSpent: Joi.number().min(1).required().messages({
          'number.min': 'Số giờ làm phải lớn hơn hoặc bằng 1.',
          'number.base': 'Số giờ làm không hợp lệ.'
        }),
        workType: Joi.string().valid('Coding', 'Meeting', 'FixBug', 'Other').required().messages({
          'any.only': 'Loại công việc không hợp lệ.'
        }),
        workShift: Joi.number().required().messages({
          'number.base': 'Loại ca làm không hợp lệ.'
        }),
        issues: Joi.string().optional()
      })
    ).min(1).required().messages({
      'array.min': 'Phải có ít nhất một công việc trong báo cáo.'
    }),
    status: Joi.string().valid('pending', 'approved', 'rejected').required().messages({
      'any.only': 'Trạng thái báo cáo không hợp lệ.'
    }),
    notes: Joi.string().optional()
  });

  return schema.validate(data);
};
