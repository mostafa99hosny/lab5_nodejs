const joi = require('joi');

exports.userSchema = joi.object({
  firstName: joi.string(),
  lastName: joi.string(),
  username: joi.string().required(),
  password: joi.string().min(6).required(),
  role: joi.string().valid('admin', 'user').default('user')
});

exports.validate = (schema) => {
  return (req, res, next) => {
    let x = schema.validate(req.body, { abortEarly: false });
    if (x.error) {
      return res.status(400).json({
        status: "fail",
        message: x.error.details[0].message
      });
    }
    next();
  };
};
