import {
  hasPermission,
  IPost,
  IPostFindMany,
  permissions,
} from '@seven-auto/libs';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthContext } from 'modules/auth/hooks';
import { queryName } from 'modules/const/query-name';
import apiServices from 'modules/services/apiService';
import { useCallback, useMemo } from 'react';
import { create } from 'zustand';

import { PostState } from './post.type';

const defaultPostFilters: IPostFindMany = {
  filter: '',
  take: 12,
  status: undefined,
  skip: 0,
  authorId: undefined,
  orderBy: { updatedAt: 'desc' },
};

const initialState: PostState = Object.freeze({
  isLoading: true,
  posts: [],
  selected: [],
  total: 0,
  filters: defaultPostFilters,
  summary: {
    total: 0,
    pending: 0,
    published: 0,
    draft: 0,
    trash: 0,
    scheduled: 0,
    hot: 0,
  },
});

interface PostStateWithActions extends PostState {
  mutate: (newState: Partial<PostState>) => void;
  reset: () => void;
}

export const usePostState = create<PostStateWithActions>((set) => ({
  ...initialState,
  mutate: (newState) => set(newState),
  reset: () => set(initialState),
}));

export const usePostStore = () => {
  const mutate = usePostState.setState;
  const state = usePostState();
  const { currentUser } = useAuthContext();
  const { filters } = state;
  const queryClient = useQueryClient();

  const isAdmin = useMemo(
    () => hasPermission(currentUser, [permissions.POST_MANAGE]),
    [currentUser],
  );

  const { data, isFetching } = useQuery({
    queryKey: [queryName.GET_POST_LIST, filters, isAdmin, currentUser?.id],
    queryFn: () =>
      apiServices.post.getPosts({
        ...filters,
        authorId: isAdmin ? undefined : currentUser?.id,
      }),
  });

  const { data: summary, isFetching: isFetchingSummary } = useQuery({
    queryKey: [queryName.GET_POST_SUMMARY, currentUser?.id],
    queryFn: () =>
      apiServices.post.summary({
        authorId: isAdmin ? undefined : currentUser?.id,
      }),
  });

  // set filters
  const setFilters = useCallback(
    (newFilters: Partial<PostState['filters']>) => {
      mutate({ filters: { ...filters, skip: 0, ...newFilters } });
    },
    [mutate, filters],
  );

  // select post
  const selectAllPost = useCallback(
    (checked: boolean) => {
      if (checked)
        mutate({
          selected: [
            ...state.selected,
            ...state.posts.filter(
              (m) => !state.selected?.some((s) => s.id === m.id),
            ),
          ],
        });
      else
        mutate({
          selected: [
            ...state.selected.filter(
              (s) => !state.posts?.some((m) => m.id === s.id),
            ),
          ],
        });
    },
    [mutate, state.posts, state.selected],
  );

  const selectPost = useCallback(
    (post: IPost) => {
      const isSelected = state.selected?.some((m) => m.id === post.id);
      const newSelected = isSelected
        ? state.selected.filter((m) => m.id !== post.id)
        : [...(state.selected ? state.selected : []), post];

      mutate({ selected: newSelected });
    },
    [mutate, state.selected],
  );

  const unSelectAllPost = useCallback(() => {
    mutate({
      selected: [
        ...state.selected.filter(
          (m) => !state.posts.some((s) => s.id === m.id),
        ),
      ],
    });
  }, [mutate, state.posts, state.selected]);

  const clearSelectedPost = useCallback(() => {
    mutate({ selected: [] });
  }, [mutate]);

  // reset filters
  const resetFilters = useCallback(() => {
    mutate({ filters: defaultPostFilters });
  }, [mutate]);

  // actions
  const deletePost = useCallback(
    async (id: string) => {
      await apiServices.post.deletePost(id);
      await queryClient.invalidateQueries({
        queryKey: [queryName.GET_POST_LIST, filters, isAdmin, currentUser?.id],
      });
      mutate({
        selected: state.selected.filter((m) => m.id !== id),
      });
    },
    [mutate, state.selected, filters, queryClient, isAdmin, currentUser?.id],
  );

  const deleteManyPost = useCallback(
    async (ids: string[]) => {
      await Promise.all(ids.map((id) => apiServices.post.deletePost(id)));
      await queryClient.invalidateQueries({
        queryKey: [queryName.GET_POST_LIST, filters, isAdmin, currentUser?.id],
      });
      mutate({
        selected: state.selected.filter((m) =>
          state.posts.some((post) => post.id === m.id),
        ),
      });
      return { success: true };
    },
    [
      mutate,
      state.posts,
      state.selected,
      filters,
      queryClient,
      isAdmin,
      currentUser?.id,
    ],
  );

  const setPostState = useCallback(
    (newState: Partial<PostState>) => {
      mutate(newState);
    },
    [mutate],
  );

  return {
    ...state,
    posts: data?.items || [],
    total: data?.total || 0,
    isLoading: isFetching || isFetchingSummary,
    summary: summary || {
      total: 0,
      pending: 0,
      published: 0,
      draft: 0,
      trash: 0,
      scheduled: 0,
      hot: 0,
    },
    setFilters,
    resetFilters,
    selectAllPost,
    selectPost,
    unSelectAllPost,
    clearSelectedPost,
    deletePost,
    deleteManyPost,
    setPostState,
  };
};
