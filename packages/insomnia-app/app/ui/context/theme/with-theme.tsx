/* eslint-disable react/display-name */
import React, { ComponentType, FunctionComponent, ReactElement } from 'react';
import { ThemeProvider } from 'styled-components';

// // spacing, color, typography, object styles, animation
// const tokens = Object.freeze({

// });

// to conform to the jss theme schema
export const theme = Object.freeze({
  // mixins: Mixins;
  // components?: Components;
  // palette: Palette;
  // shadows: Shadows;
  // transitions: Transitions;
  // typography: Typography;
  // zIndex: ZIndex;

  // palette: {
  //   primary: {
  //     main: '',
  //   },
  //   secondary: {
  //     main: '',
  //   },
  // },
  // spacing: [0, 4, 8, 16, 32, 64],
  // typography: {
  //   fontFamily: [
  //     '-apple-system',
  //     'BlinkMacSystemFont',
  //     '"Segoe UI"',
  //     'Roboto',
  //     '"Helvetica Neue"',
  //     'Arial',
  //     'sans-serif',
  //     '"Apple Color Emoji"',
  //     '"Segoe UI Emoji"',
  //     '"Segoe UI Symbol"',
  //   ].join(','),
  // },
  lineHeight: {
    lg: 'calc(1rem * 4.5)',
    md: 'calc(1rem * 3.6)',
    sm: 'calc(1rem * 2.88)',
    xs: 'calc(1rem * 2.448)',
    xxs: 'calc(1rem * 2.08)',
  },
  fontSize: {
    xxs: '0.6153rem',
    xs: '0.7692rem',
    sm: '0.9230rem',
    md: '1rem',
    lg: '1.1538rem',
    xl: '1.4615rem',
    xxl: '1.6153rem',
    xxxl: '1.8461rem',
  },
  padding: {
    md: 'calc(1rem * 1.2)',
    sm: 'calc(1rem * 0.6)',
    xs: 'calc(1rem * 0.4)',
    xxs: 'calc(1rem * 0.2)',
    lg: 'calc(1rem * 2.5)',
    xl: 'calc(1rem * 5)',
  },
  modal: {
    width: 'calc(1rem * 60)',
    widthWide: 'calc(1rem * 70)',
    widthSkinny: 'calc(1rem * 30)',
  },
  colors: {
    bg: '#fff',
    font: '#000',
  },
});

export function withInsoTheme(Component: ComponentType): FunctionComponent {
  console.log(Component);
  return (): ReactElement => (
    <ThemeProvider theme={theme}>
      <Component />
    </ThemeProvider>
  );
}
