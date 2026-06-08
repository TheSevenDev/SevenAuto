import { Expression } from '../types';

/**
 * Safely escape a value for SQL query
 * @param value - The value to escape
 * @returns Escaped value as string
 */
function escapeValue(value: unknown): string {
  if (value === null) return 'NULL';
  if (value === undefined) return 'NULL';
  if (typeof value === 'string') return `'${value.replace(/'/g, "''")}'`;
  if (Array.isArray(value)) {
    return `(${value.map(escapeValue).join(', ')})`;
  }
  return String(value);
}

/**
 * Convert a comparison expression to SQL condition
 * @param expr - The comparison expression to convert
 * @returns SQL condition as string
 */
function comparisonToSQL(expr: Expression): string {
  if (expr.type !== 'comparison') return '';

  const field = `"${expr.field}"`;
  const value = escapeValue(expr.value);

  switch (expr.operator) {
    case 'eq':
      return `${field} = ${value}`;
    case 'neq':
      return `${field} != ${value}`;
    case 'lt':
      return `${field} < ${value}`;
    case 'lte':
      return `${field} <= ${value}`;
    case 'gt':
      return `${field} > ${value}`;
    case 'gte':
      return `${field} >= ${value}`;
    case 'contains':
      return `${field} LIKE '%${String(expr.value).replace(/'/g, "''")}%'`;
    case 'in':
      return `${field} IN ${value}`;
    case 'nin':
      return `${field} NOT IN ${value}`;
    case 'between': {
      if (!Array.isArray(expr.value) || expr.value.length !== 2) return 'FALSE';
      const [min, max] = expr.value;
      return `${field} BETWEEN ${escapeValue(min)} AND ${escapeValue(max)}`;
    }
    case 'exists':
      return expr.value ? `${field} IS NOT NULL` : `${field} IS NULL`;
    default:
      return 'FALSE';
  }
}

/**
 * Convert an expression to SQL WHERE clause
 * @param expr - The expression to convert
 * @returns SQL WHERE clause as string
 */
export function expressionToSQL(expr: Expression | null): string {
  if (!expr) return 'TRUE';

  switch (expr.type) {
    case 'comparison':
      return comparisonToSQL(expr);

    case 'and': {
      if (!expr.expressions || expr.expressions.length === 0) return 'TRUE';
      const conditions = expr.expressions
        .map((e) => expressionToSQL(e))
        .filter(Boolean);
      return conditions.length > 0 ? `(${conditions.join(' AND ')})` : 'TRUE';
    }

    case 'or': {
      if (!expr.expressions || expr.expressions.length === 0) return 'FALSE';
      const conditions = expr.expressions
        .map((e) => expressionToSQL(e))
        .filter(Boolean);
      return conditions.length > 0 ? `(${conditions.join(' OR ')})` : 'FALSE';
    }

    case 'not': {
      if (!expr.expression) return 'TRUE';
      const condition = expressionToSQL(expr.expression);
      return `NOT (${condition})`;
    }

    default:
      return 'FALSE';
  }
}

/**
 * Create a complete SQL SELECT query
 * @param expr - The expression for WHERE clause
 * @param tableName - The name of the table to query
 * @param selectFields - The fields to select (defaults to ['*'])
 * @returns Complete SQL SELECT query as string
 */
export function createSQLQuery(
  expr: Expression | null,
  tableName: string,
  selectFields: string[] = ['*'],
): string {
  const whereClause = expressionToSQL(expr);
  const fields = selectFields
    .map((field) => (field === '*' ? '*' : `"${field}"`))
    .join(', ');
  return `SELECT ${fields} FROM "${tableName}" WHERE ${whereClause};`;
}
