import React, { FunctionComponent, ReactNode } from 'react';
import styled, { css } from 'styled-components';

const ModalFooterWrapper = styled.div`
    ${props => css`
        border-top: 1px solid var(--hl-sm);
        background-color: ${props.theme.colors.bg};
        color: ${props.theme.colors.font};
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        padding: 1px;
    `}
`;

export const ModalFooter: FunctionComponent<{ children: ReactNode }> = ({ children }) => {
  return (
    <ModalFooterWrapper>{children}</ModalFooterWrapper>
  );
};
