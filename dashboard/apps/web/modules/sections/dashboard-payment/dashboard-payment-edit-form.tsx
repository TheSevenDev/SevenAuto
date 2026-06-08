import { yupResolver } from '@hookform/resolvers/yup';
import { Button, MenuItem, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import {
  EPaymentType,
  handleErrorResponse,
  hasPermission,
  IPayment,
  IPaymentCreate,
  IPaymentUpdate,
  paymentBankList,
  paymentMethodList,
  permissions,
} from '@seven-auto/libs';
import { useAuthContext } from 'modules/auth/hooks';
import FormProvider, {
  RHFAutocompleteUser,
  RHFSelect,
  RHFTextField,
} from 'modules/components/hook-form';
import { enqueueSnackbar } from 'modules/components/snackbar';
import { useUserSchema } from 'modules/hooks/schemas/use-user-schema';
import { useTranslate } from 'modules/locales';
import apiServices from 'modules/services/apiService';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

// ----------------------------------------------------------------------

type Props = {
  currentData?: IPayment;
  onCallback?: (data: IPayment) => void;
  isReadOnly?: boolean;
};

export default function DashboardPaymentEditForm({
  currentData,
  onCallback,
  isReadOnly,
}: Props) {
  const { currentUser } = useAuthContext();

  const isAdmin = hasPermission(currentUser, [permissions.PAYMENT_UPDATE]);

  const isDisabled = isReadOnly || !isAdmin;

  const { t } = useTranslate();

  const { UserSchema, getUserValue } = useUserSchema();

  const Schema = Yup.object().shape({
    user: UserSchema,
    amount: Yup.number().required(t('validate.required')),
    price: Yup.number().required(t('validate.required')),
    type: Yup.string()
      .oneOf(Object.values(EPaymentType))
      .required(t('validate.required')),
    bankCode: Yup.string(),
  });

  const defaultValues = useMemo(
    () => ({
      user: getUserValue(currentData?.user) || undefined,
      amount: currentData?.amount || 0,
      price: currentData?.price || 0,
      type: currentData?.type || EPaymentType.BANK_TRANSFER,
      bankCode: currentData?.bankCode || '',
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
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    const dataInput: IPaymentUpdate = {
      userId: data.user?.id || '',
      amount: data.amount,
      price: data.price,
      type: data.type,
      bankCode: data.bankCode,
    };

    try {
      let res;
      if (currentData && currentData.id) {
        res = await apiServices.payment.updatePayment(currentData.id, {
          ...dataInput,
        });
        enqueueSnackbar(t('basic.updateSuccess'), {
          variant: 'success',
        });
      } else {
        res = await apiServices.payment.createPayment(
          dataInput as IPaymentCreate,
        );
        enqueueSnackbar(t('basic.createSuccess'), {
          variant: 'success',
        });
      }

      setTimeout(() => {
        if (onCallback) onCallback(res);
        reset();
      }, 1000);
    } catch (error) {
      enqueueSnackbar(t(handleErrorResponse(error, 'basic.requestFailed')), {
        variant: 'error',
      });
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Box
        sx={{
          rowGap: 3,
          columnGap: 2,
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
          },
        }}
      >
        <RHFAutocompleteUser
          name="user"
          label={t('user')}
          disabled={isDisabled}
        />
        <RHFTextField
          name="amount"
          label={t('basic.amount')}
          type="number"
          disabled={isDisabled}
        />
        <RHFTextField
          name="price"
          label={t('basic.price')}
          type="number"
          disabled={isDisabled}
        />
        <RHFSelect
          label={t('payments.method')}
          placeholder={t('payments.method')}
          name="type"
          disabled={isDisabled}
        >
          {paymentMethodList.map((item) => (
            <MenuItem key={item.key} value={item.key}>
              {t(`payments.methods.${item.key}`)}
            </MenuItem>
          ))}
        </RHFSelect>
        <RHFSelect
          label={t('payments.bankCode')}
          placeholder={t('payments.bankCode')}
          name="bankCode"
          disabled={isDisabled}
        >
          {paymentBankList.map((item) => (
            <MenuItem key={item.code} value={item.code}>
              {item.name}
            </MenuItem>
          ))}
        </RHFSelect>
        {currentData?.id && (
          <>
            <TextField
              label={t('basic.doneAt')}
              value={
                currentData?.doneAt
                  ? new Date(currentData?.doneAt || '').toLocaleString()
                  : 'N/A'
              }
              disabled
            />
            <TextField
              label={t('basic.createdAt')}
              value={new Date(currentData?.createdAt || '').toLocaleString()}
              disabled
            />
            <TextField
              label={t('basic.updatedAt')}
              value={new Date(currentData?.updatedAt || '').toLocaleString()}
              disabled
            />
          </>
        )}
      </Box>
      {!isDisabled && (
        <Box sx={{ mt: 2 }}>
          <Button type="submit" variant="contained" loading={isSubmitting}>
            {currentData ? t('basic.update') : t('basic.create')}
          </Button>
        </Box>
      )}
    </FormProvider>
  );
}
