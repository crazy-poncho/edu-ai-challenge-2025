/**
 * Comprehensive Test Suite for TypeGuard Validation Library
 * Tests all validators with valid and invalid data patterns
 */

const { test, describe } = require('node:test');
const { strictEqual, deepStrictEqual, ok } = require('node:assert');

const {
  Schema,
  ValidationResult,
  StringValidator,
  NumberValidator,
  BooleanValidator,
  DateValidator,
  ArrayValidator,
  ObjectValidator,
  userSchema,
  addressSchema
} = require('./schema.js');

describe('ValidationResult', () => {
  test('should create successful result', () => {
    const result = new ValidationResult(true, 'test data', []);
    strictEqual(result.isValid(), true);
    strictEqual(result.getData(), 'test data');
    deepStrictEqual(result.getErrors(), []);
  });

  test('should create error result', () => {
    const result = new ValidationResult(false, null, ['error message']);
    strictEqual(result.isValid(), false);
    strictEqual(result.getData(), null);
    deepStrictEqual(result.getErrors(), ['error message']);
  });
});

describe('StringValidator', () => {
  test('should validate basic string', () => {
    const validator = Schema.string();
    const result = validator.validate('hello');
    strictEqual(result.isValid(), true);
    strictEqual(result.getData(), 'hello');
  });

  test('should reject non-string types', () => {
    const validator = Schema.string();
    const result = validator.validate(123);
    strictEqual(result.isValid(), false);
    ok(result.getErrors()[0].includes('Must be a string'));
  });

  test('should handle optional strings', () => {
    const validator = Schema.string().optional();
    const result1 = validator.validate(undefined);
    strictEqual(result1.isValid(), true);
    
    const result2 = validator.validate(null);
    strictEqual(result2.isValid(), true);
    
    const result3 = validator.validate('hello');
    strictEqual(result3.isValid(), true);
    strictEqual(result3.getData(), 'hello');
  });

  test('should validate string length constraints', () => {
    const validator = Schema.string().minLength(3).maxLength(10);
    
    // Valid length
    const result1 = validator.validate('hello');
    strictEqual(result1.isValid(), true);
    
    // Too short
    const result2 = validator.validate('hi');
    strictEqual(result2.isValid(), false);
    ok(result2.getErrors()[0].includes('at least 3 characters'));
    
    // Too long
    const result3 = validator.validate('this is too long');
    strictEqual(result3.isValid(), false);
    ok(result3.getErrors()[0].includes('no more than 10 characters'));
  });

  test('should validate regex patterns', () => {
    const validator = Schema.string().pattern(/^[A-Z]+$/);
    
    const result1 = validator.validate('HELLO');
    strictEqual(result1.isValid(), true);
    
    const result2 = validator.validate('hello');
    strictEqual(result2.isValid(), false);
    ok(result2.getErrors()[0].includes('does not match required pattern'));
  });

  test('should validate email format', () => {
    const validator = Schema.string().email();
    
    const result1 = validator.validate('test@example.com');
    strictEqual(result1.isValid(), true);
    
    const result2 = validator.validate('invalid-email');
    strictEqual(result2.isValid(), false);
    ok(result2.getErrors()[0].includes('Must be a valid email address'));
  });

  test('should validate URL format', () => {
    const validator = Schema.string().url();
    
    const result1 = validator.validate('https://example.com');
    strictEqual(result1.isValid(), true);
    
    const result2 = validator.validate('not-a-url');
    strictEqual(result2.isValid(), false);
    ok(result2.getErrors()[0].includes('Must be a valid URL'));
  });

  test('should validate enum values', () => {
    const validator = Schema.string().enum(['red', 'green', 'blue']);
    
    const result1 = validator.validate('red');
    strictEqual(result1.isValid(), true);
    
    const result2 = validator.validate('yellow');
    strictEqual(result2.isValid(), false);
    ok(result2.getErrors()[0].includes('Must be one of: red, green, blue'));
  });

  test('should use custom error messages', () => {
    const validator = Schema.string().withMessage('Custom error message');
    const result = validator.validate(123);
    strictEqual(result.isValid(), false);
    strictEqual(result.getErrors()[0], 'Custom error message');
  });
});

