import {Typography} from "@material-ui/core";
import {RestartBtn} from "./RestartBtn";

export const PaymentFailed = () =>
    (
        <div style={{display: "flex", flexDirection: 'column'}}>
            <Typography variant="h5" gutterBottom style={{color: 'red'}}>
                Payment Failed
            </Typography>
            <RestartBtn/>
        </div>
    );
