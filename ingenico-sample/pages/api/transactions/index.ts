import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { PPaaSTransaction, PPaaSTransactionRequest, QrPaymentTransaction, QrPaymentTransactionRequest } from "./types";
import { getDB } from "./db";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const transactionRequest = req.body as QrPaymentTransactionRequest;
    const ppaasTransactionRequest: PPaaSTransactionRequest = {
      serviceImplementationId: process.env.INGENICO_SERVICE_IMPLEMENTATION_ID!,
      ppaasTransactionId: uuidv4(),
      paymentScenario: "consumerscan",
      paymentAmount: {
        amount: transactionRequest.paymentAmount.amount,
        currency: transactionRequest.paymentAmount.currency,
      },
      order: {
        orderId: transactionRequest.order.orderId,
        orderDescription: transactionRequest.order.orderDescription,
      },
      organization: {
        ppaasOrganizationId: process.env.INGENICO_ORGANIZATION_ID!,
        name: "DBS",
      },
      merchant: {
        ppaasMerchantId: process.env.INGENICO_MERCHANT_ID!,
        name: "Starbucks",
      },
      store: {
        ppaasStoreId: process.env.INGENICO_STORE_ID!,
        name: "Starbucks @Aperia Mall",
      },
      configuration: {
        description: "ingenico"
      }
    };
    const ppaasTransaction: PPaaSTransaction = (await axios.post(
      process.env.OF_INGENICO_TRANSACTIONS_URL!,
      ppaasTransactionRequest
    )).data;
    
    const savedTransaction = {
      ...ppaasTransactionRequest,
      ...ppaasTransaction,
    }
    await getDB().push(`/${savedTransaction.ppaasTransactionId}`, savedTransaction);
    const transaction: QrPaymentTransaction = {
      serviceImplementationId: savedTransaction.serviceImplementationId,
      providerTransactionId: savedTransaction.providerTransactionId,
      ppaasTransactionId: savedTransaction.ppaasTransactionId,
      paymentStatus: savedTransaction.paymentStatus,
      paymentAmount: savedTransaction.paymentAmount,
      order: savedTransaction.order,
      qrCodeConsumerScan: savedTransaction.qrCodeConsumerScan,
      creationDateTime: savedTransaction.creationDateTime,
    };

    res.status(201).json(transaction);
    return;
  };

  res.status(405).json({
    message: `Method ${req.method} not allowed`,
  });
};

export default handler;
