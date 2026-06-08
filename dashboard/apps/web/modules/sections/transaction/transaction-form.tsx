import { yupResolver } from '@hookform/resolvers/yup';
import { Stack } from '@mui/material';
import Alert, { AlertColor } from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import {
  ETransactionType,
  handleErrorResponse,
  hasPermission,
  ITransaction,
  ITransactionCreate,
  IUser,
  permissions,
} from '@seven-auto/libs';
import { useAuthContext } from 'modules/auth/hooks';
import FormProvider, {
  RHFAutocompleteUser,
  RHFRadioGroup,
  RHFTextField,
} from 'modules/components/hook-form';
import Scrollbar from 'modules/components/scrollbar';
import { useUserSchema } from 'modules/hooks/schemas/use-user-schema';
import { useTranslate } from 'modules/locales';
import apiServices from 'modules/services/apiService';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: VoidFunction;
  currentData?: ITransaction;
  onCallback?: (user: IUser) => void;
};

export default function TransactionsForm({
  currentData,
  open,
  onClose,
  onCallback,
}: Props) {
  const { currentUser } = useAuthContext();

  const isAdmin = hasPermission(currentUser, [permissions.TRANSACTION_UPDATE]);

  const { t } = useTranslate();
  const [alert, setAlert] = useState<{
    type: AlertColor;
    content: string;
  }>({
    type: 'info',
    content: '',
  });

  const { UserSchema, getUserValue } = useUserSchema();

  const Schema = Yup.object().shape({
    user: UserSchema,
    type: Yup.string()
      .required(t('validate.required'))
      .oneOf(['subtract', 'add']),
    amount: Yup.number().required(t('validate.required')),
  });

  const defaultValues = useMemo(
    () => ({
      user: getUserValue(currentData?.user) || undefined,
      type: currentData?.amount && currentData.amount > 0 ? 'add' : 'subtract',
      amount: Math.abs(currentData?.amount || 0),
    }),
    [currentData, getUserValue],
  );

  const methods = useForm({
    resolver: yupResolver(Schema),
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    const dataInput: ITransactionCreate = {
      type: ETransactionType.SYSTEM,
      userId: data.user?.id || '',
      amount: data.type === 'add' ? data.amount : -data.amount,
    };

    try {
      let res;
      if (currentData && currentData.id) {
        res = await apiServices.transaction.updateTransaction(currentData.id, {
          ...dataInput,
        });
        setAlert({
          type: 'success',
          content: t('basic.updateSuccess'),
        });
      } else {
        res = await apiServices.transaction.createTransaction({
          ...dataInput,
        });
        setAlert({
          type: 'success',
          content: t('basic.createSuccess'),
        });
      }

      setTimeout(() => {
        if (onCallback) onCallback(res);
        onClose();
        reset();
      }, 1000);
    } catch (error) {
      setAlert({
        type: 'error',
        content: t(handleErrorResponse(error, 'basic.createFailed')),
      });
    }
  });

  useEffect(() => {
    if (open) {
      setAlert({
        type: 'info',
        content: '',
      });
    }
  }, [open]);

  useEffect(() => {
    if (currentData) {
      if (currentData.user) {
        setValue('user', currentData.user);
      }
      setValue(
        'type',
        currentData.amount && currentData.amount > 0 ? 'add' : 'subtract',
      );
      setValue('amount', Math.abs(currentData.amount || 0));
    }
  }, [currentData, setValue]);

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: { maxWidth: 720 },
        },
      }}
    >
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <DialogTitle>{t('transactions.create')}</DialogTitle>
        <DialogContent sx={{ px: 0 }}>
          <Box
            sx={{
              px: 3,
            }}
          >
            {alert.content && (
              <Alert variant="outlined" severity={alert.type} sx={{ mb: 3 }}>
                {alert.content}
              </Alert>
            )}
          </Box>
          <Scrollbar
            sx={{
              px: 3,
              py: 1,
            }}
          >
            <Stack spacing={3}>
              <RHFAutocompleteUser
                name="user"
                label={t('basic.user')}
                disabled={!isAdmin || isSubmitting}
              />
              <RHFRadioGroup
                name="type"
                row
                label={t('basic.type')}
                options={[
                  {
                    value: 'add',
                    label: t('basic.add'),
                  },
                  {
                    value: 'subtract',
                    label: t('basic.subtract'),
                  },
                ]}
              />
              <RHFTextField
                name="amount"
                label={t('basic.amount')}
                type="number"
                disabled={!isAdmin || isSubmitting}
              />
            </Stack>
          </Scrollbar>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            {t('basic.cancel')}
          </Button>
          <Button type="submit" variant="contained" loading={isSubmitting}>
            {currentData ? t('basic.update') : t('basic.create')}
          </Button>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
