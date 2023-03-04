import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { JsonDB, Config } from 'node-json-db';
import QRCode from 'qrcode';
import { PPaaSTransaction, PPaaSTransactionRequest, QrPaymentTransaction, QrPaymentTransactionRequest } from "./types";

const db = new JsonDB(new Config("ppaas-transactions", true, false, '/'));

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const transactionRequest = req.body as QrPaymentTransactionRequest;
    const ppaasTransactionRequest: PPaaSTransactionRequest = {
      serviceImplementationId: process.env.INGENICO_SERVICE_IMPLEMENTATION_ID!,
      ppaasTransactionId: uuidv4(),
      paymentScenario: "scanned-by-consumer",
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
    };
    const ppaasTransaction: PPaaSTransaction = (await axios.post(
      process.env.OF_INGENICO_TRANSACTIONS_URL!,
      ppaasTransactionRequest
    )).data;

    // Temporarily hard coding QR code to sample tenant approval page for testing
    // TODO: remove once QR generation is implemented
    if (ppaasTransaction.qrCodeScannedByConsumer) {
      ppaasTransaction.qrCodeScannedByConsumer.codeValue = await QRCode.toDataURL(
        `https://of-test-1.samples.${process.env.NEXT_PUBLIC_ENV}.openfabric.co/orchestrated/checkout?id=${ppaasTransaction.providerTransactionId}`
      )
    }
    
    const savedTransaction = {
      ...ppaasTransactionRequest,
      ...ppaasTransaction,
    }
    await db.push(savedTransaction.ppaasTransactionId, savedTransaction);
    const transaction: QrPaymentTransaction = {
      serviceImplementationId: savedTransaction.serviceImplementationId,
      providerTransactionId: savedTransaction.providerTransactionId,
      ppaasTransactionId: savedTransaction.ppaasTransactionId,
      paymentStatus: savedTransaction.paymentStatus,
      paymentAmount: savedTransaction.paymentAmount,
      order: savedTransaction.order,
      qrCodeConsumerScan: savedTransaction.qrCodeScannedByConsumer,
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
