import { useContext, useEffect, useState } from 'react';

import { type FeatureData, FeatureContext } from './feature-context';

// TODO: add Feature Name and Variant type
interface UseFeature {
  data: FeatureData<string, string>;
  loading: boolean;
  error: string | null;
}
function useFeature(name: string, variant = 'control'): UseFeature {
  const [data, setData] = useState<FeatureData<string, string>>({ name, variant, isEnabled: false });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { loadFeature } = useContext(FeatureContext);

  useEffect(() => {
    setLoading(true);

    loadFeature(name)
      .then((feature: FeatureData<string, string>) => {
        setData(feature);
        setLoading(false);
      }).catch((error: Error) => {
        setError(error.message);
        setLoading(false);
      });
  }, [loadFeature, name]);

  return { data, loading, error };
}

export { useFeature };
