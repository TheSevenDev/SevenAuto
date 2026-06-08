import { IMedia, IMediaFindMany } from '@seven-auto/libs';

export interface MediaState {
  initialized: boolean;
  initializedByUserId: string;
  isLoading: boolean;
  medias: IMedia[];
  total: number;
  filters: IMediaFindMany;
  selected: IMedia[];
  onCallBack: (media: IMedia | IMedia[]) => void;
  openMediaDialog: boolean;
  isSelectMultiple: boolean;
}
