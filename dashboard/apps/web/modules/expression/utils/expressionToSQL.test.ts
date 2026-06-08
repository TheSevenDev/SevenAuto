import { Expression } from '../types';
import { createSQLQuery, expressionToSQL } from './expressionToSQL';

describe('expressionToSQL', () => {
  describe('Comparison Operators', () => {
    test('eq operator', () => {
      const expr: Expression = {
        type: 'comparison',
        field: 'name',
        operator: 'eq',
        value: 'John',
      };
      expect(expressionToSQL(expr)).toBe('"name" = \'John\'');
    });

    test('neq operator', () => {
      const expr: Expression = {
        type: 'comparison',
        field: 'age',
        operator: 'neq',
        value: 25,
      };
      expect(expressionToSQL(expr)).toBe('"age" != 25');
    });

    test('numeric comparison operators', () => {
      const expr: Expression = {
        type: 'comparison',
        field: 'score',
        operator: 'gt',
        value: 8.5,
      };
      expect(expressionToSQL(expr)).toBe('"score" > 8.5');
      expect(expressionToSQL({ ...expr, operator: 'lt' })).toBe(
        '"score" < 8.5',
      );
      expect(expressionToSQL({ ...expr, operator: 'gte' })).toBe(
        '"score" >= 8.5',
      );
      expect(expressionToSQL({ ...expr, operator: 'lte' })).toBe(
        '"score" <= 8.5',
      );
    });

    test('contains operator', () => {
      const expr: Expression = {
        type: 'comparison',
        field: 'description',
        operator: 'contains',
        value: 'test',
      };
      expect(expressionToSQL(expr)).toBe('"description" LIKE \'%test%\'');
    });

    test('in operator', () => {
      const expr: Expression = {
        type: 'comparison',
        field: 'status',
        operator: 'in',
        value: ['active', 'pending'],
      };
      expect(expressionToSQL(expr)).toBe("\"status\" IN ('active', 'pending')");
    });

    test('nin operator', () => {
      const expr: Expression = {
        type: 'comparison',
        field: 'status',
        operator: 'nin',
        value: ['inactive', 'deleted'],
      };
      expect(expressionToSQL(expr)).toBe(
        "\"status\" NOT IN ('inactive', 'deleted')",
      );
    });

    test('between operator', () => {
      const expr: Expression = {
        type: 'comparison',
        field: 'age',
        operator: 'between',
        value: [18, 65],
      };
      expect(expressionToSQL(expr)).toBe('"age" BETWEEN 18 AND 65');
    });

    test('exists operator', () => {
      const expr: Expression = {
        type: 'comparison',
        field: 'deleted_at',
        operator: 'exists',
        value: false,
      };
      expect(expressionToSQL(expr)).toBe('"deleted_at" IS NULL');
      expect(expressionToSQL({ ...expr, value: true })).toBe(
        '"deleted_at" IS NOT NULL',
      );
    });
  });

  describe('Logical Expressions', () => {
    test('and operator', () => {
      const expr: Expression = {
        type: 'and',
        expressions: [
          {
            type: 'comparison',
            field: 'age',
            operator: 'gt',
            value: 18,
          },
          {
            type: 'comparison',
            field: 'status',
            operator: 'eq',
            value: 'active',
          },
        ],
      };
      expect(expressionToSQL(expr)).toBe(
        '("age" > 18 AND "status" = \'active\')',
      );
    });

    test('or operator', () => {
      const expr: Expression = {
        type: 'or',
        expressions: [
          {
            type: 'comparison',
            field: 'status',
            operator: 'eq',
            value: 'active',
          },
          {
            type: 'comparison',
            field: 'status',
            operator: 'eq',
            value: 'pending',
          },
        ],
      };
      expect(expressionToSQL(expr)).toBe(
        '("status" = \'active\' OR "status" = \'pending\')',
      );
    });

    test('not operator', () => {
      const expr: Expression = {
        type: 'not',
        expression: {
          type: 'comparison',
          field: 'deleted',
          operator: 'eq',
          value: true,
        },
      };
      expect(expressionToSQL(expr)).toBe('NOT ("deleted" = true)');
    });
  });

  describe('Complex Expressions', () => {
    test('nested logical expressions', () => {
      const expr: Expression = {
        type: 'and',
        expressions: [
          {
            type: 'comparison',
            field: 'age',
            operator: 'gt',
            value: 18,
          },
          {
            type: 'or',
            expressions: [
              {
                type: 'comparison',
                field: 'status',
                operator: 'eq',
                value: 'active',
              },
              {
                type: 'not',
                expression: {
                  type: 'comparison',
                  field: 'deleted',
                  operator: 'eq',
                  value: true,
                },
              },
            ],
          },
        ],
      };
      expect(expressionToSQL(expr)).toBe(
        '("age" > 18 AND ("status" = \'active\' OR NOT ("deleted" = true)))',
      );
    });
  });

  describe('Edge Cases', () => {
    test('null expression', () => {
      expect(expressionToSQL(null)).toBe('TRUE');
    });

    test('empty and expression', () => {
      expect(expressionToSQL({ type: 'and', expressions: [] })).toBe('TRUE');
    });

    test('empty or expression', () => {
      expect(expressionToSQL({ type: 'or', expressions: [] })).toBe('FALSE');
    });

    test('null values', () => {
      const expr: Expression = {
        type: 'comparison',
        field: 'deleted_at',
        operator: 'eq',
        value: null,
      };
      expect(expressionToSQL(expr)).toBe('"deleted_at" = NULL');
    });
  });
});

describe('createSQLQuery', () => {
  test('basic query', () => {
    const expr: Expression = {
      type: 'comparison',
      field: 'status',
      operator: 'eq',
      value: 'active',
    };
    expect(createSQLQuery(expr, 'users')).toBe(
      'SELECT * FROM "users" WHERE "status" = \'active\';',
    );
  });

  test('query with specific fields', () => {
    const expr: Expression = {
      type: 'comparison',
      field: 'age',
      operator: 'gt',
      value: 18,
    };
    expect(createSQLQuery(expr, 'users', ['id', 'name', 'age'])).toBe(
      'SELECT "id", "name", "age" FROM "users" WHERE "age" > 18;',
    );
  });

  test('complex query', () => {
    const expr: Expression = {
      type: 'and',
      expressions: [
        {
          type: 'comparison',
          field: 'age',
          operator: 'gt',
          value: 18,
        },
        {
          type: 'or',
          expressions: [
            {
              type: 'comparison',
              field: 'status',
              operator: 'eq',
              value: 'active',
            },
            {
              type: 'comparison',
              field: 'status',
              operator: 'eq',
              value: 'pending',
            },
          ],
        },
      ],
    };
    expect(createSQLQuery(expr, 'users', ['id', 'name'])).toBe(
      'SELECT "id", "name" FROM "users" WHERE ("age" > 18 AND ("status" = \'active\' OR "status" = \'pending\'));',
    );
  });
});
