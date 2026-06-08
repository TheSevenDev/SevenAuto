import {
  Alert,
  Button,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { isEmpty } from 'lodash';
import Iconify from 'modules/components/iconify';
import React, { useEffect } from 'react';

import Label from '../components/label';
import {
  BetweenComparisonExpression,
  ComparisonExpression,
  ExistsComparisonExpression,
  Expression,
  LogicalExpression,
  logicOptions,
  operatorOptions,
  operatorOptionsToLabelMap,
} from './types';
import {
  createDefaultComparisonExpression,
  createDefaultLogicalExpression,
  validateExpression,
} from './utils/validateExpression';

type ExpressionBuilderOptions = {
  showError?: boolean;
  showValidation?: boolean;
};

type ExpressionBuilderProps = {
  expression: Expression | null;
  onChange: (expr: Expression) => void;
  onRemove?: () => void;
  size?: 'small' | 'medium';
  fieldOptions?: { label: string; value: string }[];
  depth?: number;
  options?: ExpressionBuilderOptions;
};

export const ExpressionBuilder: React.FC<ExpressionBuilderProps> = ({
  expression,
  onChange,
  onRemove,
  size = 'small',
  fieldOptions,
  depth = 0,
  options = {
    showError: true,
    showValidation: true,
  },
}) => {
  const hasFieldOptions = fieldOptions && fieldOptions.length > 0;
  const [validationError, setValidationError] = React.useState<
    string | undefined
  >();

  // Create a default field if it is not set
  useEffect(() => {
    if (isEmpty(expression)) {
      const defaultExpr = createDefaultLogicalExpression('and');
      const validation = validateExpression(defaultExpr);
      if (validation.isValid) {
        onChange(defaultExpr);
      } else {
        setValidationError(validation.error);
      }
    }
  }, [expression, onChange]);

  // Validate expression before changing
  const handleExpressionChange = (newExpr: Expression) => {
    const validation = validateExpression(newExpr);
    setValidationError(validation.isValid ? undefined : validation.error);
    onChange(newExpr);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFieldChange = (key: keyof ComparisonExpression, value: any) => {
    if (expression?.type === 'comparison') {
      let updated: ComparisonExpression = { ...expression, [key]: value };

      if (key === 'operator') {
        if (value === 'between') {
          updated = {
            ...expression,
            operator: 'between',
            value: ['', ''],
          } as BetweenComparisonExpression;
        } else if (value === 'exists') {
          updated = {
            ...expression,
            operator: 'exists',
            value: true,
          } as ExistsComparisonExpression;
        } else if (value === 'in' || value === 'nin') {
          updated = { ...expression, operator: value, value: [''] };
        } else {
          updated = { ...expression, operator: value, value: '' };
        }
      }

      handleExpressionChange(updated);
    }
  };

  const handleLogicChange = (index: number, updated: Expression) => {
    if (expression && 'expressions' in expression) {
      const expressions = [...expression.expressions];
      expressions[index] = updated;
      handleExpressionChange({ ...expression, expressions });
    }
  };

  const addLogicExpression = () => {
    if (expression && 'expressions' in expression) {
      const defaultExpr = createDefaultComparisonExpression();
      handleExpressionChange({
        ...expression,
        expressions: [...expression.expressions, defaultExpr],
      });
    } else if (!expression) {
      handleExpressionChange({
        type: 'and',
        expressions: [
          {
            type: 'comparison',
            field: hasFieldOptions ? (fieldOptions[0]?.value ?? '') : '',
            operator: 'eq',
            value: '',
          },
        ],
      } as LogicalExpression);
    }
  };

  const toggleExpressionType = () => {
    if (expression?.type === 'comparison') {
      handleExpressionChange({
        type: 'and',
        expressions: [expression],
      } as LogicalExpression);
    } else {
      const defaultExpr = createDefaultComparisonExpression();
      handleExpressionChange(defaultExpr);
    }
  };

  const renderComparisonValue = () => {
    if (expression && expression.type !== 'comparison') return null;

    const operatorValue = expression?.operator || 'eq';
    const valueValue = expression?.value ?? '';

    if (operatorValue === 'exists') {
      return (
        <FormControl fullWidth>
          <InputLabel>Value</InputLabel>
          <Select
            size={size}
            label="Value"
            value={valueValue ? 'true' : 'false'}
            onChange={(e) =>
              handleFieldChange('value', e.target.value === 'true')
            }
          >
            <MenuItem value="true">true</MenuItem>
            <MenuItem value="false">false</MenuItem>
          </Select>
        </FormControl>
      );
    }

    if (operatorValue === 'between' && Array.isArray(valueValue)) {
      return (
        <Stack direction="row" spacing={1} sx={{ width: 1 }}>
          <TextField
            fullWidth
            error={options.showValidation && !valueValue[0]}
            label="From"
            size={size}
            value={valueValue[0] ?? ''}
            onChange={(e) =>
              handleFieldChange('value', [e.target.value, valueValue?.[1]])
            }
          />
          <TextField
            fullWidth
            error={options.showValidation && !valueValue[1]}
            label="To"
            size={size}
            value={valueValue[1] ?? ''}
            onChange={(e) =>
              handleFieldChange('value', [valueValue?.[0], e.target.value])
            }
          />
        </Stack>
      );
    }

    return (
      <TextField
        fullWidth
        error={options.showValidation && !valueValue}
        size={size}
        label="Value"
        value={
          Array.isArray(valueValue) ? valueValue.join(',') : (valueValue ?? '')
        }
        onChange={(e) => {
          const val = e.target.value;
          const parsed = ['in', 'nin'].includes(operatorValue)
            ? val.split(',').map((v) => v.trim())
            : val;
          handleFieldChange('value', parsed);
        }}
      />
    );
  };

  const renderComparison = () => {
    if (expression && expression.type !== 'comparison') return null;

    const fieldValue =
      expression?.field ||
      (hasFieldOptions ? (fieldOptions[0]?.value ?? '') : '');
    const operatorValue = expression?.operator || 'eq';

    return (
      <Paper
        elevation={0}
        sx={{
          p: 2,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
          bgcolor: 'background.neutral',
        }}
      >
        <Grid container spacing={1}>
          <Grid size={4}>
            {hasFieldOptions ? (
              <FormControl fullWidth>
                <InputLabel>Field</InputLabel>
                <Select
                  error={options.showValidation && !fieldValue}
                  size={size}
                  label="Field"
                  value={fieldValue}
                  onChange={(e) => handleFieldChange('field', e.target.value)}
                >
                  {fieldOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <TextField
                fullWidth
                error={options.showValidation && !fieldValue}
                label="Field"
                size={size}
                value={fieldValue}
                onChange={(e) => handleFieldChange('field', e.target.value)}
              />
            )}
          </Grid>
          <Grid size={3}>
            <FormControl fullWidth>
              <InputLabel>Operator</InputLabel>
              <Select
                value={operatorValue}
                label="Operator"
                size={size}
                onChange={(e) => handleFieldChange('operator', e.target.value)}
              >
                {operatorOptions.map((op) => (
                  <MenuItem key={op} value={op}>
                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{ alignItems: 'center' }}
                    >
                      <Label
                        color="success"
                        sx={{ textTransform: 'lowercase' }}
                      >
                        {operatorOptionsToLabelMap[op]}
                      </Label>
                      <Typography variant="caption">{op}</Typography>
                    </Stack>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={4}>{renderComparisonValue()}</Grid>
          <Grid size={1}>
            <Stack
              direction="row"
              spacing={1}
              sx={{ alignItems: 'center', justifyContent: 'flex-end' }}
            >
              <IconButton onClick={toggleExpressionType} size={size}>
                <Iconify icon="mdi:code-brackets" />
              </IconButton>
              {!!onRemove && (
                <IconButton onClick={onRemove} size={size}>
                  <Iconify icon="mdi:delete" />
                </IconButton>
              )}
            </Stack>
          </Grid>
        </Grid>
      </Paper>
    );
  };

  const renderLogical = () => {
    const logicType = expression?.type || 'and';

    return (
      <Paper
        elevation={0}
        sx={{
          p: 2,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
          bgcolor: 'background.neutral',
        }}
      >
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <FormControl fullWidth>
            <InputLabel>Logic</InputLabel>
            <Select
              fullWidth
              size={size}
              value={logicType}
              label="Logic"
              onChange={(e) => {
                const newType = e.target.value as 'and' | 'or' | 'not';
                if (newType === 'not') {
                  handleExpressionChange({
                    type: 'not',
                    expression: {
                      type: 'comparison',
                      field: hasFieldOptions
                        ? (fieldOptions[0]?.value ?? '')
                        : '',
                      operator: 'eq',
                      value: '',
                    },
                  });
                } else {
                  handleExpressionChange({
                    type: newType,
                    expressions: [
                      {
                        type: 'comparison',
                        field: hasFieldOptions
                          ? (fieldOptions[0]?.value ?? '')
                          : '',
                        operator: 'eq',
                        value: '',
                      },
                    ],
                  });
                }
              }}
            >
              {logicOptions.map((op) => (
                <MenuItem key={op} value={op}>
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ alignItems: 'center' }}
                  >
                    <Label color="success" sx={{ textTransform: 'lowercase' }}>
                      {op}
                    </Label>
                    <Typography variant="caption">{op}</Typography>
                  </Stack>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <IconButton onClick={toggleExpressionType} size={size}>
            <Iconify icon="mdi:code-brackets" />
          </IconButton>

          {!!onRemove && (
            <IconButton onClick={onRemove} size={size}>
              <Iconify icon="mdi:delete" />
            </IconButton>
          )}
        </Stack>
        <Divider sx={{ my: 1 }} />
        {expression && 'expressions' in expression && (
          <Stack spacing={1}>
            {expression.expressions.map((exp, i) => (
              <ExpressionBuilder
                key={i}
                expression={exp}
                onChange={(e) => handleLogicChange(i, e)}
                onRemove={() => {
                  const updated = expression.expressions.filter(
                    (_, index) => index !== i,
                  );
                  handleExpressionChange({
                    ...expression,
                    expressions: updated,
                  });
                }}
                fieldOptions={fieldOptions}
                depth={depth + 1}
                options={options}
              />
            ))}
          </Stack>
        )}
        {expression && 'expression' in expression && (
          <ExpressionBuilder
            expression={expression.expression}
            onChange={(e) =>
              handleExpressionChange({ ...expression, expression: e })
            }
            fieldOptions={fieldOptions}
            depth={depth + 1}
            options={options}
          />
        )}
        <Divider sx={{ my: 1 }} />
        {((expression && 'expressions' in expression) || !expression) && (
          <Button variant="outlined" onClick={addLogicExpression}>
            + Add
          </Button>
        )}
      </Paper>
    );
  };

  return (
    <Stack spacing={1}>
      {options.showError && depth === 0 && validationError && (
        <Alert severity="error">{validationError}</Alert>
      )}
      {expression?.type === 'comparison' ? renderComparison() : renderLogical()}
    </Stack>
  );
};
