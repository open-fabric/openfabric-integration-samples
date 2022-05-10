import qr from "qrcode";
import { catchAsync } from "../../utils/catchAsync";
import { GetTransactionById } from "../../services/of-transactions";

export const CheckOutUI = catchAsync(async (req, res) => {
  const id = req.query.id;
  if (!id) {
    throw new Error("Missing `id` in query");
  }
  const transInfo = await GetTransactionById({
    transaction_id: id,
  });

  if (req.device.type !== 'desktop') {
    res.render("orchestrated/index", {
      account_reference_id: transInfo?.account_reference_id,
      id,
      deeplink: "openfabric://" + req.originalUrl
    });
  }

  const fullUrl = 'openfabric://' + req.get('host') + req.originalUrl;
  qr.toDataURL(fullUrl, (err, qrSRC) => {
    res.render("orchestrated/index", {
      account_reference_id: transInfo?.account_reference_id,
      id,
      qrSRC
    });
  });

});
