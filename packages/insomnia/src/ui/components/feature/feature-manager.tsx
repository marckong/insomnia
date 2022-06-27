import React, { ChangeEvent, FunctionComponent, ReactElement, useContext, useEffect, useState } from 'react';

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
    setEnabled(s => !s);
  };
  const handleSelection = (event: ChangeEvent<HTMLInputElement>) => {
    const { name } = event.target;
    setSelected(name);
  };

  useEffect(() => {
    selectFeature({
      name: featureItem.name,
      isEnabled: enabled,
      variant: selected,
    });
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
