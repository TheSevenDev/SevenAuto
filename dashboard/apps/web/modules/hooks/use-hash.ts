'use client';

import { useCallback, useEffect, useState } from 'react';

export const useHash = (): [string, (newHash: string) => void] => {
  const [hash, setHash] = useState('');

  const hashChangeHandler = useCallback(() => {
    const currentHash = window.location.hash.replace('#', '');
    setHash(currentHash);
  }, []);

  useEffect(() => {
    const currentHash = window.location.hash.replace('#', '');
    setHash(currentHash);
  }, []);

  useEffect(() => {
    window.addEventListener('hashchange', hashChangeHandler);
    return () => window.removeEventListener('hashchange', hashChangeHandler);
  }, [hashChangeHandler]);

  const updateHash = useCallback(
    (newHash: string) => {
      const cleanHash = newHash.replace('#', '');
      if (cleanHash !== hash) {
        window.location.hash = cleanHash;
      }
    },
    [hash],
  );

  return [hash, updateHash];
};
