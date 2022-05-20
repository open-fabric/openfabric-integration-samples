export const JsonDisplay = (input: {
  content?: any,
  title?: string
}) => {
  return input ? (
    <div style={{ margin: "20px" }}>
      {input.title && <h4 style={{ textAlign: "center" }}>{input.title}</h4>}
      {input.content &&
        Object.keys(input.content).map((key) => {
          return (
            <div style={{ wordBreak: "break-all" }}>
              <b>{key}: </b>
              {input.content[key]}
            </div>
          );
        })}
    </div>
  ) : (
    <></>
  );
};
