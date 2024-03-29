import qr from "qrcode";
import { catchAsync } from "../../utils/catchAsync.js";
import { GetTransactionById } from "../../services/of-transactions/index.js";

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

    if(transInfo.status !== 'Created') {
        res.redirect(transInfo.gateway_success_url);
        return
    }

    const base_url = req.protocol + "://" + req.get('host') + "/api/orchestrated/mobile/";
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
            currency: transInfo?.currency,
            amount: transInfo?.amount,
            qrSRC,
            deeplink
        });
    });

});
