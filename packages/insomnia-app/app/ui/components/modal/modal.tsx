/* eslint-disable react/function-component-definition */
import React, { Children, FunctionComponent, isValidElement, ReactElement, ReactNode } from 'react';
import styled, { css } from 'styled-components';
interface Props {
    children: ReactNode;
}

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding: calc(1rem * 2.5);
  z-index: 1000;
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
  ${(props: {
      centered?: boolean;
      wide?: boolean;
      skinny?: boolean;
    }) => {
    let base = css`
        width: calc(1rem * 60);
        height: 100%;
        max-width: 100%;
        max-height: 100%;
        margin: auto;
        pointer-events: none;
      `;

    if (props.centered) {
      const centered = css`
            display: flex;
            align-items: center;
        `;

      base = { ...base, ...centered };
    }

    if (props.wide) {
      const wide = css`
        width: calc(1rem * 70);
    `;

      base = { ...base, ...wide };
    }

    if (props.skinny) {
      const skinny = css`
          width: calc(1rem * 30);
      `;

      base = { ...base, ...skinny };
    }

    return base;
  }}
`;

const Content = styled.div`
  ${(props: { tall?: boolean }) => {
    let base = css`
      display: grid;
      grid-template-columns: 100%;
      grid-template-rows: auto minmax(0, 1fr) auto;
      border-radius: var(--radius-md);
      overflow: visible;
      box-sizing: border-box;
      box-shadow: 0 0 2rem 0 rgba(0, 0, 0, 0.2);
      max-width: 100%;
      max-height: 100%;
      width: 100%;
      background-color: #fff;
      color: #000;
      border: 1px solid rgba(130, 130, 130, 0.25);
      pointer-events: auto;
    `;

    if (props.tall) {
      const tall = css`
        height: 100%;
      `;

      base = { ...base, ...tall };
    }

    return base;
  }}
`;

//   ${props => props.primary ? "white" : "palevioletred"};

const Header: FunctionComponent<Props> = ({ children }) => {
  return (
    <div>Header{children}</div>
  );
};
const Body: FunctionComponent<Props> = ({ children }) => {
  return (
    <div>Body{children}</div>
  );
};
const Footer: FunctionComponent<Props> = ({ children }) => {
  return (
    <div>Footer{children}</div>
  );
};

function mapChildren(children: ReactNode): ReactElement[] {
  return Children
    .toArray(children)
    .filter(isValidElement)
    .reduce<ReactElement[]>((arr: ReactElement[], component: ReactElement) => {
      if (component.type === Header) {
        arr[0] = component;
      } else if (component.type === Body) {
        arr[1] = component;
      } else if (component.type === Footer) {
        arr[2] = component;
      }

      return arr;
    }, new Array<ReactElement>(3));
}

function Modal({ children }: Props): ReactElement {
  const [header, body, footer] = mapChildren(children);

  const handleOverlayClick = () => {
    console.log('???');
  };
  return (
    <Container>
      <Overlay data-close-modal onClick={handleOverlayClick} />
      <ContentWrapper centered>
        <Content tall>
          {header}
          {body}
          {footer}
        </Content>
      </ContentWrapper>
    </Container>
  );
}
Modal.Header = Header;
Modal.Body = Body;
Modal.Footer = Footer;
export { Modal };
