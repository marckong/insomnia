import React, { Children, FunctionComponent, isValidElement, ReactElement, ReactNode } from 'react';

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

function getFeature(children: ReactNode, feature: FeatureData<string, string>): ReactElement[] {
  if (!feature?.isEnabled) {
    return [];
  }

  return Children
    .toArray(children)
    .filter(isValidElement)
    .filter(checkVariant(feature.variant));
}

interface Props {
  name: string;
  children: ReactNode;
}
const Feature: FunctionComponent<Props> = ({ name, children }): ReactElement | null => {
  const { data: feature, loading, error } = useFeature(name);

  if (loading) {
    return <>'loading'</>;
  }

  if (error) {
    return <>error</>;
  }

  const [variant] = getFeature(children, feature);
  if (!variant) {
    return null;
  }

  return variant;
};

export { Feature, FeatureVariant };
