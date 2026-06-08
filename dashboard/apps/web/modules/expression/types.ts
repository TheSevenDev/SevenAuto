// Expression types
export type Primitive = string | number | boolean | null;

export type Expression = ComparisonExpression | LogicalExpression;

export type ComparisonExpressionValue = Primitive | Primitive[];

export type StandardComparisonOperator =
  | 'eq'
  | 'neq'
  | 'lt'
  | 'lte'
  | 'gt'
  | 'gte'
  | 'in'
  | 'nin'
  | 'contains';

export type ComparisonOperator =
  | StandardComparisonOperator
  | 'between'
  | 'exists';

export interface StandardComparisonExpression {
  type: 'comparison';
  field: string;
  operator: StandardComparisonOperator;
  value: Primitive | Primitive[];
}

export interface BetweenComparisonExpression {
  type: 'comparison';
  field: string;
  operator: 'between';
  value: [Primitive, Primitive];
}

export interface ExistsComparisonExpression {
  type: 'comparison';
  field: string;
  operator: 'exists';
  value: boolean;
}

export type ComparisonExpression =
  | StandardComparisonExpression
  | BetweenComparisonExpression
  | ExistsComparisonExpression;

export type LogicalExpression =
  | { type: 'and'; expressions: Expression[] }
  | { type: 'or'; expressions: Expression[] }
  | { type: 'not'; expression: Expression };

export const operatorOptions: ComparisonOperator[] = [
  'eq',
  'neq',
  'lt',
  'lte',
  'gt',
  'gte',
  'in',
  'nin',
  'contains',
  'between',
  'exists',
];

export const operatorOptionsToLabelMap = {
  eq: '=',
  neq: '≠',
  lt: '<',
  lte: '≤',
  gt: '>',
  gte: '≥',
  in: 'in',
  nin: 'not in',
  contains: 'contains',
  between: 'between',
  exists: 'exists',
};

export const logicOptions = ['and', 'or', 'not'] as const;
