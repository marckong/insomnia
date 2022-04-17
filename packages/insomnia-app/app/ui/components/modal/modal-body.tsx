import React, { FunctionComponent, HTMLAttributes, ReactNode } from 'react';
import styled from 'styled-components';

interface Props extends HTMLAttributes<HTMLDivElement> {
  noScroll?: boolean;
  children?: ReactNode;
}

// export const ModalBody: FC<Props> = memo(({ className, children, noScroll, ...props }) => {
//   const classes = classnames(className, 'modal__body theme--dialog__body', {
//     'modal__body--no-scroll': noScroll,
//   });
//   return (
//     <div className={classes} {...props}>
//       {children}
//     </div>
//   );
// });

const ModalBodyWrapper = styled.div`
    overflow: auto;
    min-height: 2rem;
    box-sizing: border-box;
    max-width: 100%;
    background-color: var(--color-bg);
    color: var(--color-font);
`;

export const ModalBody: FunctionComponent<Props> = ({ children, noScroll, ...otherProps }) => {
  return (
    <ModalBodyWrapper {...otherProps}>{children}</ModalBodyWrapper>
  );
};
