import { EBalanceType } from '@seven-auto/libs';

import { LabelColor } from '../components/label';
import { ICONS_NAME } from '../const/icons';
import { fCurrency, fNumber } from './format-number';

/** MUI `theme.palette` keys (excludes Label-only `default`). */
export type BalanceThemePaletteColor = Exclude<LabelColor, 'default'>;

export const getBalanceThemeColor = (
  status: EBalanceType,
): BalanceThemePaletteColor => {
  switch (status) {
    case EBalanceType.CREDIT:
      return 'success';
    case EBalanceType.COMMISSION:
      return 'info';
    default:
      return 'primary';
  }
};

export const getBalanceColor = (status: EBalanceType): LabelColor => {
  switch (status) {
    case EBalanceType.CREDIT:
      return 'success';

    case EBalanceType.COMMISSION:
      return 'info';

    default:
      return 'default';
  }
};

export const getBalanceColorBg = (status: EBalanceType): string => {
  switch (status) {
    case EBalanceType.CREDIT:
      return 'success.main';

    case EBalanceType.COMMISSION:
      return 'info.main';

    default:
      return 'default.main';
  }
};

export const getBalanceIcon = (status: EBalanceType): string => {
  switch (status) {
    case EBalanceType.CREDIT:
      return ICONS_NAME.credit;

    case EBalanceType.COMMISSION:
      return ICONS_NAME.commission;

    default:
      return ICONS_NAME.info;
  }
};

export const displayBalance = (
  balance: number,
  balanceType?: EBalanceType,
): string => {
  switch (balanceType) {
    case EBalanceType.CREDIT:
      return balance ? fNumber(balance) : '-';

    case EBalanceType.COMMISSION:
      return balance ? `${fCurrency(balance)}đ` : '-';

    default:
      return balance ? fNumber(balance) : '-';
  }
};
