import { ISiteInfo } from '@seven-auto/libs';

// ----------------------------------------------------------------------

export type GlobalStateType = {
  siteInfo: ISiteInfo;
  globalLoading: boolean;
};

// ----------------------------------------------------------------------

export type GlobalContextType = {
  siteInfo: ISiteInfo;
  globalLoading: boolean;
  setGlobalLoading: (loading: boolean) => void;
};
