
import Joi from 'joi';

const getPatientSchema = Joi.object({
  phone: Joi.string()
    .pattern(/^\d+$/) 
    .required()
    .messages({
      'string.pattern.base': 'Phone must contain only digits.',
      'string.empty': 'Phone is required.',
    }),
  
  customer_id: Joi.number()
    .required()
    .messages({
      'any.required': 'Customer ID is required.',
      'number.base': 'Customer ID must be a number.',
    }),

    dob: Joi.string()
    .optional()
    .pattern(/^\d{4}-\d{2}-\d{2}$/) 
    .messages({
      'string.pattern.base': 'DOB must be in YYYY-MM-DD format.',
    }),
    first_name: Joi.string()
    .optional(),

  last_name: Joi.string()
    .optional(),

  zip: Joi.string()
    .optional()
    .pattern(/^\d{5}$/)
    .messages({
      'string.pattern.base': 'ZIP must be a 5-digit number.',
    }),
});

export const validateGetPatient = (req, res, next) => {
  const { error } = getPatientSchema.validate(req.query);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};
