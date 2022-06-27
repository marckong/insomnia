import React, { Children, ComponentType, FunctionComponent, isValidElement, ReactElement, ReactNode } from 'react';

import type { FeatureData } from './feature-context';
import { useFeature } from './use-feature';

interface VariantProps {
  variant: string;
  children: ReactNode;
}
const FeatureVariant: FunctionComponent<VariantProps> = ({ children }): ReactElement => {
  return <>{ children }</>;
};

function checkVariant(variant: string): (element: ReactElement) => boolean {
  return (element: ReactElement) => element.type === FeatureVariant && element.props.variant === variant;
}

function getFeatureVariant(children: ReactNode, feature: FeatureData<string, string>): ReactElement[] {
  if (!feature?.isEnabled) {
    return [];
  }

  return Children
    .toArray(children)
    .filter(isValidElement)
    .filter(checkVariant(feature.variant));
}

const FeatureLoading: FunctionComponent = (): ReactElement => {
  return <>loading...</>;
};

const FeatureError: FunctionComponent = (): ReactElement => {
  return <>error...</>;
};

interface Props {
  name: string;
  children: ReactNode;
  loading?: ComponentType;
  error?: ComponentType;
}
const Feature: FunctionComponent<Props> = ({
  name,
  children,
  loading: Loading = FeatureLoading,
  error: Error = FeatureError,
}): ReactElement | null => {
  const { data: feature, loading, error } = useFeature(name);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error />;
  }

  const [variant] = getFeatureVariant(children, feature);
  if (!variant) {
    return null;
  }

  return variant;
};

export { Feature, FeatureVariant };
