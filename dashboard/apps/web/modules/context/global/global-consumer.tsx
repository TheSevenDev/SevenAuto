'use client';

import { SplashScreen } from 'modules/components/loading-screen';

import { GlobalContext } from './global-context';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export function GlobalConsumer({ children }: Props) {
  return (
    <GlobalContext.Consumer>
      {(state) => (state.globalLoading ? <SplashScreen /> : children)}
    </GlobalContext.Consumer>
  );
}
