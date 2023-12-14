import * as React from "react";
type Props = React.ComponentPropsWithoutRef<"svg"> & { size?: number };
export const AppLogo: React.FC<Props> = ({ size = 25, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    width={size}
    height={size}
    viewBox="0 0 500 500"
    {...props}
  >
    <path
      fill="#E5E5E5"
      fillRule="evenodd"
      d="M264.048 8.954C184.288-23.29 84.165 31.864 114.711 169.32c3.712 16.701 15.868 28.94 28.001 11.03 17.818-26.304 95.031-134.063 127.275-142.548 14.746-3.88 21.212-17.873-5.939-28.85ZM108.771 310.17C23.073 279.625-45.656 156.593 62.952 91.258c22.399-13.474 22.012 3.547 19.516 14.425-9.042 39.396 16.84 107.304 34.193 152.837 5.445 14.288 10.051 26.372 12.474 34.681 5.94 20.364-8.999 21.021-20.364 16.97Zm124.728 73.82c-78.909 71.274-157.253 39.071-161.215 37.334-59.393-26.027-84-100.972-67.03-132.366 5.94-11.031 12.728-7.637 16.122-3.394 10.86 21.043 50.344 40.445 68.728 47.516 18.385 7.071 70.426 20.364 70.426 20.364l70.425 20.364c4.243.849 6.789 6.348 2.544 10.182Zm9.336-289.339c89.092-94.183 176.398-35.604 193.458 0 19.515 40.728 7.637 45.819-17.819 40.728-12.745-2.549-50.378-2.332-87.338-2.12-36.856.212-73.042.42-83.21-2.122-16.122-4.031-27.012-13.313-5.091-36.486ZM496.537 271.14c14.424-48.364-13.577-123.881-134.063-110.305-34.663 3.906-18.668 28.849-5.091 39.031 17.817 13.363 89.092 69.577 96.729 85.699 7.164 15.124 28 33.94 42.425-14.425Zm-135.761 5.94c11.406 95.032 10.182 135.76-1.697 150.185-10.922 13.262-13.302 34.032 14.425 25.455 117.941-36.486 75.516-156.973 22.061-188.368-29.698-17.441-37.335-8.485-34.789 12.728Zm-18.666 99.274c-1.697 87.396-91.639 165.458-179.882 95.032-14.1-11.253.146-21.187 22.909-25.455 19.207-3.601 66.436-42.584 99.039-69.495l.001-.001c13.486-11.132 24.47-20.197 29.932-23.839 1.026-.683 2.227-1.623 3.545-2.653l.001-.001c9.588-7.499 25.353-19.828 24.455 26.412Zm-8.486-126.426c0 50.61-41.028 91.638-91.638 91.638-50.61 0-91.638-41.028-91.638-91.638 0-50.61 41.028-91.638 91.638-91.638 50.61 0 91.638 41.028 91.638 91.638Zm-91.638 64.486c35.615 0 64.486-28.871 64.486-64.486 0-35.615-28.871-64.486-64.486-64.486-35.615 0-64.486 28.871-64.486 64.486 0 35.615 28.871 64.486 64.486 64.486Zm47.516-64.486c0 26.242-21.274 47.516-47.516 47.516-26.242 0-47.516-21.274-47.516-47.516 0-26.242 21.274-47.516 47.516-47.516 26.242 0 47.516 21.274 47.516 47.516Zm-47.516 28.849c15.933 0 28.849-12.916 28.849-28.849s-12.916-28.849-28.849-28.849-28.849 12.916-28.849 28.849 12.916 28.849 28.849 28.849Zm0-18.667c5.623 0 10.182-4.559 10.182-10.182 0-5.624-4.559-10.182-10.182-10.182s-10.182 4.558-10.182 10.182c0 5.623 4.559 10.182 10.182 10.182Z"
      clipRule="evenodd"
    />
  </svg>
);
