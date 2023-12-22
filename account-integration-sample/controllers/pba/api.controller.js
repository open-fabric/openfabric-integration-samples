import { catchAsync } from '../../utils/catchAsync.js';
import { of_api_url } from "../../lib/variables.js";
import axios from "axios";
import { GetAccessToken } from "../../services/auth.js";
import { db, addNewPbaTransactions } from '../../db/index.js';
import { trusted_api_key } from "../../lib/variables.js";

export const provisionAccountDevice = catchAsync(async (req, res) => {
  const { access_token } = await GetAccessToken('resources/customers.create')
  // read header X-User-Id from Express request
  const userId = req.headers["x-user-id"];
  const tenantCustomerRef = "C0" + userId;
  const financialAccountNumber = "FR" + userId;
  const data = req.body;

  const reqBody = {
    tenant_customer_ref: tenantCustomerRef,
    tenant_account_ref: financialAccountNumber,
    wallet_id: data.wallet_id,
    device_name: data.device_name
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
    data: result.data,
  })

  res.send(
    {
      entrollment_data: result.data.sdk_tokenize_account_device_data,
      result: result.data
    }
  );
});

export const approveFinalAuthTransaction = catchAsync(async (req, res) => {
  const tenantReferenceId = uuidv4()
  let approveAmount = req.data.amount;
  let reason;
  let status = 'approved';

  if (req.data.amount > 100000) {
    approveAmount = 0;
    status = 'declined';
    reason = 'Fail for transaction amount over 100000';
  } else {
    if (req.data.auth_indicator?.is_partial_approval) {
      approveAmount -= approveAmount > 10 ? 10 : 1
    }
  }


  const transaction = {
    ...req.data,
    tenant_reference_id: tenantReferenceId,
    approved_amount: approveAmount,
    status: status,
    reason: reason,
  }

  addNewPbaTransactions(transaction);

  res.send(
    {
      tenant_reference_id: transaction.tenant_reference_id,
      approved_amount: transaction.approved_amount,
      status: transaction.status,
      reason: transaction.reason,
    }
  );
});

export const WebhookCallBack = catchAsync(async (req, res) => {
  if (req.header("X-Api-Key") === trusted_api_key || req.header("X-API-Key") === trusted_api_key) {
    console.log(
      "Received OF notifications: ",
      JSON.stringify(req.body, null, 2)
    );

    if (Array.isArray(req.body)) {
      req.body.forEach((notification) => {
        console.log(
          `Pba transaction notification: id=${notification.tenant_reference_id}, of_transaction_id=${notification.transaction_id}, notification_id=${notification.notification_id}`
        );
      });
    }

    return res.status(200).send({ status: "Success" });
  } else {
    return res
      .status(401)
      .send({ status: "Failed", reason: "Unauthenticated" });
  }
});

