import { IUser, IUserFindMany } from '@seven-auto/libs';
import { useAuthContext } from 'modules/auth/hooks';
import apiServices from 'modules/services/apiService';
import { useCallback, useEffect } from 'react';
import { create } from 'zustand';

import { UserState } from './user.type';

const defaultUserFilters: IUserFindMany = {
  filter: '',
  status: [],
  roleId: '',
  levels: [],
  take: 10,
  skip: 0,
  orderBy: { updatedAt: 'desc' },
};

const initialState: UserState = Object.freeze({
  initialized: false,
  initializedByUserId: '',
  isLoading: true,
  users: [],
  selected: [],
  total: 0,
  filters: defaultUserFilters,
});

interface UserStateWithActions extends UserState {
  mutate: (newState: Partial<UserState>) => void;
  reset: () => void;
}

export const useUserState = create<UserStateWithActions>((set) => ({
  ...initialState,
  mutate: (newState) => set(newState),
  reset: () => set(initialState),
}));

export const useUserStore = () => {
  const mutate = useUserState.setState;
  const state = useUserState();
  const { authenticated, currentUser } = useAuthContext();
  const { initialized, initializedByUserId, filters } = state;

  // fetch users
  const fetchUsers = useCallback(async () => {
    const res = await apiServices.user.getUsers(filters);
    mutate({ users: res.items, total: res.total });
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
    await fetchUsers();

    mutate({
      isLoading: false,
    });
  }, [authenticated, fetchUsers, mutate, currentUser?.id]);

  // set Users
  const setUsers = useCallback(
    (users: IUser[]) => {
      mutate({ users });
    },
    [mutate],
  );

  // set filters
  const setFilters = useCallback(
    (newFilters: Partial<UserState['filters']>) => {
      mutate({ filters: { ...filters, skip: 0, ...newFilters } });
    },
    [mutate, filters],
  );

  // select user
  const selectAllUser = useCallback(
    (checked: boolean) => {
      if (checked)
        mutate({
          selected: [
            ...state.selected,
            ...state.users.filter(
              (m) => !state.selected?.some((s) => s.id === m.id),
            ),
          ],
        });
      else
        mutate({
          selected: [
            ...state.selected.filter(
              (s) => !state.users?.some((m) => m.id === s.id),
            ),
          ],
        });
    },
    [mutate, state.users, state.selected],
  );

  const selectUser = useCallback(
    (item: IUser) => {
      const isSelected = state.selected?.some((m) => m.id === item.id);
      const newSelected = isSelected
        ? state.selected.filter((m) => m.id !== item.id)
        : [...(state.selected ? state.selected : []), item];

      mutate({ selected: newSelected });
    },
    [mutate, state.selected],
  );

  const unSelectAllUser = useCallback(() => {
    mutate({
      selected: [
        ...state.selected.filter(
          (m) => !state.users.some((s) => s.id === m.id),
        ),
      ],
    });
  }, [mutate, state.users, state.selected]);

  const clearSelectedUser = useCallback(() => {
    mutate({ selected: [] });
  }, [mutate]);

  // reset filters
  const resetFilters = useCallback(() => {
    mutate({ filters: defaultUserFilters });
  }, [mutate]);

  // actions
  const deleteUser = useCallback(
    async (id: string) => {
      await apiServices.user.deleteUser(id);
      await fetchUsers();
      // remove selected user
      mutate({
        selected: state.selected.filter((m) => m.id !== id),
      });
    },
    [fetchUsers, mutate, state.selected],
  );

  const deleteManyUser = useCallback(
    async (ids: string[]) => {
      const result = await apiServices.user.deleteManyUser(ids);
      await fetchUsers();
      mutate({
        selected: state.selected.filter((m) =>
          state.users.some((item) => item.id === m.id),
        ),
      });
      return result;
    },
    [fetchUsers, mutate, state.users, state.selected],
  );
  const setUserState = useCallback(
    (newState: Partial<UserState>) => {
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
    if (initialized) fetchUsers();
  }, [fetchUsers, filters, initialized]);

  return {
    ...state,
    init,
    setUsers,
    fetchUsers,
    setFilters,
    resetFilters,
    selectAllUser,
    selectUser,
    unSelectAllUser,
    clearSelectedUser,
    deleteUser,
    deleteManyUser,
    setUserState,
  };
};
