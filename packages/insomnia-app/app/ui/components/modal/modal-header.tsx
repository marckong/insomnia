import React, { FunctionComponent, ReactNode } from 'react';
import styled, { css } from 'styled-components';

export interface Props {
  children: ReactNode;
  hideCloseButton?: boolean;
}

const ModalHeaderWrapper = styled.div`
  ${props => css`
        overflow: hidden;
        border-bottom: 1px solid var(--hl-md);
        height: ${props.theme.lineHeight.md};
        font-size: ${props.theme.fontSize.lg};
        line-height: ${props.theme.lineHeight.md};
        background-color: ${props.theme.colors.bg};
        color: ${props.theme.colors.font};
        display: flex;
        flex-direction: row;
  `}
`;

const ModalHeaderContent = styled.div`
  ${props => {
    const baseStyles = css`
        padding-left:  ${props.theme.padding.md};
        width: 100%;

        & > * {
        display: inline-block;
        line-height: normal;
        }    
    `;

    return baseStyles;
  }}
`;

const ModalCloseButton = styled.button`
  ${props => {
    const baseStyles = css`
        text-align: center;
        background: ${props.theme.colors.bg};
        padding-left:  ${props.theme.padding.md};
        padding: 0 ${props.theme.padding.md};
        height: ${props.theme.lineHeight.sm};
        height: 100%;
    `;

    return baseStyles;
  }}
`;

export const ModalHeader: FunctionComponent<Props> = ({ hideCloseButton, children }) => {
  return (
    <ModalHeaderWrapper>
      <ModalHeaderContent>{children}</ModalHeaderContent>
      {!hideCloseButton && (
        <ModalCloseButton type="button">
          <i className="fa fa-times" />
        </ModalCloseButton>
      )}
    </ModalHeaderWrapper>
  );
};
