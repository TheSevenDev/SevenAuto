import { EUserGender, EUserLevel, EUserStatus } from '@seven-auto/libs';
import { LabelColor } from 'modules/components/label';

export const getUserStatusColor = (status: EUserStatus): LabelColor => {
  switch (status) {
    case EUserStatus.ACTIVE:
      return 'success';

    case EUserStatus.PENDING:
      return 'warning';

    case EUserStatus.HOLD:
      return 'info';

    case EUserStatus.BAN:
      return 'error';

    default:
      return 'default';
  }
};

export const getUserLevelColor = (level: EUserLevel): LabelColor => {
  switch (level) {
    case EUserLevel.BASIC:
      return 'info';

    case EUserLevel.PRO:
      return 'success';

    case EUserLevel.PREMIUM:
      return 'primary';

    default:
      return 'default';
  }
};

export const getUserGenderColor = (gender: EUserGender): LabelColor => {
  switch (gender) {
    case EUserGender.MALE:
      return 'primary';

    case EUserGender.FEMALE:
      return 'secondary';

    default:
      return 'default';
  }
};
