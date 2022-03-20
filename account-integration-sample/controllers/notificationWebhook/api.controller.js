import { catchAsync } from "../../utils/catchAsync";

export const WebhookCallBack = catchAsync(async (req, res) => {
  if (req.header("X-Api-Key") === TRUSTED_API_KEY) {
    console.log(
      "Received OF notifications: ",
      JSON.stringify(req.body, null, 2)
    );
    req.body.forEach((notification) => {
      console.log(
        `Transaction charged: id=${notification.account_reference_id}, status=${notification.status}, charged_at=${notification.charged_at}`
      );
    });
    return res.status(200).send({ status: "Success" });
  } else {
    return res
        .status(401)
        .send({ status: "Failed", reason: "Unauthenticated" });
  }
});