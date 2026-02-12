const validate = (schema) => (req, res, next) => {
  try {
    const validatedData = schema.parse(req.body);
    req.validatedData = validatedData;
    next();
  } catch (error) {
    const formattedErrors = error.issues.map(issue => ({
      field: issue.path[0],
      message: issue.message
    }));

    return res.status(400).json({
      message: "Validation failed",
      errors: formattedErrors,
    });
  }
};


module.exports = validate;
