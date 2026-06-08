import { Expression } from '../types';

function safeToString(value: unknown): string {
  if (value === null || value === undefined) return '';
  return String(value);
}

function safeParseFloat(value: unknown): number | null {
  const parsed = parseFloat(safeToString(value));
  return Number.isNaN(parsed) ? null : parsed;
}

export function evaluateExpression(
  expr: Expression,
  record: Record<string, unknown>,
): boolean {
  if (!expr || !record) return false;

  switch (expr.type) {
    case 'comparison': {
      const value = record[expr.field];

      switch (expr.operator) {
        case 'eq': {
          const recordValue = safeToString(value);
          const exprValue = safeToString(expr.value);
          return recordValue === exprValue;
        }
        case 'neq': {
          const recordValue = safeToString(value);
          const exprValue = safeToString(expr.value);
          return recordValue !== exprValue;
        }
        case 'lt': {
          const recordValue = safeParseFloat(value);
          const exprValue = safeParseFloat(expr.value);
          if (recordValue === null || exprValue === null) return false;
          return recordValue < exprValue;
        }
        case 'lte': {
          const recordValue = safeParseFloat(value);
          const exprValue = safeParseFloat(expr.value);
          if (recordValue === null || exprValue === null) return false;
          return recordValue <= exprValue;
        }
        case 'gt': {
          const recordValue = safeParseFloat(value);
          const exprValue = safeParseFloat(expr.value);
          if (recordValue === null || exprValue === null) return false;
          return recordValue > exprValue;
        }
        case 'gte': {
          const recordValue = safeParseFloat(value);
          const exprValue = safeParseFloat(expr.value);
          if (recordValue === null || exprValue === null) return false;
          return recordValue >= exprValue;
        }
        case 'contains': {
          const recordValue = safeToString(value);
          const exprValue = safeToString(expr.value);
          return recordValue.includes(exprValue);
        }
        case 'in': {
          if (!Array.isArray(expr.value)) return false;
          const recordValue = safeToString(value);
          const exprValues = expr.value.map(safeToString);
          return exprValues.includes(recordValue);
        }
        case 'nin': {
          if (!Array.isArray(expr.value)) return false;
          const recordValue = safeToString(value);
          const exprValues = expr.value.map(safeToString);
          return !exprValues.includes(recordValue);
        }
        case 'between': {
          if (!Array.isArray(expr.value) || expr.value.length !== 2)
            return false;

          const recordValue = safeParseFloat(value);
          const [min, max] = expr.value.map(safeParseFloat);

          if (recordValue === null || min === null || max === null)
            return false;
          return recordValue >= (min || 0) && recordValue <= (max || 0);
        }
        case 'exists': {
          const exists = value !== undefined && value !== null;
          return expr.value ? exists : !exists;
        }
        default:
          return false;
      }
    }

    case 'and': {
      if (!Array.isArray(expr.expressions) || expr.expressions.length === 0) {
        return true; // Empty AND expression is true
      }
      return expr.expressions.every((e) => evaluateExpression(e, record));
    }

    case 'or': {
      if (!Array.isArray(expr.expressions) || expr.expressions.length === 0) {
        return false; // Empty OR expression is false
      }
      return expr.expressions.some((e) => evaluateExpression(e, record));
    }

    case 'not': {
      if (!expr.expression) return true; // NOT of undefined/null is true
      return !evaluateExpression(expr.expression, record);
    }

    default:
      return false;
  }
}
