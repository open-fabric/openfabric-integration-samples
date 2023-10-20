import { catchAsync } from '../../utils/catchAsync.js';
import {of_api_url} from "../../lib/variables.js";
import axios from "axios";
import {GetAccessToken} from "../../services/auth.js";
import { db } from '../../db/index.js';

export const provisionAccountDevice = catchAsync(async (req, res) => {
  const {access_token} = await GetAccessToken('resources/customers.create')
  // read header X-User-Id from Express request
  const userId = req.headers["x-user-id"];
  const tenantCustomerRef = "C0"+userId;
  const financialAccountNumber = "101"+userId;
  const data = req.body;

  const reqBody = {
    tenant_customer_ref: tenantCustomerRef,
    financial_account_number: financialAccountNumber,
    wallet_id: data.wallet_id,
    device_name: data.device_name,
    billing_currency: "PHP",
  }

  const result = await axios.post(
    new URL("/v1/pba/provision", of_api_url).toString(),
    reqBody,
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
    }
  );

  db.push(`/pba/customers/${tenantCustomerRef}`, {
    data:result.data,
  })

  res.send(
    {
      entrollment_data: result.data.sdk_tokenize_account_device_ref,
    }
  );
});