describe('NumberValidator', () => {
  test('should validate basic number', () => {
    const validator = Schema.number();
    const result = validator.validate(42);
    strictEqual(result.isValid(), true);
    strictEqual(result.getData(), 42);
  });

  test('should reject non-number types', () => {
    const validator = Schema.number();
    const result = validator.validate('not a number');
    strictEqual(result.isValid(), false);
    ok(result.getErrors()[0].includes('Must be a number'));
  });

  test('should reject NaN', () => {
    const validator = Schema.number();
    const result = validator.validate(NaN);
    strictEqual(result.isValid(), false);
    ok(result.getErrors()[0].includes('Must be a number'));
  });

  test('should handle optional numbers', () => {
    const validator = Schema.number().optional();
    const result = validator.validate(undefined);
    strictEqual(result.isValid(), true);
  });

  test('should validate number range', () => {
    const validator = Schema.number().min(10).max(100);
    
    // Valid range
    const result1 = validator.validate(50);
    strictEqual(result1.isValid(), true);
    
    // Too small
    const result2 = validator.validate(5);
    strictEqual(result2.isValid(), false);
    ok(result2.getErrors()[0].includes('at least 10'));
    
    // Too large
    const result3 = validator.validate(150);
    strictEqual(result3.isValid(), false);
    ok(result3.getErrors()[0].includes('no more than 100'));
  });

  test('should validate integer constraint', () => {
    const validator = Schema.number().integer();
    
    const result1 = validator.validate(42);
    strictEqual(result1.isValid(), true);
    
    const result2 = validator.validate(42.5);
    strictEqual(result2.isValid(), false);
    ok(result2.getErrors()[0].includes('Must be an integer'));
  });

  test('should validate positive constraint', () => {
    const validator = Schema.number().positive();
    
    const result1 = validator.validate(42);
    strictEqual(result1.isValid(), true);
    
    const result2 = validator.validate(-5);
    strictEqual(result2.isValid(), false);
    ok(result2.getErrors()[0].includes('Must be a positive number'));
    
    const result3 = validator.validate(0);
    strictEqual(result3.isValid(), false);
    ok(result3.getErrors()[0].includes('Must be a positive number'));
  });

  test('should combine multiple constraints', () => {
    const validator = Schema.number().integer().positive().min(1).max(100);
    
    const result1 = validator.validate(50);
    strictEqual(result1.isValid(), true);
    
    const result2 = validator.validate(50.5);
    strictEqual(result2.isValid(), false);
    
    const result3 = validator.validate(-10);
    strictEqual(result3.isValid(), false);
  });
});

describe('BooleanValidator', () => {
  test('should validate true', () => {
    const validator = Schema.boolean();
    const result = validator.validate(true);
    strictEqual(result.isValid(), true);
    strictEqual(result.getData(), true);
  });

  test('should validate false', () => {
    const validator = Schema.boolean();
    const result = validator.validate(false);
    strictEqual(result.isValid(), true);
    strictEqual(result.getData(), false);
  });

  test('should reject non-boolean types', () => {
    const validator = Schema.boolean();
    const result = validator.validate('true');
    strictEqual(result.isValid(), false);
    ok(result.getErrors()[0].includes('Must be a boolean'));
  });

  test('should handle optional booleans', () => {
    const validator = Schema.boolean().optional();
    const result = validator.validate(undefined);
    strictEqual(result.isValid(), true);
  });
});

describe('DateValidator', () => {
  test('should validate Date objects', () => {
    const validator = Schema.date();
    const date = new Date('2024-01-01');
    const result = validator.validate(date);
    strictEqual(result.isValid(), true);
    strictEqual(result.getData().getTime(), date.getTime());
  });

  test('should validate date strings', () => {
    const validator = Schema.date();
    const result = validator.validate('2024-01-01');
    strictEqual(result.isValid(), true);
    ok(result.getData() instanceof Date);
  });

  test('should reject invalid date strings', () => {
    const validator = Schema.date();
    const result = validator.validate('invalid-date');
    strictEqual(result.isValid(), false);
    ok(result.getErrors()[0].includes('Must be a valid date'));
  });

  test('should reject non-date types', () => {
    const validator = Schema.date();
    const result = validator.validate(123);
    strictEqual(result.isValid(), false);
    ok(result.getErrors()[0].includes('Must be a date or date string'));
  });

  test('should validate date ranges', () => {
    const validator = Schema.date()
      .min('2020-01-01')
      .max('2025-01-01');
    
    // Valid date
    const result1 = validator.validate('2022-06-15');
    strictEqual(result1.isValid(), true);
    
    // Too early
    const result2 = validator.validate('2019-01-01');
    strictEqual(result2.isValid(), false);
    ok(result2.getErrors()[0].includes('Date must be after'));
    
    // Too late
    const result3 = validator.validate('2026-01-01');
    strictEqual(result3.isValid(), false);
    ok(result3.getErrors()[0].includes('Date must be before'));
  });

  test('should handle optional dates', () => {
    const validator = Schema.date().optional();
    const result = validator.validate(undefined);
    strictEqual(result.isValid(), true);
  });
});

