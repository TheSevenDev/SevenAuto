import { IUser } from '@seven-auto/libs';
import { useCallback, useMemo } from 'react';
import * as Yup from 'yup';

import { useTranslate } from '../../locales';

interface IUserValue {
  id: string;
  fullname?: string;
  email?: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const useUserSchema = () => {
  const { t } = useTranslate();

  const UserSchema = useMemo(() => Yup.mixed<IUserValue>().nullable(), []);

  const UserRequiredSchema = useMemo(
    () => Yup.mixed<IUserValue>().required(t('validate.required')).nullable(),
    [t],
  );

  const getUserValue = useCallback(
    (user: IUser | undefined): IUserValue | undefined | null => {
      if (!user) return undefined;
      return {
        id: user.id,
        fullname: user.fullname,
        email: user.email,
        phone: user.phone,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    },
    [],
  );

  return {
    UserSchema,
    UserRequiredSchema,
    getUserValue,
  };
};
