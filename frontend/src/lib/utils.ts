import { SyntheticEvent } from 'react';

export const stopPropagation = (e: SyntheticEvent) => {
  e.stopPropagation();
};

export const noop = () => {};
