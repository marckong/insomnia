import { css } from 'styled-components';

export const positionStyle = css`
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

export const contentWrapperBaseStyle = css`
    width: calc(1rem * 60);
    height: 100%;
    max-width: 100%;
    max-height: 100%;
    margin: auto;
    pointer-events: none;
`;

export const contentBaseStyle = css`
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: auto minmax(0, 1fr) auto;
  border-radius: calc(1rem * 0.3);
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
