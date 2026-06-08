import { IPost, IPostFindMany, IPostSummary } from '@seven-auto/libs';

export interface PostState {
  isLoading: boolean;
  posts: IPost[];
  total: number;
  selected: IPost[];
  filters: IPostFindMany;
  summary: IPostSummary;
}
