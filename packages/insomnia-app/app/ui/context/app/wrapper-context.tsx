import React, { createContext, FunctionComponent, ReactNode, useContext, useState } from 'react';

import * as models from '../../../models';
import { Environment } from '../../../models/environment';
// import { Workspace } from '../../../models/workspace';
import { AppProps } from '../../containers/app';

type WrapperProviderProps = Pick<AppProps, 'activeEnvironment' | 'environments' | 'activeWorkspace' | 'activeWorkspaceMeta'>;

type UseWrapperContext = {
    forceRefreshKey: number;
    forceRequestPaneRefresh(): void;
} & WrapperProviderProps;

interface WrapperContextProps extends UseWrapperContext {
    children: ReactNode;
}

const WrapperContext = createContext<UseWrapperContext>({
  forceRefreshKey: Date.now(),
  forceRequestPaneRefresh: () => {},
  environments: [],
  activeEnvironment: null,
  activeWorkspace: undefined,
  activeWorkspaceMeta: undefined,
});

export const WrapperProvider: FunctionComponent<WrapperContextProps> = ({
  environments,
  activeEnvironment,
  activeWorkspace,
  activeWorkspaceMeta,
  children,
}) => {
  const [forceRefreshKey, setForceRefreshKey] = useState(Date.now());
  const forceRequestPaneRefresh = () => {
    setForceRefreshKey(Date.now());
  };
  return (
    <WrapperContext.Provider
      value={{
        environments,
        activeEnvironment,
        activeWorkspace,
        activeWorkspaceMeta,
        forceRequestPaneRefresh, forceRefreshKey,
      }}
    >
      {children}
    </WrapperContext.Provider>
  );
};

interface UseEnvironments {
    activeEnvironment: Environment | null;
    updateActiveEnvironment(activeEnvironmentId: string): Promise<void>;
}

export function useEnvironments(): UseEnvironments {
  const { activeEnvironment, activeWorkspaceMeta, forceRequestPaneRefresh } = useContext(WrapperContext);
  const updateActiveEnvironment = async (activeEnvironmentId: string): Promise<void> => {
    if (activeWorkspaceMeta) {
      await models.workspaceMeta.update(activeWorkspaceMeta, { activeEnvironmentId });
    }

    setTimeout(() => forceRequestPaneRefresh(), 300);
  };

  return { activeEnvironment, updateActiveEnvironment };
}
