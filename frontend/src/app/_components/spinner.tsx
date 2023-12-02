import { cx } from 'cva';

const sizeClass = { md: 'w-[35px] h-[35px]', sm: 'w-[20px] h-[20px]' };
const borderClass = { md: 'border-[5px]', sm: 'border-[3px]' };
const spinnerBase = 'absolute rounded-full';
const spinnerClass = {
  black: 'border-neutral-900',
  white: 'border-neutral-100',
};
// TODO 確認する
const spinnerBgClass = {
  black: 'border-transparent',
  white: 'border-transparent',
};

type Props = { size?: 'md' | 'sm'; color?: 'black' | 'white' };
export const Spinner: React.FC<Props> = ({ size = 'md', color = 'black' }) => {
  return (
    <div className={cx('relative', sizeClass[size])}>
      <div
        className={cx(
          spinnerBase,
          spinnerBgClass[color],
          sizeClass[size],
          borderClass[size],
        )}
      />
      <div
        className={cx(
          'animate-spin border-t-transparent',
          spinnerBase,
          spinnerClass[color],
          sizeClass[size],
          borderClass[size],
        )}
      />
    </div>
  );
};
