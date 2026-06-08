import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

export function useTab(tabName = 'tab', defaultValue = 'general') {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get(tabName) || defaultValue;

  const handleChangeTab = useCallback(
    (newValue: string) => {
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      current.set(tabName, newValue);
      router.push(`${pathname}?${current.toString()}`);
    },
    [pathname, router, searchParams, tabName],
  );

  return [currentTab, handleChangeTab] as const;
}
