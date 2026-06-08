import { EActivityStatus } from '@seven-auto/libs';

export const getActivityStatusVariant = (
  status?: EActivityStatus,
  isOnline?: boolean,
): 'alway' | 'online' | 'busy' | 'offline' | 'invisible' => {
  switch (status) {
    case EActivityStatus.ONLINE:
      if (isOnline === undefined) {
        return 'online';
      }
      return isOnline ? 'online' : 'offline';

    case EActivityStatus.OFFLINE:
      return 'offline';

    case EActivityStatus.ALWAY:
      return 'alway';

    case EActivityStatus.BUSY:
      return 'busy';

    default:
      return 'invisible';
  }
};
