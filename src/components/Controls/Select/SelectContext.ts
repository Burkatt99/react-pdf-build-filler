import React from "react";

import { ISelectProps } from "./types";

export const SelectContext = React.createContext<ISelectProps>({
  options: [],
});
