import qr from "qrcode";
import { catchAsync } from "../../utils/catchAsync";
import { GetTransactionById } from "../../services/of-transactions";

function encode(payload) {
  const data = JSON.stringify(payload);
  return encodeURIComponent(data);
}

export const CheckOutUI = catchAsync(async (req, res) => {
    const id = req.query.id;
    if (!id) {
        throw new Error("Missing `id` in query");
    }
    const transInfo = await GetTransactionById({
        transaction_id: id,
    });

    const base_url = req.protocol + "://" + req.get('host') + "/api/orchestrated/";
    const payload = {
        account_reference_id: transInfo?.account_reference_id,
        base_url,
        id,
    }
    const deeplink = 'openfabric://checkout/' + encode(payload);
    qr.toDataURL(deeplink, (err, qrSRC) => {
        res.render("orchestrated/index", {
            account_reference_id: transInfo?.account_reference_id,
            id,
            qrSRC,
        });
    });

});
