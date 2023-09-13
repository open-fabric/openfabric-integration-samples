import { GetTransactionByIdV1 } from "../../services/of-transactions/getTransactionById.js";
import qr from "qrcode";
import { catchAsync } from "../../utils/catchAsync.js";

export const InitializeTxnUI = catchAsync(async (req, res) => {
  res.render("qrph/initiate-txn", {});
  return;
});

export const GetTxnUI = catchAsync(async (req, res) => {
  const id = req.query.id;
  const qrCode = req.query.qr_code;

  if (!id) {
    console.error("Missing `id` in query");
    return res.status(400).json({ error: "Missing `id` in query" });
  }

  const txn = await GetTransactionByIdV1(id);

  qr.toDataURL(encode(qrCode), (err, qrSRC) => {
    res.render("qrph/get-txn", {
      data: txn,
      qrSRC,
      qrCode
    });
  });
});

const encode = (payload) => {
  const data = JSON.stringify(payload);
  return encodeURIComponent(data);
}