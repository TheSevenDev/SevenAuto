import { EPostStatus, IOrderBy } from '@seven-auto/libs';
import { LabelColor } from 'modules/components/label';

export const POST_SORT_OPTIONS: {
  key: string;
  value: IOrderBy;
  label: string;
}[] = [
  { key: 'createdAt', value: { createdAt: 'desc' }, label: 'latest' },
  { key: 'views', value: { views: 'desc' }, label: 'popular' },
  { key: 'createdAt', value: { createdAt: 'asc' }, label: 'oldest' },
];

export const getPostStatusColor = (status: EPostStatus): LabelColor => {
  switch (status) {
    case EPostStatus.DRAFT:
      return 'default';

    case EPostStatus.PUBLISHED:
      return 'success';

    // case EPostStatus.PENDING:
    //   return 'warning';

    case EPostStatus.SCHEDULED:
      return 'info';

    case EPostStatus.TRASH:
      return 'error';

    default:
      return 'secondary';
  }
};
