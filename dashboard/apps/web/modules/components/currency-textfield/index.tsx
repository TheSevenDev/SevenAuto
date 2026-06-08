import { TextField, TextFieldProps } from '@mui/material';
import { fCurrency } from 'modules/utils/format-number';
import React, { forwardRef, useEffect, useState } from 'react';

export interface CurrencyTextFieldProps extends Omit<
  TextFieldProps,
  'onChange' | 'value'
> {
  value?: number;
  onChange?: (value: number) => void;
  thousandCharacter?: '.' | ',';
}

const formatValueToString = (_value: number, thousandCharacter: '.' | ',') => {
  const localValue = fCurrency(_value);
  if (thousandCharacter === '.') {
    return localValue.replace(/,/g, '_').replace(/\./g, ',').replace(/_/g, '.');
  }
  return localValue;
};

const formatValueToNumber = (_value: string, thousandCharacter: '.' | ',') => {
  let value = _value;
  if (thousandCharacter === '.') {
    value = value.replace(/,/g, '_').replace(/\./g, ',').replace(/_/g, '.');
  }
  return parseFloat(value.replace(/,/g, ''));
};

// TODO implement decimal
const CurrencyTextField = forwardRef<HTMLDivElement, CurrencyTextFieldProps>(
  ({ value = 0, onChange, thousandCharacter = '.', ...props }, ref) => {
    const [internalValue, setInternalValue] = useState<string>(
      formatValueToString(value, thousandCharacter),
    );

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const numericValue = formatValueToNumber(
        event.target.value,
        thousandCharacter,
      );

      const formattedValue = formatValueToString(
        numericValue,
        thousandCharacter,
      );

      setInternalValue(formattedValue);

      if (onChange) {
        onChange(numericValue || 0);
      }
    };

    useEffect(() => {
      const newValue = formatValueToString(value, thousandCharacter);
      if (newValue !== internalValue) {
        setInternalValue(newValue);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value, thousandCharacter]);

    return (
      <TextField
        slotProps={{
          input: {
            startAdornment: <span>$</span>,
          },
        }}
        {...props}
        ref={ref}
        type="text"
        value={internalValue}
        onChange={handleChange}
      />
    );
  },
);

CurrencyTextField.displayName = 'CurrencyTextField';
export default CurrencyTextField;
