import { FloatingArrow, FloatingArrowProps } from '@floating-ui/react';
import { usePopoverContext } from './provider';

type Props = Omit<FloatingArrowProps, 'ref' | 'context'>;

export const _Arrow: React.FC<Props> = (props) => {
  const { arrowRef, context } = usePopoverContext();

  return <FloatingArrow ref={arrowRef} context={context} {...props} />;
};
