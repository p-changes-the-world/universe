import { useQueries } from '@tanstack/react-query';
import { fetchProviderAndDetail } from '../../api';
import PROVIDERS from '../../constants/providers';

const staleTime = 1000 * 3;

const useCollectionQueries = (list, options) => {
  const collectionQueries = list?.map(({ type, id }) => ({
    queryKey: ['@collection', type, id],
    queryFn: () => fetchProviderAndDetail(type, id),
    suspense: true,
    staleTime,
    notifyOnChangeProps: 'tracked',
    select: data => ({
      id,
      title: data.title || data.name,
      type,
      posterPath: data.poster_path,
      providers: data.results.KR
        ? data.results.KR.flatrate
            ?.map(provider => provider.provider_id)
            ?.filter(id => Object.prototype.hasOwnProperty.call(PROVIDERS, id))
        : [],
    }),
    ...options,
  }));

  const queries = useQueries({
    queries: collectionQueries,
  });

  return queries;
};

export default useCollectionQueries;
