const validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = validateProfileInputs = data => {
  let errors = {};

  data.slug = isEmpty(data.slug) ? "" : data.slug;
  data.status = isEmpty(data.status) ? "" : data.status;
  data.skills = isEmpty(data.skills) ? "" : data.skills;

  if (validator.isEmpty(data.slug)) {
    errors.slug = "Slug/username is required";
  }

  if (!validator.isLength(data.slug, { min: 2, max: 40 })) {
    errors.slug = "Slug/username must be between 2-40 characters";
  }

  if (validator.isEmpty(data.status)) {
    errors.status = "Status is required";
  }

  if (validator.isEmpty(data.skills)) {
    errors.skills = "Skills are required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
