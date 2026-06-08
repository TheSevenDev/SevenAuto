import { useCallback, useEffect, useState } from 'react';

type ReturnType<T> = {
  loading: boolean;
  data: T[];
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
};

type UseLoadMoreProps<T> = {
  fetchData: (page: number) => Promise<T[]>;
};

export const useLoadMore = <T>({
  fetchData,
}: UseLoadMoreProps<T>): ReturnType<T> => {
  const [data, setData] = useState<T[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchMoreData = useCallback(async () => {
    if (page === 0) return;
    setLoading(true);
    setError(null);
    try {
      const result = await fetchData(page);

      if (result.length === 0) {
        setHasMore(false);
      } else {
        setData((prevData) => [...prevData, ...result]);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Unknown error');
      }
    } finally {
      setLoading(false);
    }
  }, [fetchData, page]);

  useEffect(() => {
    if (hasMore) {
      fetchMoreData();
    }
  }, [fetchMoreData, hasMore]);

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    setData([]);
  }, [fetchData]);

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return { data, loading, error, hasMore, loadMore };
};
