/* eslint-disable react/function-component-definition */
import React, { Children, cloneElement, isValidElement, ReactElement, ReactNode, useContext } from 'react';
import styled, { css } from 'styled-components';

import { ModalBody } from './modal-body';
import { ModalContext } from './modal-context';
import { ModalFooter } from './modal-footer';
import { ModalHeader } from './modal-header';
import * as styles from './styles';

const Container = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1000;
    padding: ${props => props.theme.padding.lg}
`;

const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
`;

interface ModalContentWrapperProps {
    centered?: boolean;
    wide?: boolean;
    skinny?: boolean;
}
// TODO: verify performance impact of the below expression
const ContentWrapper = styled.div<ModalContentWrapperProps>`
  ${({ theme, wide, skinny, centered }) => {
    const baseStyles = css`
        width: ${theme.modal.width};
        height: 100%;
        max-width: 100%;
        max-height: 100%;
        margin: auto;
        pointer-events: none;
    `;

    if (wide) {
      baseStyles.concat(css`
        width: ${theme.modal.widthWide}
      `);
    }

    if (skinny) {
      baseStyles.concat(css`
        width: ${theme.modal.widthSkinny}
      `);
    }

    if (centered) {
      baseStyles.concat(css`
        display: flex;
        align-items: center;
      `);
    }

    return baseStyles;
  }}
`;

interface ModalContentProps {
    tall?: boolean;
}
const Content = styled.div<ModalContentProps>`
  ${styles.contentBaseStyle}
  ${({ tall }) => (tall ? css`height: 100%;` : '')};
`;

function mapChildren(children: ReactNode, onClose: () => void): ReactElement[] {
  return Children
    .toArray(children)
    .filter(isValidElement)
    .reduce<ReactElement[]>((arr: ReactElement[], component: ReactElement) => {
      if (component.type === ModalHeader) {
        const componentWithOnClose = cloneElement(<component.type />, { ...component.props, onClose });
        arr[0] = componentWithOnClose;
      } else if (component.type === ModalBody) {
        arr[1] = component;
      } else if (component.type === ModalFooter) {
        arr[2] = component;
      }

      return arr;
    }, new Array<ReactElement>(3));
}

interface ModalProps extends ModalContentWrapperProps, ModalContentProps {
  onClose(): void;
  children: ReactNode;
  closeOnKeyCodes?: any[];
  noEscape?: boolean;
  dontFocus?: boolean;
}

function BaseModal({ centered, tall, wide, skinny, onClose, children }: ModalProps): ReactElement {
  const handleOverlayClick = () => {
    onClose();
  };

  const [header, body, footer] = mapChildren(children, handleOverlayClick);
  return (
    <Container tabIndex={-1}>
      <Overlay onClick={handleOverlayClick} />
      <ContentWrapper {...{ centered, wide, skinny }}>
        <Content {...{ tall }}>
          {header}
          {body}
          {footer}
        </Content>
      </ContentWrapper>
    </Container>
  );
}

export const UncontrolledModal = Object.assign(BaseModal, { Header: ModalHeader, Body: ModalBody, Footer: ModalFooter });
function Modal(props: Omit<ModalProps, 'onClose'>): ReactElement {
  const { hideModal: onClose } = useContext(ModalContext);
  return <BaseModal { ...props} onClose={onClose} />;
}

Modal.Header = ModalHeader;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;

export { Modal };
