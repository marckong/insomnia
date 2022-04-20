import React, { FunctionComponent, ReactNode } from 'react';
import styled, { css } from 'styled-components';

export interface ModalBodyProps {
  noScroll?: boolean;
  children?: ReactNode;
}

const ModalBodyWrapper = styled.div`
  ${props => {
    const baseStyles = css`
        overflow: auto;
        min-height: 2rem;
        box-sizing: border-box;
        max-width: 100%;
        background-color: ${props.theme.colors.bg};
        color: ${props.theme.colors.font};
    `;

    if (props.noScroll) {
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
