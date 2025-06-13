/**
 * TypeGuard Validation Library
 * A comprehensive, type-safe validation library for JavaScript/TypeScript
 * 
 * Features:
 * - Type-safe validators for primitive and complex types
 * - Chainable validation methods
 * - Custom error messages
 * - Optional field support
 * - Nested object validation
 * - Array validation with item type checking
 */

/**
 * Base validation result interface
 */
class ValidationResult {
  constructor(success, data = null, errors = []) {
    this.success = success;
    this.data = data;
    this.errors = errors;
  }

  /**
   * Returns true if validation was successful
   */
  isValid() {
    return this.success;
  }

  /**
   * Returns validation errors
   */
  getErrors() {
    return this.errors;
  }

  /**
   * Returns validated data (only if successful)
   */
  getData() {
    return this.data;
  }
}

/**
 * Base validator class that all other validators extend
 */
class Validator {
  constructor() {
    this.isOptional = false;
    this.customMessage = null;
  }

  /**
   * Makes this field optional
   */
  optional() {
    this.isOptional = true;
    return this;
  }

  /**
   * Sets a custom error message
   */
  withMessage(message) {
    this.customMessage = message;
    return this;
  }

  /**
   * Abstract validate method - must be implemented by subclasses
   */
  validate(value) {
    throw new Error('validate method must be implemented by subclass');
  }

  /**
   * Helper method to create error result
   */
  _createError(message) {
    return new ValidationResult(false, null, [this.customMessage || message]);
  }

  /**
   * Helper method to create success result
   */
  _createSuccess(data) {
    return new ValidationResult(true, data, []);
  }
}

/**
 * String validator with chainable validation methods
 */
class StringValidator extends Validator {
  constructor() {
    super();
    this.minLengthValue = null;
    this.maxLengthValue = null;
    this.patternRegex = null;
    this.enumValues = null;
  }

  /**
   * Sets minimum length requirement
   */
  minLength(length) {
    this.minLengthValue = length;
    return this;
  }

  /**
   * Sets maximum length requirement
   */
  maxLength(length) {
    this.maxLengthValue = length;
    return this;
  }

  /**
   * Sets pattern requirement using regex
   */
  pattern(regex) {
    this.patternRegex = regex;
    return this;
  }

  /**
   * Sets enum values (whitelist)
   */
  enum(values) {
    this.enumValues = values;
    return this;
  }

  /**
   * Validates email format
   */
  email() {
    this.patternRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    this.customMessage = this.customMessage || 'Must be a valid email address';
    return this;
  }

  /**
   * Validates URL format
   */
  url() {
    this.patternRegex = /^https?:\/\/.+/;
    this.customMessage = this.customMessage || 'Must be a valid URL';
    return this;
  }

  validate(value) {
    // Handle optional values
    if (value === undefined || value === null) {
      if (this.isOptional) {
        return this._createSuccess(value);
      }
      return this._createError('String is required');
    }

    // Type check
    if (typeof value !== 'string') {
      return this._createError('Must be a string');
    }

    // Length validations
    if (this.minLengthValue !== null && value.length < this.minLengthValue) {
      return this._createError(`Must be at least ${this.minLengthValue} characters long`);
    }

    if (this.maxLengthValue !== null && value.length > this.maxLengthValue) {
      return this._createError(`Must be no more than ${this.maxLengthValue} characters long`);
    }

    // Pattern validation
    if (this.patternRegex && !this.patternRegex.test(value)) {
      return this._createError('does not match required pattern');
    }

    // Enum validation
    if (this.enumValues && !this.enumValues.includes(value)) {
      return this._createError(`Must be one of: ${this.enumValues.join(', ')}`);
    }

    return this._createSuccess(value);
  }
}

/**
 * Number validator with chainable validation methods
 */
class NumberValidator extends Validator {
  constructor() {
    super();
    this.minValue = null;
    this.maxValue = null;
    this.integerOnly = false;
    this.positiveOnly = false;
  }

  /**
   * Sets minimum value requirement
   */
  min(value) {
    this.minValue = value;
    return this;
  }

  /**
   * Sets maximum value requirement
   */
  max(value) {
    this.maxValue = value;
    return this;
  }

  /**
   * Requires integer values only
   */
  integer() {
    this.integerOnly = true;
    return this;
  }

  /**
   * Requires positive values only
   */
  positive() {
    this.positiveOnly = true;
    return this;
  }

