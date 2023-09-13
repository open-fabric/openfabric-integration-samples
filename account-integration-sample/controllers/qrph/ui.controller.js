import qr from "qrcode";
import { catchAsync } from "../../utils/catchAsync.js";
import { db } from '../../db/index.js'

export const InitializeTxnUI = catchAsync(async (req, res) => {
  res.render("qrph/initiate-txn", {});
  return;
});

export const GetTxnUI = catchAsync(async (req, res) => {
  const id = req.query.id;

  if (!id) {
    console.error("Missing `id` in query");
    return res.status(400).json({ error: "Missing `id` in query" });
  }

  const txn = await db.getData(`/transactions/${id}`)
  const qrCode = txn.qrCode

  qr.toDataURL(encode(qrCode), (err, qrSRC) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: err });
    }

    res.render("qrph/get-txn", {
      data: txn.data,
      qrSRC,
      qrCode
    });
  });
});

const encode = (payload) => {
  const data = JSON.stringify(payload);
  return encodeURIComponent(data);
}