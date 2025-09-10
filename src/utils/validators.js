export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  // At least 8 chars, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
};

export const validateKVK = (kvk_number) => {
  // Dutch Chamber of Commerce number validation (8 digits)
  const kvkRegex = /^\d{8}$/;
  return kvkRegex.test(kvk_number);
};

export const registerStep1Validator = (values) => {
  const errors = {};
  
  if (!values.first_name) errors.first_name = 'First name is required';
  if (!values.last_name) errors.last_name = 'Last name is required';
  
  if (!values.email) {
    errors.email = 'Email is required';
  } else if (!validateEmail(values.email)) {
    errors.email = 'Please enter a valid email address';
  }
  
  if (!values.password) {
    errors.password = 'Password is required';
  } else if (!validatePassword(values.password)) {
    errors.password = 'Password must be at least 8 characters with uppercase, lowercase, and number';
  }
  
  if (!values.confirm_password) {
    errors.confirm_password = 'Please confirm your password';
  } else if (values.password !== values.confirm_password) {
    errors.confirm_password = 'Passwords do not match';
  }
  
  return errors;
};

export const registerStep2Validator = (values) => {
  const errors = {};
  
  if (!values.company_name) errors.company_name = 'Company name is required';
  
  if (!values.kvk_number) {
    errors.kvk_number = 'KvK number is required';
  } else if (!validateKVK(values.kvk_number)) {
    errors.kvk_number = 'Please enter a valid 8-digit KvK number';
  }
  
  if (!values.legal_form) errors.legal_form = 'Legal form is required';
  if (!values.reporting_period) errors.reporting_period = 'Reporting period is required';
  
  return errors;
};