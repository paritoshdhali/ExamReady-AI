import { ReactNode } from 'react';

export interface NavItem {
  label: string;
  path: string;
  isButton?: boolean;
}

export interface LayoutProps {
  children: ReactNode;
}