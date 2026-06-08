import { EUserLevel, IUser } from '../types';

export const isLogin = (currentUser: IUser): boolean => {
  if (!currentUser || !currentUser.id) return false;
  return true;
};

export const hasPermission = (
  currentUser: IUser | null | undefined,
  permissions: string[],
): boolean => {
  if (!currentUser) return false;
  if (currentUser.id === '1') return true;
  if (
    !currentUser.role?.permissions ||
    currentUser.role?.permissions?.length === 0
  )
    return false;

  return currentUser.role?.permissions?.some((permission) =>
    permissions.includes(permission),
  );
};

export const isPro = (currentUser: IUser | null): boolean => {
  if (!currentUser) return false;
  if (currentUser.id === '1') return true;
  if (currentUser.level === EUserLevel.PRO) return true;
  if (currentUser.level === EUserLevel.PREMIUM) return true;
  return false;
};

export const isPremium = (currentUser: IUser | null): boolean => {
  if (!currentUser) return false;
  if (currentUser.id === '1') return true;
  if (currentUser.level === EUserLevel.PREMIUM) return true;
  return false;
};

export const hasUserLevel = (
  currentUser: IUser | null | undefined,
  level: EUserLevel,
): boolean => {
  if (!currentUser) return false;
  if (currentUser.id === '1') return true;
  switch (level) {
    case EUserLevel.BASIC:
      return true;
    case EUserLevel.PRO:
      return isPro(currentUser);
    case EUserLevel.PREMIUM:
      return isPremium(currentUser);
    default:
      return false;
  }
};
