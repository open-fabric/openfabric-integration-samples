import React, { FunctionComponent } from "react";
import { RestartBtn } from "./RestartBtn";

export const RestartBtns: FunctionComponent = (props) => {
  return (
    <>
      <RestartBtn
        title="Restart Pure JS Payment Gateway Flow - Vanilla"
        path="orchestrated/vanilla"
      />
      <RestartBtn
        title="Restart Backend Flow"
        path="orchestrated/backend-sample"
      />
      <RestartBtn
        title="Restart Payment Gateway Flow"
        path="orchestrated/pg-sample"
      />
      <RestartBtn title="Restart Embedded Flow" path="embedded/checkout" />
    </>
  );
};
