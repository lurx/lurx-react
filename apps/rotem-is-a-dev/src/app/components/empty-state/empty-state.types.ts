import { PropsWithChildren } from 'react';
import type { EMPTY_STATE_VARIANTS } from './empty-state.constants';

export type EmptyStateVariant = ExtractObjectValues<typeof EMPTY_STATE_VARIANTS>;

export type EmptyStateProps = PropsWithChildren<{
  variant: EmptyStateVariant;
}>