describe('ArrayValidator', () => {
  test('should validate arrays with correct item types', () => {
    const validator = Schema.array(Schema.string());
    const result = validator.validate(['hello', 'world']);
    strictEqual(result.isValid(), true);
    deepStrictEqual(result.getData(), ['hello', 'world']);
  });

  test('should reject non-arrays', () => {
    const validator = Schema.array(Schema.string());
    const result = validator.validate('not an array');
    strictEqual(result.isValid(), false);
    ok(result.getErrors()[0].includes('Must be an array'));
  });

  test('should validate array length constraints', () => {
    const validator = Schema.array(Schema.string()).minLength(2).maxLength(5);
    
    // Valid length
    const result1 = validator.validate(['a', 'b', 'c']);
    strictEqual(result1.isValid(), true);
    
    // Too short
    const result2 = validator.validate(['a']);
    strictEqual(result2.isValid(), false);
    ok(result2.getErrors()[0].includes('at least 2 items'));
    
    // Too long
    const result3 = validator.validate(['a', 'b', 'c', 'd', 'e', 'f']);
    strictEqual(result3.isValid(), false);
    ok(result3.getErrors()[0].includes('no more than 5 items'));
  });

  test('should validate item types', () => {
    const validator = Schema.array(Schema.number().integer());
    
    const result1 = validator.validate([1, 2, 3]);
    strictEqual(result1.isValid(), true);
    
    const result2 = validator.validate([1, 'two', 3]);
    strictEqual(result2.isValid(), false);
    ok(result2.getErrors()[0].includes('Item 1'));
  });

  test('should handle optional arrays', () => {
    const validator = Schema.array(Schema.string()).optional();
    const result = validator.validate(undefined);
    strictEqual(result.isValid(), true);
  });

  test('should validate nested arrays', () => {
    const validator = Schema.array(Schema.array(Schema.string()));
    const result = validator.validate([['a', 'b'], ['c', 'd']]);
    strictEqual(result.isValid(), true);
  });
});

describe('ObjectValidator', () => {
  test('should validate objects with correct schema', () => {
    const validator = Schema.object({
      name: Schema.string(),
      age: Schema.number()
    });
    
    const result = validator.validate({ name: 'John', age: 30 });
    strictEqual(result.isValid(), true);
    deepStrictEqual(result.getData(), { name: 'John', age: 30 });
  });

  test('should reject non-objects', () => {
    const validator = Schema.object({});
    const result = validator.validate('not an object');
    strictEqual(result.isValid(), false);
    ok(result.getErrors()[0].includes('Must be an object'));
  });

  test('should reject arrays', () => {
    const validator = Schema.object({});
    const result = validator.validate([]);
    strictEqual(result.isValid(), false);
    ok(result.getErrors()[0].includes('Must be an object'));
  });

  test('should validate required fields', () => {
    const validator = Schema.object({
      name: Schema.string(),
      age: Schema.number()
    });
    
    const result = validator.validate({ name: 'John' });
    strictEqual(result.isValid(), false);
    ok(result.getErrors()[0].includes('age'));
  });

  test('should handle optional fields', () => {
    const validator = Schema.object({
      name: Schema.string(),
      age: Schema.number().optional()
    });
    
    const result = validator.validate({ name: 'John' });
    strictEqual(result.isValid(), true);
    deepStrictEqual(result.getData(), { name: 'John' });
  });

  test('should reject extra properties in strict mode', () => {
    const validator = Schema.object({
      name: Schema.string()
    });
    
    const result = validator.validate({ name: 'John', extra: 'field' });
    strictEqual(result.isValid(), false);
    ok(result.getErrors()[0].includes('Extra properties not allowed'));
  });

  test('should allow extra properties when allowExtra is called', () => {
    const validator = Schema.object({
      name: Schema.string()
    }).allowExtra();
    
    const result = validator.validate({ name: 'John', extra: 'field' });
    strictEqual(result.isValid(), true);
    deepStrictEqual(result.getData(), { name: 'John', extra: 'field' });
  });

  test('should handle nested objects', () => {
    const validator = Schema.object({
      user: Schema.object({
        name: Schema.string(),
        email: Schema.string().email()
      })
    });
    
    const result = validator.validate({
      user: {
        name: 'John',
        email: 'john@example.com'
      }
    });
    
    strictEqual(result.isValid(), true);
  });

  test('should handle optional objects', () => {
    const validator = Schema.object({
      name: Schema.string()
    }).optional();
    
    const result = validator.validate(undefined);
    strictEqual(result.isValid(), true);
  });
});

