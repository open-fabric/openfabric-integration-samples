import Button from "@material-ui/core/Button";

type Props = {
  path: string;
  title: string;
}
export const RestartBtn = ({path, title}: Props) => {
  const onClick = () => {
    window.location.href = window.location.origin + "/" + path;
  };
  return (
    <div style={{width: 300, margin: 12}}>
      <Button fullWidth={true} variant="outlined" color="primary" onClick={onClick}>
        {title}
      </Button>
    </div>
  );
};
