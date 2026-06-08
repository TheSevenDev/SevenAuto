import FormHelperText from '@mui/material/FormHelperText';
import { useEffect } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import Editor, { EditorProps } from '../editor';

// ----------------------------------------------------------------------

interface Props extends Omit<EditorProps, 'value' | 'onChange'> {
  name: string;
}

export default function RHFEditor({ name, helperText, ...other }: Props) {
  const {
    control,
    watch,
    setValue,
    formState: { isSubmitSuccessful },
  } = useFormContext();

  const values = watch();

  useEffect(() => {
    if (values[name] === '<p><br></p>') {
      setValue(name, '', {
        shouldValidate: !isSubmitSuccessful,
      });
    }
  }, [isSubmitSuccessful, name, setValue, values]);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Editor
          id={name}
          error={!!error}
          value={field.value}
          onChange={field.onChange}
          helperText={
            (!!error || helperText) && (
              <FormHelperText error={!!error} sx={{ px: 2 }}>
                {error ? error?.message : helperText}
              </FormHelperText>
            )
          }
          {...other}
        />
      )}
    />
  );
}
