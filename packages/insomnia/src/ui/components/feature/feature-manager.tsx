import React, { ChangeEvent, FunctionComponent, ReactElement, useContext, useEffect, useState } from 'react';

import { SegmentEvent, sendSegment } from '../../../common/analytics';
import { FeatureContext } from './feature-context';

const features = [
  {
    name: 'someFeature',
    variants: ['control', 'variant1', 'variant2'],
  },
];

interface FeatureItem {
  name: string;
  variants: string[];
}
interface Props {
  featureItem: FeatureItem;
}
const FeatureCheckbox: FunctionComponent<Props> = ({ featureItem }): ReactElement => {
  const [selected, setSelected] = useState('control');
  const [enabled, setEnabled] = useState(false);
  const { selectFeature } = useContext(FeatureContext);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleEnabled = (_: ChangeEvent<HTMLInputElement>) => {
    const isCurrentlyEnabled = enabled;
    setEnabled(!isCurrentlyEnabled);
    sendSegment('track', {
      event: SegmentEvent.featureToggling,
      properties: {
        type: `feature: ${featureItem.name}`,
        action: `toggling from: ${isCurrentlyEnabled} to ${!isCurrentlyEnabled}`,
      },
    });
  };
  const handleSelection = (event: ChangeEvent<HTMLInputElement>) => {
    const { name } = event.target;
    const currentVariant = selected;
    setSelected(name);
    sendSegment('track', {
      event: SegmentEvent.featureVariantSelecting,
      properties: {
        type: `feature: ${featureItem.name}`,
        action: `selecting variant from: ${currentVariant} to ${name}`,
      },
    });
  };

  useEffect(() => {
    const feature = {
      name: featureItem.name,
      isEnabled: enabled,
      variant: selected,
    };

    selectFeature(feature);
  }, [selectFeature, selected, enabled, featureItem.name]);

  return (
    <fieldset key={featureItem.name}>
      <div>
        <span>Feature: {featureItem.name}</span>
        <label>
          <input
            type="checkbox"
            name={featureItem.name}
            checked={enabled}
            onChange={handleEnabled}
          />
          {enabled ? 'Enable' : 'Disable'}
        </label>
      </div>
      <div>
        {featureItem.variants.map((variant: string) => {
          return (
            <label key={variant}>
              <input
                type="checkbox"
                name={variant}
                disabled={!enabled}
                checked={selected === variant}
                onChange={handleSelection}
              />
              {variant}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
};

export const FeatureManager: FunctionComponent = (): ReactElement => {
  return (
    <>
      {features.map(feature => (
        <FeatureCheckbox key={feature.name} featureItem={feature} />
      ))}
    </>
  );
};
