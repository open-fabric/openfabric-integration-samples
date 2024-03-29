import { v4 as uuid } from "uuid";
import qr from "qrcode";
import { catchAsync } from "../../utils/catchAsync.js";
import { db } from '../../db/index.js'
import { encodeQr } from "../../utils/encodeQr.js";

export const InitializeTxnUI = catchAsync(async (req, res) => {
  const qrCode = req.query.qr_code;
  const dataJson = req.query.data;
  const data = dataJson && JSON.parse(dataJson)
  const result = {
    ...data,
    tenant_reference_id: data?.tenant_reference_id || uuid()
  };
  qr.toDataURL(encodeQr(qrCode), (err, qrSRC) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: err });
    }

    res.render("qrph/initiate-txn", {
      qrSRC: qrCode ? qrSRC : undefined,
      qrCode,
      data: JSON.stringify(result)
    });
  });
});

export const GetTxnUI = catchAsync(async (req, res) => {
  const id = req.query.id;

  if (!id) {
    console.error("Missing `id` in query");
    return res.status(400).json({ error: "Missing `id` in query" });
  }

  const txn = await db.getData(`/transactions/${id}`)
  const qrCode = txn.qrCode

  qr.toDataURL(encodeQr(qrCode), (err, qrSRC) => {
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