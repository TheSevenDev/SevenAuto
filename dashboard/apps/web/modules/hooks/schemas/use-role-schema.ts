import { IRole } from '@seven-auto/libs';
import { useCallback, useMemo } from 'react';
import * as Yup from 'yup';

import { useTranslate } from '../../locales';

interface IRoleValue {
  id: string;
  name?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const useRoleSchema = () => {
  const { t } = useTranslate();

  const RoleSchema = useMemo(() => Yup.mixed<IRoleValue>().nullable(), []);

  const RoleRequiredSchema = useMemo(
    () => Yup.mixed<IRoleValue>().required(t('validate.required')),
    [t],
  );

  const getRoleValue = useCallback(
    (role: IRole | undefined): IRoleValue | undefined | null => {
      if (!role) return undefined;
      return {
        id: role.id,
        name: role.name,
        createdAt: role.createdAt,
        updatedAt: role.updatedAt,
      };
    },
    [],
  );

  return {
    RoleSchema,
    RoleRequiredSchema,
    getRoleValue,
  };
};
