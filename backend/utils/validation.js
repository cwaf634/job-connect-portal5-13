
const validator = require('validator');

// Validation functions
const validateEmail = (email) => {
  return validator.isEmail(email);
};

const validatePassword = (password) => {
  return password && password.length >= 6;
};

const validatePhone = (phone) => {
  return phone && validator.isMobilePhone(phone, 'en-IN');
};

const validateRequired = (value) => {
  return value && value.toString().trim().length > 0;
};

const validateObjectId = (id) => {
  return validator.isMongoId(id);
};

const validateDate = (date) => {
  return validator.isISO8601(date);
};

const validateURL = (url) => {
  return validator.isURL(url);
};

// Validation schemas
const userValidation = {
  register: (data) => {
    const errors = [];

    if (!validateRequired(data.name)) {
      errors.push('Name is required');
    }

    if (!validateEmail(data.email)) {
      errors.push('Valid email is required');
    }

    if (!validatePassword(data.password)) {
      errors.push('Password must be at least 6 characters long');
    }

    if (!validateRequired(data.userType)) {
      errors.push('User type is required');
    }

    if (!['student', 'employer', 'admin'].includes(data.userType)) {
      errors.push('Invalid user type');
    }

    if (data.phone && !validatePhone(data.phone)) {
      errors.push('Valid phone number is required');
    }

    return errors;
  },

  login: (data) => {
    const errors = [];

    if (!validateEmail(data.email)) {
      errors.push('Valid email is required');
    }

    if (!validateRequired(data.password)) {
      errors.push('Password is required');
    }

    return errors;
  }
};

const jobValidation = {
  create: (data) => {
    const errors = [];

    if (!validateRequired(data.title)) {
      errors.push('Job title is required');
    }

    if (!validateRequired(data.department)) {
      errors.push('Department is required');
    }

    if (!validateRequired(data.location)) {
      errors.push('Location is required');
    }

    if (!validateRequired(data.salary)) {
      errors.push('Salary is required');
    }

    if (!validateRequired(data.description)) {
      errors.push('Job description is required');
    }

    if (!Array.isArray(data.qualifications) || data.qualifications.length === 0) {
      errors.push('At least one qualification is required');
    }

    if (!validateRequired(data.experience)) {
      errors.push('Experience requirement is required');
    }

    if (!validateURL(data.govtLink)) {
      errors.push('Valid government link is required');
    }

    if (!validateDate(data.applicationDeadline)) {
      errors.push('Valid application deadline is required');
    }

    return errors;
  }
};

const applicationValidation = {
  submit: (data) => {
    const errors = [];

    if (!validateObjectId(data.jobId)) {
      errors.push('Valid job ID is required');
    }

    if (!validateRequired(data.coverLetter)) {
      errors.push('Cover letter is required');
    }

    return errors;
  }
};

module.exports = {
  validateEmail,
  validatePassword,
  validatePhone,
  validateRequired,
  validateObjectId,
  validateDate,
  validateURL,
  userValidation,
  jobValidation,
  applicationValidation
};
