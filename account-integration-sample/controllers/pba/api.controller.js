import { catchAsync } from '../../utils/catchAsync.js';
import { of_api_url } from "../../lib/variables.js";
import axios from "axios";
import { GetAccessToken } from "../../services/auth.js";
import { db, addNewPbaTransactions, addNewPbaNotification, getPbaNotification } from '../../db/index.js';
import { trusted_api_key } from "../../lib/variables.js";
import { v4 as uuidv4 } from "uuid";

const blackListedMerchants = ['ABC123TESTMTF01']
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
  const reqData = req.body;

  let approveAmount = reqData.amount;
  let reason;
  let status = 'approved';
  const amount = reqData.amount;

  if (amount >= 8000) {
    approveAmount = 0;
    status = 'declined';
    reason = 'Fail for transaction amount over 8000';
  } 
  else if (amount >= 7900) {
    approveAmount = 7900 / 2;
  }
  else if (amount >= 7800) {
    return res.status(400).send({ status: "Failed", reason: "Fail for transaction amount over 7800" });
  }
  else if (amount >= 7700) {
    return res.status(500);
  }
  else if (amount >= 7600) {
    approveAmount = 10000;
  }
  else if (amount >= 7500) {
    approveAmount = 0;
  }
  else if (amount >= 7400) {
    await new Promise(resolve => setTimeout(resolve, 5000));
  }

  const cvmLimit = reqData?.verification_data?.cvm_limit
  const transitTxnType = reqData?.verification_data?.transit_transaction_type

  if (cvmLimit && transitTxnType === '03' && parseInt(cvmLimit) < amount) {
    approveAmount = 0;
    status = 'declined';
    reason = 'Fail for transaction amount over cvm limit';
  } 

  const networkMerchantId = reqData?.network_merchant_id;

  if (transitTxnType === '07' && blackListedMerchants.includes(networkMerchantId)) {
    approveAmount = 0;
    status = 'declined';
    reason = 'Fail for blacklisted merchant';
  }


  const transaction = {
    ...reqData,
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

export const approvePreAuthTransaction = catchAsync(async (req, res) => {
  const tenantReferenceId = uuidv4()
  const reqData = req.body;

  let approveAmount = reqData.amount;
  let reason;
  let status = 'approved';
  const amount = reqData.amount;

  if (amount >= 8000) {
    approveAmount = 0;
    status = 'declined';
    reason = 'Fail for transaction amount over 8000';
  } 
  else if (amount >= 7900) {
    approveAmount = 7900 / 2;
  }
  else if (amount >= 7800) {
    return res.status(400).send({ status: "Failed", reason: "Fail for transaction amount over 7800" });
  }
  else if (amount >= 7700) {
    return res.status(500);
  }
  else if (amount >= 7600) {
    approveAmount = 10000;
  }
  else if (amount >= 7500) {
    approveAmount = 0;
  }
  else if (amount >= 7400) {
    await new Promise(resolve => setTimeout(resolve, 5000));
  }

  const cvmLimit = reqData?.verification_data?.cvm_limit
  const transitTxnType = reqData?.verification_data?.transit_transaction_type

  if (cvmLimit && transitTxnType === '03' && parseInt(cvmLimit) < amount) {
    approveAmount = 0;
    status = 'declined';
    reason = 'Fail for transaction amount over cvm limit';
  } 

  const networkMerchantId = reqData?.network_merchant_id;

  if (transitTxnType === '07' && blackListedMerchants.includes(networkMerchantId)) {
    approveAmount = 0;
    status = 'declined';
    reason = 'Fail for blacklisted merchant';
  }

  const transaction = {
    ...reqData,
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

    const data = Array.isArray(req.body) ? req.body : [req.body];
    data.forEach((notification) => {
      console.log(
        `Pba transaction notification: id=${notification?.data?.tenant_reference_id}, of_transaction_id=${notification?.data?.transaction_id}, notification_id=${notification?.data?.notification_id}`
      );
      addNewPbaNotification(notification);
    });

    return res.status(200).send({ status: "Success" });
  } else {
    return res
      .status(401)
      .send({ status: "Failed", reason: "Unauthenticated" });
  }
});

export const getNotification = catchAsync(async (req, res) => {
  const networkTxnRef = req.query.txn_lifecycle_id || req.query.eoc_file_ref || req.query.eos_file_ref;
  const notification = getPbaNotification(networkTxnRef);

  if (!notification) {
    return res.status(404).send({ status: "Failed", reason: "Notification not found" });
  }

  res.send(notification);
});
