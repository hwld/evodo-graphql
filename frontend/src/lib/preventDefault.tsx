import { KeyboardEventHandler } from "react";

export const preventDefaultEnter: KeyboardEventHandler<Element> = (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
  }
};
