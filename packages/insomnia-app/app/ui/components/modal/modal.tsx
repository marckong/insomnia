/* eslint-disable react/function-component-definition */
import React, { Children, isValidElement, ReactElement, ReactNode, useContext } from 'react';
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

const ContentWrapper = styled.div`
  ${props => {
    const baseStyles = css`
        width: ${props.theme.modal.width};
        height: 100%;
        max-width: 100%;
        max-height: 100%;
        margin: auto;
        pointer-events: none;
    `;

    if (props.wide) {
      baseStyles.concat(css`
        width: ${props.theme.modal.widthWide}
      `);
    }

    if (props.skinny) {
      baseStyles.concat(css`
        width: ${props.theme.modal.widthSkinny}
      `);
    }

    if (props.centered) {
      baseStyles.concat(css`
        display: flex;
        align-items: center;
      `);
    }

    return baseStyles;
  }}
`;

interface ModalContentWrapperProps {
    centered?: boolean;
    wide?: boolean;
    skinny?: boolean;
}

interface ModalContentProps {
    tall?: boolean;
}
const Content = styled.div`
  ${styles.contentBaseStyle}
  ${(props: ModalContentProps) => (props.tall ? css`height: 100%;` : '')};
`;

function mapChildren(children: ReactNode): ReactElement[] {
  return Children
    .toArray(children)
    .filter(isValidElement)
    .reduce<ReactElement[]>((arr: ReactElement[], component: ReactElement) => {
      if (component.type === ModalHeader) {
        arr[0] = component;
      } else if (component.type === ModalBody) {
        arr[1] = component;
      } else if (component.type === ModalFooter) {
        arr[2] = component;
      }

      return arr;
    }, new Array<ReactElement>(3));
}

interface ModalProps extends ModalContentWrapperProps, ModalContentProps {
  noEscape?: boolean;
  dontFocus?: boolean;
  closeOnKeyCodes?: any[];
  children: ReactNode;
}
function Modal({ centered, tall, wide, skinny, children }: ModalProps): ReactElement {
  const [header, body, footer] = mapChildren(children);
  const { hideModal } = useContext(ModalContext);

  const handleOverlayClick = () => {
    hideModal();
  };

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
Modal.Header = ModalHeader;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;
export { Modal };