  validate(value) {
    // Handle optional values
    if (value === undefined || value === null) {
      if (this.isOptional) {
        return this._createSuccess(value);
      }
      return this._createError('Number is required');
    }

    // Type check
    if (typeof value !== 'number' || isNaN(value)) {
      return this._createError('Must be a number');
    }

    // Integer check
    if (this.integerOnly && !Number.isInteger(value)) {
      return this._createError('Must be an integer');
    }

    // Positive check
    if (this.positiveOnly && value <= 0) {
      return this._createError('Must be a positive number');
    }

    // Range validations
    if (this.minValue !== null && value < this.minValue) {
      return this._createError(`Must be at least ${this.minValue}`);
    }

    if (this.maxValue !== null && value > this.maxValue) {
      return this._createError(`Must be no more than ${this.maxValue}`);
    }

    return this._createSuccess(value);
  }
}

/**
 * Boolean validator
 */
class BooleanValidator extends Validator {
  validate(value) {
    // Handle optional values
    if (value === undefined || value === null) {
      if (this.isOptional) {
        return this._createSuccess(value);
      }
      return this._createError('Boolean is required');
    }

    // Type check
    if (typeof value !== 'boolean') {
      return this._createError('Must be a boolean');
    }

    return this._createSuccess(value);
  }
}

/**
 * Date validator
 */
class DateValidator extends Validator {
  constructor() {
    super();
    this.minDate = null;
    this.maxDate = null;
  }

  /**
   * Sets minimum date requirement
   */
  min(date) {
    this.minDate = new Date(date);
    return this;
  }

  /**
   * Sets maximum date requirement
   */
  max(date) {
    this.maxDate = new Date(date);
    return this;
  }

  validate(value) {
    // Handle optional values
    if (value === undefined || value === null) {
      if (this.isOptional) {
        return this._createSuccess(value);
      }
      return this._createError('Date is required');
    }

    // Convert to Date if it's a string
    let date;
    if (typeof value === 'string') {
      date = new Date(value);
    } else if (value instanceof Date) {
      date = value;
    } else {
      return this._createError('Must be a date or date string');
    }

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return this._createError('Must be a valid date');
    }

    // Range validations
    if (this.minDate && date < this.minDate) {
      return this._createError(`Date must be after ${this.minDate.toISOString()}`);
    }

    if (this.maxDate && date > this.maxDate) {
      return this._createError(`Date must be before ${this.maxDate.toISOString()}`);
    }

    return this._createSuccess(date);
  }
}

/**
 * Array validator with item type validation
 */
class ArrayValidator extends Validator {
  constructor(itemValidator) {
    super();
    this.itemValidator = itemValidator;
    this.minLengthValue = null;
    this.maxLengthValue = null;
  }

  /**
   * Sets minimum array length requirement
   */
  minLength(length) {
    this.minLengthValue = length;
    return this;
  }

  /**
   * Sets maximum array length requirement
   */
  maxLength(length) {
    this.maxLengthValue = length;
    return this;
  }

  validate(value) {
    // Handle optional values
    if (value === undefined || value === null) {
      if (this.isOptional) {
        return this._createSuccess(value);
      }
      return this._createError('Array is required');
    }

    // Type check
    if (!Array.isArray(value)) {
      return this._createError('Must be an array');
    }

    // Length validations
    if (this.minLengthValue !== null && value.length < this.minLengthValue) {
      return this._createError(`Array must have at least ${this.minLengthValue} items`);
    }

    if (this.maxLengthValue !== null && value.length > this.maxLengthValue) {
      return this._createError(`Array must have no more than ${this.maxLengthValue} items`);
    }

    // Validate each item
    const validatedItems = [];
    const errors = [];

    for (let i = 0; i < value.length; i++) {
      const itemResult = this.itemValidator.validate(value[i]);
      if (itemResult.success) {
        validatedItems.push(itemResult.data);
      } else {
        errors.push(`Item ${i}: ${itemResult.errors.join(', ')}`);
      }
    }

    if (errors.length > 0) {
      return new ValidationResult(false, null, errors);
    }

    return this._createSuccess(validatedItems);
  }
}

/**
 * Object validator with schema-based validation
 */
class ObjectValidator extends Validator {
  constructor(schema) {
    super();
    this.schema = schema;
    this.strictMode = true; // By default, don't allow extra properties
  }

  /**
   * Allows extra properties in the object
   */
  allowExtra() {
    this.strictMode = false;
    return this;
  }

  validate(value) {
    // Handle optional values
    if (value === undefined || value === null) {
      if (this.isOptional) {
        return this._createSuccess(value);
      }
      return this._createError('Object is required');
    }

    // Type check
    if (typeof value !== 'object' || Array.isArray(value)) {
      return this._createError('Must be an object');
    }

    const validatedObject = {};
    const errors = [];

    // Validate each property in the schema
    for (const [key, validator] of Object.entries(this.schema)) {
      const result = validator.validate(value[key]);
      if (result.success) {
        if (result.data !== undefined && result.data !== null) {
          validatedObject[key] = result.data;
        }
      } else {
        errors.push(`${key}: ${result.errors.join(', ')}`);
      }
    }

    // Check for extra properties in strict mode
    if (this.strictMode) {
      const schemaKeys = Object.keys(this.schema);
      const valueKeys = Object.keys(value);
      const extraKeys = valueKeys.filter(key => !schemaKeys.includes(key));
      
      if (extraKeys.length > 0) {
        errors.push(`Extra properties not allowed: ${extraKeys.join(', ')}`);
      }
    } else {
      // In non-strict mode, include extra properties
      for (const [key, val] of Object.entries(value)) {
        if (!(key in this.schema)) {
          validatedObject[key] = val;
        }
      }
    }

    if (errors.length > 0) {
      return new ValidationResult(false, null, errors);
    }

    return this._createSuccess(validatedObject);
  }
}

