type Props = {
  dateTime: Date;
};

const format = (number: number) => {
  return `0${number}`.slice(-2);
};

export const DateTime: React.FC<Props> = ({ dateTime }) => {
  const year = dateTime.getFullYear();
  const month = format(dateTime.getMonth() + 1);
  const day = format(dateTime.getDate());
  const hours = format(dateTime.getHours());
  const minutes = format(dateTime.getMinutes());

  return (
    <p className="tabular-nums">
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
