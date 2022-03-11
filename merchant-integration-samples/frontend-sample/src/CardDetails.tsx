import React from "react";

type Props = {
  cardDetails: any
}

export const CardDetails = ({cardDetails}: Props) => {
  return (
    <div>
      {cardDetails["provider"] ? <pre>{JSON.stringify(cardDetails, null, 2)}</pre>: <h3>Token is expired</h3>}
    </div>
  );
};