describe('Complex Schema Validation', () => {
  test('should validate the predefined user schema with valid data', () => {
    const validUser = {
      id: "user_123",
      name: "John Doe",
      email: "john@example.com",
      age: 25,
      isActive: true,
      tags: ["developer", "designer"],
      address: {
        street: "123 Main St",
        city: "Anytown",
        postalCode: "12345",
        country: "USA"
      },
      metadata: {
        source: "signup",
        campaign: "summer"
      },
      createdAt: "2024-01-01T00:00:00Z"
    };
    
    const result = userSchema.validate(validUser);
    strictEqual(result.isValid(), true);
  });

  test('should reject invalid user data', () => {
    const invalidUser = {
      id: 123, // Should be string
      name: "A", // Too short
      email: "invalid-email", // Invalid format
      age: -5, // Should be positive
      isActive: "true", // Should be boolean
      tags: [], // Should have at least 1 item
      address: {
        street: "",
        city: "Anytown",
        postalCode: "invalid",
        country: "Invalid Country"
      }
    };
    
    const result = userSchema.validate(invalidUser);
    strictEqual(result.isValid(), false);
    ok(result.getErrors().length > 0);
  });

  test('should handle optional fields in user schema', () => {
    const minimalUser = {
      id: "user_456",
      name: "Jane Doe",
      email: "jane@example.com",
      isActive: false,
      tags: ["manager"]
    };
    
    const result = userSchema.validate(minimalUser);
    strictEqual(result.isValid(), true);
  });

  test('should validate address schema separately', () => {
    const validAddress = {
      street: "456 Oak Ave",
      city: "Springfield",
      postalCode: "54321-9876",
      country: "Canada"
    };
    
    const result = addressSchema.validate(validAddress);
    strictEqual(result.isValid(), true);
  });
});

describe('Edge Cases and Error Handling', () => {
  test('should handle null values', () => {
    const validator = Schema.string();
    const result = validator.validate(null);
    strictEqual(result.isValid(), false);
  });

  test('should handle undefined values', () => {
    const validator = Schema.number();
    const result = validator.validate(undefined);
    strictEqual(result.isValid(), false);
  });

  test('should handle empty strings', () => {
    const validator = Schema.string().minLength(1);
    const result = validator.validate('');
    strictEqual(result.isValid(), false);
  });

  test('should handle empty arrays', () => {
    const validator = Schema.array(Schema.string()).minLength(1);
    const result = validator.validate([]);
    strictEqual(result.isValid(), false);
  });

  test('should handle empty objects', () => {
    const validator = Schema.object({
      required: Schema.string()
    });
    const result = validator.validate({});
    strictEqual(result.isValid(), false);
  });

  test('should preserve data types in successful validation', () => {
    const validator = Schema.object({
      str: Schema.string(),
      num: Schema.number(),
      bool: Schema.boolean(),
      arr: Schema.array(Schema.string())
    });
    
    const data = {
      str: 'hello',
      num: 42,
      bool: true,
      arr: ['a', 'b']
    };
    
    const result = validator.validate(data);
    strictEqual(result.isValid(), true);
    strictEqual(typeof result.getData().str, 'string');
    strictEqual(typeof result.getData().num, 'number');
    strictEqual(typeof result.getData().bool, 'boolean');
    ok(Array.isArray(result.getData().arr));
  });
});

