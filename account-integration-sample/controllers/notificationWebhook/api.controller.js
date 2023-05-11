import { catchAsync } from "../../utils/catchAsync";
import { trusted_api_key } from "../../lib/variables";
export const WebhookCallBack = catchAsync(async (req, res) => {
  if (req.header("X-Api-Key") === trusted_api_key) {
    console.log(
      "Received OF notifications: ",
      JSON.stringify(req.body, null, 2)
    );

    if (Array.isArray(req.body)) {
      req.body.forEach((notification) => {
        console.log(
          `Transaction charged: id=${notification.account_reference_id}, status=${notification.status}, charged_at=${notification.charged_at}`
        );
      });
    }
    
    return res.status(200).send({ status: "Success" });
  } else {
    return res
      .status(401)
      .send({ status: "Failed", reason: "Unauthenticated" });
  }
});
