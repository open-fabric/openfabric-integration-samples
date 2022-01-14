import {Typography} from "@material-ui/core";
import {RestartBtn} from "./RestartBtn";

export const PaymentSuccess = () =>
    (
        <div style={{display: "flex", flexDirection: "column"}}>
            <Typography variant="h5" gutterBottom style={{color: 'green'}}>
                Payment Success
            </Typography>
            <RestartBtn/>
        </div>
    );
