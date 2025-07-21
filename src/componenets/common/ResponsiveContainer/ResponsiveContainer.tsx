import React from 'react';
import styles from './ResponsiveContainer.module.css';
import { Flex, type FlexProps } from '@mantine/core';

type ResponsiveContainerProps = {
  children: React.ReactNode;
  className?: string;
  flex?: boolean;
} & Pick<FlexProps, 'direction' | 'justify' | 'align'>;

export default function ResponsiveContainer({
  children,
  className = '',
  flex = false,
  direction,
  justify,
  align,
}: ResponsiveContainerProps) {
  return flex ? (
    <Flex
      direction={direction}
      justify={justify}
      align={align}
      className={`${styles.container} ${className}`}
    >
      {children}
    </Flex>
  ) : (
    <div className={`${styles.container} ${className}`}>{children}</div>
  );
}
