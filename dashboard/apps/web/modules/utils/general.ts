import { EStatus, EStatusProcess } from '@seven-auto/libs';

import { LabelColor } from '../components/label';
import { ICONS_NAME } from '../const/icons';

export const RATING_OPTIONS = [4, 3, 2, 1];

export const getStatusProcessColor = (status?: EStatusProcess): LabelColor => {
  switch (status) {
    case EStatusProcess.COMPLETED:
      return 'success';

    case EStatusProcess.CANCELED:
      return 'error';

    case EStatusProcess.PROCESSING:
      return 'warning';

    case EStatusProcess.PENDING:
      return 'secondary';

    default:
      return 'default';
  }
};

export const getStatusProcessIcon = (status?: EStatusProcess): string => {
  switch (status) {
    case EStatusProcess.COMPLETED:
      return ICONS_NAME.check;

    case EStatusProcess.CANCELED:
      return ICONS_NAME.close;

    case EStatusProcess.PROCESSING:
      return ICONS_NAME.clock;

    case EStatusProcess.PENDING:
      return ICONS_NAME.time;

    default:
      return ICONS_NAME.info;
  }
};

export const getStatusColor = (status?: EStatus): LabelColor => {
  switch (status) {
    case EStatus.ACTIVE:
      return 'success';

    case EStatus.INACTIVE:
      return 'error';

    default:
      return 'default';
  }
};
