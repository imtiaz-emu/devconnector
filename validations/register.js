const validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = validateUserRegisterInputs = data => {
  let errors = {};

  data.name = isEmpty(data.name) ? "" : data.name;
  data.email = isEmpty(data.email) ? "" : data.email;
  data.password = isEmpty(data.password) ? "" : data.password;
  data.password_confirmation = isEmpty(data.password_confirmation)
    ? ""
    : data.password_confirmation;

  if (!validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.name =
      "Name must be between minimum 2 characters and maximum 30 characters";
  }

  if (validator.isEmpty(data.name)) {
    errors.name = "Name is required";
  }

  if (!validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }

  if (validator.isEmpty(data.email)) {
    errors.email = "Email is required";
  }

  if (!validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = "Password should be at least 6 characters long";
  }

  if (validator.isEmpty(data.password)) {
    errors.password = "Password is required";
  }

  if (!validator.equals(data.password, data.password_confirmation)) {
    errors.password = "Password mismatch";
  }

  if (validator.isEmpty(data.password_confirmation)) {
    errors.password_confirmation = "Password confirmation is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
