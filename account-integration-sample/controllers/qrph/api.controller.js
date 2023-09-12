import crypto from 'crypto'
import { catchAsync } from '../utils/catchAsync.js';
import {of_api_url} from "../lib/variables.js";
import axios from "axios";
import {GetAccessToken} from "../services/auth.js";

export const initiateQrphTxn = catchAsync(async (req, res) => {
  const {access_token} = await GetAccessToken()
  const ref = crypto.randomUUID()
  const data = req.body;
  const qrCode = '' //CreateQrCode
  const result = await axios.post(
    new URL("/v1/tenants/transactions", of_api_url).toString(),
    {
      tenant_reference_id: data.tenant_reference_id || ref,
      amount: data.amount,
      currency: data.currency,
      instrument: 'qrph',
      qr_code: qrCode,
    },
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
    }
  );

  res.send(
    {
      id: result.data.id,
      qr_code: qrCode,
    }
  );
});