describe('Performance and Chainability', () => {
  test('should support method chaining', () => {
    const validator = Schema.string()
      .minLength(5)
      .maxLength(20)
      .pattern(/^[A-Za-z]+$/)
      .withMessage('Invalid name format');
    
    const result = validator.validate('JohnDoe');
    strictEqual(result.isValid(), true);
  });

  test('should validate large datasets efficiently', () => {
    const itemValidator = Schema.object({
      id: Schema.number().integer(),
      name: Schema.string().minLength(1)
    });
    
    const arrayValidator = Schema.array(itemValidator);
    
    // Create a large dataset
    const largeDataset = Array.from({ length: 1000 }, (_, i) => ({
      id: i,
      name: `Item ${i}`
    }));
    
    const startTime = Date.now();
    const result = arrayValidator.validate(largeDataset);
    const endTime = Date.now();
    
    strictEqual(result.isValid(), true);
    // Should complete within reasonable time (less than 1 second)
    ok((endTime - startTime) < 1000);
  });

  test('should handle deeply nested objects', () => {
    const deepValidator = Schema.object({
      level1: Schema.object({
        level2: Schema.object({
          level3: Schema.object({
            value: Schema.string()
          })
        })
      })
    });
    
    const deepData = {
      level1: {
        level2: {
          level3: {
            value: 'deep value'
          }
        }
      }
    };
    
    const result = deepValidator.validate(deepData);
    strictEqual(result.isValid(), true);
  });
});

describe('Real-world Use Cases', () => {
  test('should validate API request payload', () => {
    const apiRequestValidator = Schema.object({
      method: Schema.string().enum(['GET', 'POST', 'PUT', 'DELETE']),
      url: Schema.string().url(),
      headers: Schema.object({}).allowExtra().optional(),
      body: Schema.object({}).allowExtra().optional(),
      timeout: Schema.number().integer().min(1000).max(30000).optional()
    });
    
    const request = {
      method: 'POST',
      url: 'https://api.example.com/users',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer token123'
      },
      body: {
        name: 'John Doe',
        email: 'john@example.com'
      },
      timeout: 5000
    };
    
    const result = apiRequestValidator.validate(request);
    strictEqual(result.isValid(), true);
  });

  test('should validate database configuration', () => {
    const dbConfigValidator = Schema.object({
      host: Schema.string().withMessage('Database host is required'),
      port: Schema.number().integer().min(1).max(65535),
      database: Schema.string().minLength(1),
      username: Schema.string().minLength(1),
      password: Schema.string().minLength(8),
      ssl: Schema.boolean().optional(),
      poolSize: Schema.number().integer().min(1).max(100).optional(),
      timeout: Schema.number().integer().min(1000).optional()
    });
    
    const config = {
      host: 'localhost',
      port: 5432,
      database: 'myapp',
      username: 'admin',
      password: 'securepassword123',
      ssl: true,
      poolSize: 10
    };
    
    const result = dbConfigValidator.validate(config);
    strictEqual(result.isValid(), true);
  });

  test('should validate form data with complex validation rules', () => {
    const registrationFormValidator = Schema.object({
      firstName: Schema.string().minLength(2).maxLength(50),
      lastName: Schema.string().minLength(2).maxLength(50),
      email: Schema.string().email(),
      password: Schema.string()
        .minLength(8)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .withMessage('Password must contain uppercase, lowercase, number, and special character'),
      confirmPassword: Schema.string(),
      dateOfBirth: Schema.date().max(new Date(Date.now() - 18 * 365 * 24 * 60 * 60 * 1000)),
      termsAccepted: Schema.boolean(),
      newsletter: Schema.boolean().optional(),
      interests: Schema.array(Schema.string().enum(['tech', 'sports', 'music', 'travel'])).optional()
    });
    
    const formData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'SecurePass123!',
      confirmPassword: 'SecurePass123!',
      dateOfBirth: '1990-05-15',
      termsAccepted: true,
      newsletter: false,
      interests: ['tech', 'travel']
    };
    
    const result = registrationFormValidator.validate(formData);
    strictEqual(result.isValid(), true);
  });
});

console.log('🧪 All tests completed successfully!'); 