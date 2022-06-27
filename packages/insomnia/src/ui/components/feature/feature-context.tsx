import React, { createContext, FunctionComponent, ReactElement, ReactNode, useCallback, useState } from 'react';

export type FeatureName = string;
export type FeatureVariant = 'control';
export interface FeatureData<Name extends string, Variant extends string> {
  name: Name;
  isEnabled: boolean;
  variant: Variant;
}

interface UseFeatureContext {
  loadFeature(name: string): Promise<FeatureData<string, string>>;
  selectFeature(feature: FeatureData<string, string>): void;
  features: Record<string, FeatureData<string, string>>;
}
const FeatureContext = createContext<UseFeatureContext>({
  loadFeature: async (name: string) => ({ name, isEnabled: false, variant: '' }),
  selectFeature: () => {},
  features: {},
});
const { Provider } = FeatureContext;

interface Props {
  children: ReactNode;
}

const FeatureProvider: FunctionComponent<Props> = ({ children }): ReactElement => {
  // TODO: this should be coming from the persistence (db or optionally remote in the future)
  const [features, setFeatures] = useState<Record<string, FeatureData<string, string>>>({});

  // TODO: this should be coming from the persistence (db or optionally remote in the future)
  const selectFeature = useCallback((feature: FeatureData<string, string>) => {
    setFeatures(s => ({ ...s, [feature.name]: feature }));
  }, []);

  // TODO: this should be coming from the persistence (db or optionally remote in the future)
  const loadFeature = useCallback(async (name: string) => {
    return features[name];
  }, [features]);
  return (
    <Provider
      value={{
        features,
        loadFeature,
        selectFeature,
      }}
    >
      {children}
    </Provider>
  );
};

export { FeatureContext, FeatureProvider };
