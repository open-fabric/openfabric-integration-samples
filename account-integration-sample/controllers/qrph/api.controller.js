import { catchAsync } from '../../utils/catchAsync.js';
import {of_api_url} from "../../lib/variables.js";
import axios from "axios";
import {GetAccessToken} from "../../services/auth.js";
import { generateEmvcoQrText } from '../../utils/generateEmvcoQrText.js';
import { db } from '../../db/index.js';
import qr from 'qrcode';
import { encodeQr } from '../../utils/encodeQr.js';

export const initiateQrphTxn = catchAsync(async (req, res) => {
  const {access_token} = await GetAccessToken()
  const data = req.body;
  const qrCode = createQrCodePayload(data);

  const reqBody = {
    tenant_reference_id: data.tenant_reference_id,
    amount: data.amount,
    currency: data.currency,
    instrument: 'qrph',
    qr_code: qrCode,
  }

  const result = await axios.post(
    new URL("/v1/tenants/transactions", of_api_url).toString(),
    reqBody,
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
    }
  );

  db.push(`/transactions/${result.data.id}`, {
    data:result.data,
    qrCode
  })

  res.send(
    {
      id: result.data.id,
    }
  );
});

export const previewQrphTxn = catchAsync(async (req, res) => {
  const data = req.body;
  const qrCode = createQrCodePayload(data);

  qr.toDataURL(encodeQr(qrCode), (err, qrSRC) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: err });
    }

    res.send({
      qrCode,
      data: JSON.stringify(data)
    });
    return;
  });
})

const createQrCodePayload = (data) => {
  const qrPayload = {
    merchantAccountInfo: {
      globalIdentifier: 'ph.ppmi.p2m',
      paymentNetworkInformation: {
        bankCode: data.bank_code,
        bankNumber: data.bank_account_number,
        bankBranchCode: data.bank_branch_code || '000',
      },
    },
    merchantCategoryCode: data.merchant_category_code,
    transactionCurrency: data.currency_code,
    countryCode: data.country_code,
    merchantName: data.merchant_name,
    merchantCity: data.merchant_city,
    postalCode: data.postal_code,
    additionalDataField: { // Use default values
      '00': 'ph.ppmi.qrph',
      '03': 'SRSU0020',
      '05': '217050000066990134094',
      '07': 'GEN00351',
    },
  };

  return generateEmvcoQrText(qrPayload);
}