import { IMedia, IMediaFindMany } from '@seven-auto/libs';
import { useAuthContext } from 'modules/auth/hooks';
import { MEDIA_SECRET } from 'modules/config-global';
import apiServices from 'modules/services/apiService';
import { useCallback, useEffect } from 'react';
import { create } from 'zustand';

import { MediaState } from './media.type';

const defaultMediaFilters: IMediaFindMany = {
  filter: '',
  take: 12,
  skip: 0,
  ext: '',
  source: '',
  types: [],
  size_gte: 0,
  size_lte: 0,
  createdById: '',
  updatedAt_gte: undefined,
  updatedAt_lte: undefined,
  orderBy: { updatedAt: 'desc' },
};

const initialState: MediaState = Object.freeze({
  initialized: false,
  initializedByUserId: '',
  isLoading: true,
  medias: [],
  selected: [],
  total: 0,
  filters: defaultMediaFilters,
  onCallBack: () => {},
  openMediaDialog: false,
  isSelectMultiple: true,
});

interface MediaStateWithActions extends MediaState {
  mutate: (newState: Partial<MediaState>) => void;
  reset: () => void;
}

export const useMediaState = create<MediaStateWithActions>((set) => ({
  ...initialState,
  mutate: (newState) => set(newState),
  reset: () => set(initialState),
}));

export const useMediaStore = () => {
  const mutate = useMediaState.setState;
  const state = useMediaState();
  const { authenticated, currentUser } = useAuthContext();
  const { initialized, initializedByUserId, filters } = state;

  // fetch medias
  const fetchMedias = useCallback(async () => {
    const res = await apiServices.media.getMedias(filters);
    mutate({ medias: res.items, total: res.total });
    return res;
  }, [filters, mutate]);

  // init
  const init = useCallback(async () => {
    if (!authenticated) return;

    mutate({
      isLoading: true,
      initialized: true,
      initializedByUserId: currentUser?.id,
    });
    // Fetch data here
    await fetchMedias();

    mutate({
      isLoading: false,
    });
  }, [authenticated, fetchMedias, mutate, currentUser?.id]);

  // set Medias
  const setMedias = useCallback(
    (medias: IMedia[]) => {
      mutate({ medias });
    },
    [mutate],
  );

  // set filters
  const setFilters = useCallback(
    (newFilters: Partial<MediaState['filters']>) => {
      mutate({ filters: { ...filters, skip: 0, ...newFilters } });
    },
    [mutate, filters],
  );

  // select media
  const selectAllMedia = useCallback(
    (checked: boolean) => {
      if (checked)
        mutate({
          selected: [
            ...state.selected,
            ...state.medias.filter(
              (m) => !state.selected?.some((s) => s.id === m.id),
            ),
          ],
        });
      else
        mutate({
          selected: [
            ...state.selected.filter(
              (s) => !state.medias?.some((m) => m.id === s.id),
            ),
          ],
        });
    },
    [mutate, state.medias, state.selected],
  );

  const selectMedia = useCallback(
    (media: IMedia) => {
      const isSelected = state.selected?.some((m) => m.id === media.id);
      const newSelected = isSelected
        ? state.selected.filter((m) => m.id !== media.id)
        : [...(state.selected ? state.selected : []), media];

      mutate({ selected: newSelected });
    },
    [mutate, state.selected],
  );

  const unSelectAllMedia = useCallback(() => {
    mutate({
      selected: [
        ...state.selected.filter(
          (m) => !state.medias.some((s) => s.id === m.id),
        ),
      ],
    });
  }, [mutate, state.medias, state.selected]);

  const clearSelectedMedia = useCallback(() => {
    mutate({ selected: [] });
  }, [mutate]);

  // reset filters
  const resetFilters = useCallback(() => {
    mutate({ filters: defaultMediaFilters });
  }, [mutate]);

  // actions
  const deleteMedia = useCallback(
    async (id: string) => {
      await apiServices.media.deleteMedia(id);
      await fetchMedias();
      // remove selected media
      mutate({
        selected: state.selected.filter((m) => m.id !== id),
      });
    },
    [fetchMedias, mutate, state.selected],
  );

  const deleteManyMedia = useCallback(
    async (ids: string[]) => {
      const result = await apiServices.media.deleteManyMedia(ids);
      await fetchMedias();
      mutate({
        selected: state.selected.filter((m) =>
          state.medias.some((media) => media.id === m.id),
        ),
      });
      return result;
    },
    [fetchMedias, mutate, state.medias, state.selected],
  );

  const uploadMedia = useCallback(
    async (file: File) =>
      apiServices.media.createMedia(file, MEDIA_SECRET || ''),
    [],
  );

  const setMediaState = useCallback(
    (newState: Partial<MediaState>) => {
      mutate(newState);
    },
    [mutate],
  );

  useEffect(() => {
    if (!initialized || initializedByUserId !== currentUser?.id) {
      init();
    }
  }, [init, initialized, initializedByUserId, currentUser?.id]);

  useEffect(() => {
    if (initialized) fetchMedias();
  }, [fetchMedias, filters, initialized]);

  return {
    ...state,
    init,
    setMedias,
    fetchMedias,
    setFilters,
    resetFilters,
    selectAllMedia,
    selectMedia,
    unSelectAllMedia,
    clearSelectedMedia,
    deleteMedia,
    deleteManyMedia,
    uploadMedia,
    setMediaState,
  };
};
