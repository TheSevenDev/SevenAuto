import { ComparisonExpression, Expression, LogicalExpression } from '../types';

/**
 * Validate a comparison expression
 * @param expr - The comparison expression to validate
 * @returns Validation result with error message if invalid
 */
function validateComparisonExpression(expr: ComparisonExpression): {
  isValid: boolean;
  error?: string;
} {
  // Check required fields
  if (!expr.field) {
    return { isValid: false, error: 'Field is required' };
  }

  if (expr.operator === undefined) {
    return { isValid: false, error: 'Operator is required' };
  }

  // Validate operator-specific rules
  switch (expr.operator) {
    case 'between':
      if (!Array.isArray(expr.value) || expr.value.length !== 2) {
        return {
          isValid: false,
          error: 'Between operator requires an array of exactly 2 values',
        };
      }
      if (expr.value.some((v) => v === undefined || v === null || v === '')) {
        return {
          isValid: false,
          error: 'Between operator values cannot be empty',
        };
      }
      break;

    case 'in':
    case 'nin':
      if (!Array.isArray(expr.value)) {
        return {
          isValid: false,
          error: `${expr.operator} operator requires an array value`,
        };
      }
      if (expr.value.length === 0) {
        return {
          isValid: false,
          error: `${expr.operator} operator requires at least one value`,
        };
      }
      if (expr.value.some((v) => v === undefined || v === null || v === '')) {
        return {
          isValid: false,
          error: `${expr.operator} operator values cannot be empty`,
        };
      }
      break;

    case 'contains':
      if (
        expr.value === undefined ||
        expr.value === null ||
        expr.value === ''
      ) {
        return {
          isValid: false,
          error: 'Contains operator requires a non-empty value',
        };
      }
      break;

    case 'exists':
      if (typeof expr.value !== 'boolean') {
        return {
          isValid: false,
          error: 'Exists operator requires a boolean value',
        };
      }
      break;

    default:
      if (
        expr.value === undefined ||
        expr.value === null ||
        expr.value === ''
      ) {
        return {
          isValid: false,
          error: 'Value is required for comparison operator',
        };
      }
  }

  return { isValid: true };
}

/**
 * Validate a logical expression
 * @param expr - The logical expression to validate
 * @returns Validation result with error message if invalid
 */
function validateLogicalExpression(expr: LogicalExpression): {
  isValid: boolean;
  error?: string;
} {
  if (expr.type === 'not') {
    if (!expr.expression) {
      return { isValid: false, error: 'Not operator requires an expression' };
    }
    const result = validateExpression(expr.expression);
    if (!result.isValid) {
      return {
        isValid: false,
        error: `Invalid not expression: ${result.error}`,
      };
    }
  } else {
    if (!Array.isArray(expr.expressions)) {
      return {
        isValid: false,
        error: `${expr.type} operator requires an array of expressions`,
      };
    }
    if (expr.expressions.length === 0) {
      return {
        isValid: false,
        error: `${expr.type} operator requires at least one expression`,
      };
    }

    const invalidExpression = expr.expressions.find(
      (subExpr) => !validateExpression(subExpr).isValid,
    );
    if (invalidExpression) {
      const result = validateExpression(invalidExpression);
      return {
        isValid: false,
        error: `Invalid ${expr.type} expression: ${result.error}`,
      };
    }
  }

  return { isValid: true };
}

/**
 * Validate an expression
 * @param expr - The expression to validate
 * @returns Validation result with error message if invalid
 */
export function validateExpression(expr: Expression | null): {
  isValid: boolean;
  error?: string;
} {
  if (!expr) {
    return { isValid: false, error: 'Expression cannot be null' };
  }

  if (expr.type === 'comparison') {
    return validateComparisonExpression(expr);
  }

  return validateLogicalExpression(expr);
}

/**
 * Create a default comparison expression
 * @returns A valid default comparison expression
 */
export function createDefaultComparisonExpression(): ComparisonExpression {
  return {
    type: 'comparison',
    field: '',
    operator: 'eq',
    value: '',
  };
}

/**
 * Create a default logical expression
 * @param type - The type of logical expression ('and' | 'or' | 'not')
 * @returns A valid default logical expression
 */
export function createDefaultLogicalExpression(
  type: 'and' | 'or' | 'not',
): LogicalExpression {
  if (type === 'not') {
    return {
      type: 'not',
      expression: createDefaultComparisonExpression(),
    };
  }

  return {
    type,
    expressions: [createDefaultComparisonExpression()],
  };
}