/**
 * Main Schema builder class with static factory methods
 */
class Schema {
  /**
   * Creates a string validator
   * @returns {StringValidator} String validator instance
   * 
   * @example
   * const nameValidator = Schema.string().minLength(2).maxLength(50);
   * const result = nameValidator.validate("John");
   */
  static string() {
    return new StringValidator();
  }
  
  /**
   * Creates a number validator
   * @returns {NumberValidator} Number validator instance
   * 
   * @example
   * const ageValidator = Schema.number().min(0).max(120).integer();
   * const result = ageValidator.validate(25);
   */
  static number() {
    return new NumberValidator();
  }
  
  /**
   * Creates a boolean validator
   * @returns {BooleanValidator} Boolean validator instance
   * 
   * @example
   * const activeValidator = Schema.boolean();
   * const result = activeValidator.validate(true);
   */
  static boolean() {
    return new BooleanValidator();
  }
  
  /**
   * Creates a date validator
   * @returns {DateValidator} Date validator instance
   * 
   * @example
   * const dobValidator = Schema.date().max(new Date());
   * const result = dobValidator.validate("1990-01-01");
   */
  static date() {
    return new DateValidator();
  }
  
  /**
   * Creates an object validator with schema
   * @param {Object} schema - Object schema definition
   * @returns {ObjectValidator} Object validator instance
   * 
   * @example
   * const userValidator = Schema.object({
   *   name: Schema.string().minLength(2),
   *   age: Schema.number().integer().min(0)
   * });
   */
  static object(schema) {
    return new ObjectValidator(schema);
  }
  
  /**
   * Creates an array validator with item type validation
   * @param {Validator} itemValidator - Validator for array items
   * @returns {ArrayValidator} Array validator instance
   * 
   * @example
   * const tagsValidator = Schema.array(Schema.string().minLength(1));
   * const result = tagsValidator.validate(["tag1", "tag2"]);
   */
  static array(itemValidator) {
    return new ArrayValidator(itemValidator);
  }
}

// Define a complex schema example
const addressSchema = Schema.object({
  street: Schema.string().minLength(1).withMessage('Street is required'),
  city: Schema.string().minLength(1).withMessage('City is required'),
  postalCode: Schema.string().pattern(/^\d{5}(-\d{4})?$/).withMessage('Postal code must be 5 digits or 5+4 format'),
  country: Schema.string().enum(['USA', 'Canada', 'Mexico']).withMessage('Country must be USA, Canada, or Mexico')
});

const userSchema = Schema.object({
  id: Schema.string().withMessage('ID must be a string'),
  name: Schema.string().minLength(2).maxLength(50).withMessage('Name must be 2-50 characters'),
  email: Schema.string().email().withMessage('Must be a valid email address'),
  age: Schema.number().integer().min(0).max(120).optional(),
  isActive: Schema.boolean(),
  tags: Schema.array(Schema.string().minLength(1)).minLength(1),
  address: addressSchema.optional(),
  metadata: Schema.object({}).allowExtra().optional(),
  createdAt: Schema.date().max(new Date()).optional()
});

// Example usage with comprehensive data
const userData = {
  id: "user_12345",
  name: "John Doe",
  email: "john.doe@example.com",
  age: 30,
  isActive: true,
  tags: ["developer", "designer", "team-lead"],
  address: {
    street: "123 Main Street",
    city: "Anytown",
    postalCode: "12345-6789",
    country: "USA"
  },
  metadata: {
    source: "signup_form",
    campaign: "summer_2024"
  },
  createdAt: "2024-01-15T10:30:00Z"
};

// Validate the data
const result = userSchema.validate(userData);

if (result.isValid()) {
  console.log('✅ Validation successful!');
  console.log('Validated data:', JSON.stringify(result.getData(), null, 2));
} else {
  console.log('❌ Validation failed!');
  console.log('Errors:', result.getErrors());
}

// Export all classes for testing and external use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    Schema,
    ValidationResult,
    Validator,
    StringValidator,
    NumberValidator,
    BooleanValidator,
    DateValidator,
    ArrayValidator,
    ObjectValidator,
    userSchema,
    addressSchema
  };
}
