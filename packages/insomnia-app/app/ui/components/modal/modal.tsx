/* eslint-disable react/function-component-definition */
import classNames from 'classnames';
import React, { Children, FunctionComponent, isValidElement, ReactElement, ReactNode, useContext } from 'react';
import styled, { css } from 'styled-components';

import { ModalContext } from './modal-context';
import { ModalHeader } from './modal-header';
import * as styles from './styles';

const Container = styled.div({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  padding: 'var(--padding-lg)',
  zIndex: 1000,
});

const Overlay = styled.div({
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  position: 'fixed',
  zIndex: -1,
});

interface ModalContentWrapperProps {
    centered?: boolean;
    wide?: boolean;
    skinny?: boolean;
}
const ContentWrapper = styled.div`
  ${styles.contentWrapperBaseStyle}
  ${(props: ModalContentWrapperProps) => (props.centered ?  css`display: flex;align-items: center;` : '')};
  ${(props: ModalContentWrapperProps) => (props.wide ? css`width: calc(1rem * 70);` : '')};
  ${(props: ModalContentWrapperProps) => (props.skinny ? css`width: calc(1rem * 30);` : '')};
`;

interface ModalContentProps {
    tall?: boolean;
}
const Content = styled.div`
  ${styles.contentBaseStyle}
  ${(props: ModalContentProps) => (props.tall ? css`height: 100%;` : '')};
`;

interface HeaderProps {
  children: ReactNode;
  hideCloseButton?: boolean;
  className?: string;
}
// const Header: FunctionComponent<HeaderProps> = ({ hideCloseButton, className, children }) => {
//   const { hideModal } = useContext(ModalContext);

//   const handleOverlayClick = () => {
//     hideModal();
//   };
//   return (
//     <div className={classNames('modal__header theme--dialog__header', className)}>
//       <div className="modal__header__children">{children}</div>
//       {hideCloseButton && (
//         <button type="button" className="btn btn--compact modal__close-btn" onClick={handleOverlayClick}>
//           <i className="fa fa-times" />
//         </button>
//       )}
//     </div>
//   );
// };
const Body: FunctionComponent<{ children: ReactNode }> = ({ children }) => {
  return (
    <div>Body{children}</div>
  );
};
const Footer: FunctionComponent<{ children: ReactNode }> = ({ children }) => {
  return (
    <div>Footer{children}</div>
  );
};

function mapChildren(children: ReactNode): ReactElement[] {
  return Children
    .toArray(children)
    .filter(isValidElement)
    .reduce<ReactElement[]>((arr: ReactElement[], component: ReactElement) => {
      if (component.type === ModalHeader) {
        arr[0] = component;
      } else if (component.type === Body) {
        arr[1] = component;
      } else if (component.type === Footer) {
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
Modal.Body = Body;
Modal.Footer = Footer;
export { Modal };
