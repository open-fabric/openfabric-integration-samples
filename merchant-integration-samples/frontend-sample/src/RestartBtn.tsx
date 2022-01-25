import Button from "@material-ui/core/Button";

export const RestartBtn = () => {
  const onClick = () => {
    window.location.href = window.location.origin;
  };
  return (
    <Button variant="outlined" color="primary" onClick={onClick} style={{marginTop: 50}}>
      Restart Flow
    </Button>
  );
};
