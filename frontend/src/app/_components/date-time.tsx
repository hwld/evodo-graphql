import { cx } from "cva";

type Props = {
  dateTime: Date;
  size?: "md" | "xs";
  muted?: boolean;
};

const format = (number: number) => {
  return `0${number}`.slice(-2);
};

export const DateTime: React.FC<Props> = ({
  dateTime,
  size = "md",
  muted = false,
}) => {
  const year = dateTime.getFullYear();
  const month = format(dateTime.getMonth() + 1);
  const day = format(dateTime.getDate());
  const hours = format(dateTime.getHours());
  const minutes = format(dateTime.getMinutes());

  const sizeClass = {
    md: "",
    xs: "text-xs",
  };

  return (
    <p
      className={cx(
        "tabular-nums",
        sizeClass[size],
        muted && "text-neutral-500",
      )}
    >
      <span>
        {year}
        <span className="mx-[1px]">/</span>
        {month}
        <span className="mx-[1px]">/</span>
        {day}
        <span className="ml-2">{hours}</span>
        <span className="mx-[1px]">:</span>
        {minutes}
      </span>
    </p>
  );
};
