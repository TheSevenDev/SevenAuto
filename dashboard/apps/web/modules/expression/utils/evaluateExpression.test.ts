import { Expression } from '../types';
import { evaluateExpression } from './evaluateExpression';

describe('evaluateExpression', () => {
  // Test basic comparison operators
  describe('Comparison Operators', () => {
    const record = {
      name: 'John',
      age: 25,
      score: 8.5,
      tags: ['active', 'premium'],
      status: null,
      empty: undefined,
    };

    test('eq operator', () => {
      const expr: Expression = {
        type: 'comparison',
        field: 'name',
        operator: 'eq',
        value: 'John',
      };
      expect(evaluateExpression(expr, record)).toBe(true);
      expect(evaluateExpression({ ...expr, value: 'Jane' }, record)).toBe(
        false,
      );
    });

    test('neq operator', () => {
      const expr: Expression = {
        type: 'comparison',
        field: 'name',
        operator: 'neq',
        value: 'Jane',
      };
      expect(evaluateExpression(expr, record)).toBe(true);
      expect(evaluateExpression({ ...expr, value: 'John' }, record)).toBe(
        false,
      );
    });

    test('numeric comparison operators', () => {
      const expr: Expression = {
        type: 'comparison',
        field: 'age',
        operator: 'gt',
        value: 20,
      };
      expect(evaluateExpression(expr, record)).toBe(true);
      expect(
        evaluateExpression({ ...expr, operator: 'lt', value: 30 }, record),
      ).toBe(true);
      expect(
        evaluateExpression({ ...expr, operator: 'gte', value: 25 }, record),
      ).toBe(true);
      expect(
        evaluateExpression({ ...expr, operator: 'lte', value: 25 }, record),
      ).toBe(true);
    });

    test('contains operator', () => {
      const expr: Expression = {
        type: 'comparison',
        field: 'tags',
        operator: 'contains',
        value: 'active',
      };
      expect(evaluateExpression(expr, record)).toBe(true);
      expect(evaluateExpression({ ...expr, value: 'inactive' }, record)).toBe(
        false,
      );
    });

    test('in operator', () => {
      const expr: Expression = {
        type: 'comparison',
        field: 'name',
        operator: 'in',
        value: ['John', 'Jane'],
      };
      expect(evaluateExpression(expr, record)).toBe(true);
      expect(
        evaluateExpression({ ...expr, value: ['Jane', 'Alice'] }, record),
      ).toBe(false);
    });

    test('nin operator', () => {
      const expr: Expression = {
        type: 'comparison',
        field: 'name',
        operator: 'nin',
        value: ['Jane', 'Alice'],
      };
      expect(evaluateExpression(expr, record)).toBe(true);
      expect(
        evaluateExpression({ ...expr, value: ['John', 'Jane'] }, record),
      ).toBe(false);
    });

    test('between operator', () => {
      const expr: Expression = {
        type: 'comparison',
        field: 'age',
        operator: 'between',
        value: [20, 30],
      };
      expect(evaluateExpression(expr, record)).toBe(true);
      expect(evaluateExpression({ ...expr, value: [30, 40] }, record)).toBe(
        false,
      );
    });

    test('exists operator', () => {
      const expr: Expression = {
        type: 'comparison',
        field: 'status',
        operator: 'exists',
        value: false,
      };
      expect(evaluateExpression(expr, record)).toBe(true);
      expect(
        evaluateExpression({ ...expr, field: 'empty', value: true }, record),
      ).toBe(false);
    });
  });

  // Test logical expressions
  describe('Logical Expressions', () => {
    const record = {
      age: 25,
      status: 'active',
      score: 8.5,
    };

    test('and operator', () => {
      const expr: Expression = {
        type: 'and',
        expressions: [
          {
            type: 'comparison',
            field: 'age',
            operator: 'gt',
            value: 20,
          },
          {
            type: 'comparison',
            field: 'status',
            operator: 'eq',
            value: 'active',
          },
        ],
      };
      expect(evaluateExpression(expr, record)).toBe(true);
      expect(
        evaluateExpression(
          {
            ...expr,
            expressions: [
              ...expr.expressions,
              {
                type: 'comparison',
                field: 'score',
                operator: 'lt',
                value: 5,
              },
            ],
          },
          record,
        ),
      ).toBe(false);
    });

    test('or operator', () => {
      const expr: Expression = {
        type: 'or',
        expressions: [
          {
            type: 'comparison',
            field: 'age',
            operator: 'lt',
            value: 20,
          },
          {
            type: 'comparison',
            field: 'status',
            operator: 'eq',
            value: 'active',
          },
        ],
      };
      expect(evaluateExpression(expr, record)).toBe(true);
      expect(
        evaluateExpression(
          {
            ...expr,
            expressions: [
              {
                type: 'comparison',
                field: 'age',
                operator: 'lt',
                value: 20,
              },
              {
                type: 'comparison',
                field: 'status',
                operator: 'eq',
                value: 'inactive',
              },
            ],
          },
          record,
        ),
      ).toBe(false);
    });

    test('not operator', () => {
      const expr: Expression = {
        type: 'not',
        expression: {
          type: 'comparison',
          field: 'age',
          operator: 'lt',
          value: 20,
        },
      };
      expect(evaluateExpression(expr, record)).toBe(true);
      expect(
        evaluateExpression(
          {
            ...expr,
            expression: {
              type: 'comparison',
              field: 'status',
              operator: 'eq',
              value: 'active',
            },
          },
          record,
        ),
      ).toBe(false);
    });
  });

  // Test edge cases
  describe('Edge Cases', () => {
    test('empty expressions', () => {
      expect(
        evaluateExpression(
          {
            type: 'and',
            expressions: [],
          },
          {},
        ),
      ).toBe(true);

      expect(
        evaluateExpression(
          {
            type: 'or',
            expressions: [],
          },
          {},
        ),
      ).toBe(false);
    });

    test('null/undefined values', () => {
      const record = {
        name: null,
        age: undefined,
        score: 0,
      };

      expect(
        evaluateExpression(
          {
            type: 'comparison',
            field: 'name',
            operator: 'eq',
            value: null,
          },
          record,
        ),
      ).toBe(true);

      expect(
        evaluateExpression(
          {
            type: 'comparison',
            field: 'age',
            operator: 'exists',
            value: false,
          },
          record,
        ),
      ).toBe(true);
    });

    test('invalid numeric comparisons', () => {
      const record = {
        age: 'not a number',
        score: null,
      };

      expect(
        evaluateExpression(
          {
            type: 'comparison',
            field: 'age',
            operator: 'gt',
            value: 20,
          },
          record,
        ),
      ).toBe(false);

      expect(
        evaluateExpression(
          {
            type: 'comparison',
            field: 'score',
            operator: 'between',
            value: [0, 10],
          },
          record,
        ),
      ).toBe(false);
    });

    test('nested complex expressions', () => {
      const record = {
        age: 25,
        status: 'active',
        score: 8.5,
        tags: ['premium', 'verified'],
      };

      const expr: Expression = {
        type: 'and',
        expressions: [
          {
            type: 'comparison',
            field: 'age',
            operator: 'gt',
            value: 20,
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
                  field: 'tags',
                  operator: 'contains',
                  value: 'inactive',
                },
              },
            ],
          },
        ],
      };

      expect(evaluateExpression(expr, record)).toBe(true);
    });
  });
});
