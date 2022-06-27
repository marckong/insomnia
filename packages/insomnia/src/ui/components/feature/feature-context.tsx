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
}
const FeatureContext = createContext<UseFeatureContext>({
  loadFeature: async (name: string) => ({ name, isEnabled: false, variant: '' }),
  selectFeature: () => {},
});
const { Provider } = FeatureContext;

interface Props {
  children: ReactNode;
}

const FeatureProvider: FunctionComponent<Props> = ({ children }): ReactElement => {
  const [features, setFeatures] = useState<Record<string, FeatureData<string, string>>>({});
  const selectFeature = useCallback((feature: FeatureData<string, string>) => {
    setFeatures(s => ({ ...s, [feature.name]: feature }));
  }, []);
  const loadFeature = useCallback(async (name: string) => {
    return features[name];
  }, [features]);
  return (
    <Provider value={{ loadFeature, selectFeature }}>{children}</Provider>
  );
};

export { FeatureContext, FeatureProvider };
