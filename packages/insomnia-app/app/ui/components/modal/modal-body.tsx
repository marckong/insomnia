import React, { FunctionComponent, ReactNode } from 'react';
import styled, { css } from 'styled-components';

export interface ModalBodyProps {
  noScroll?: boolean;
  children?: ReactNode;
}

const ModalBodyWrapper = styled.div<{ noScroll?: boolean }>`
  ${({ theme, noScroll }) => {
    const baseStyles = css`
        overflow: auto;
        min-height: 2rem;
        box-sizing: border-box;
        max-width: 100%;
        background-color: ${theme.colors.bg};
        color: ${theme.colors.font};
    `;

    if (noScroll) {
      baseStyles.concat(css`
        overflow: visible;
        height: 100%;
      `);
    }

    return baseStyles;
  }}
`;

export const ModalBody: FunctionComponent<ModalBodyProps> = ({ children, noScroll }) => {
  return (
    <ModalBodyWrapper {...{ noScroll }}>{children}</ModalBodyWrapper>
  );
};
