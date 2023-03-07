import type { NextApiRequest, NextApiResponse } from "next";
import { PPaaSTransaction, QrPaymentTransaction } from "./types";
import { getDB } from "./db";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const ppaasTransactionId = req.query.ppaasTransactionId as string;

    try {
      const ppaasTransaction: PPaaSTransaction = await getDB().getData(`/${ppaasTransactionId}`);
      const transaction: QrPaymentTransaction = {
        serviceImplementationId: ppaasTransaction.serviceImplementationId,
        providerTransactionId: ppaasTransaction.providerTransactionId,
        ppaasTransactionId: ppaasTransaction.ppaasTransactionId,
        paymentStatus: ppaasTransaction.paymentStatus,
        paymentAmount: ppaasTransaction.paymentAmount,
        order: ppaasTransaction.order,
        qrCodeConsumerScan: ppaasTransaction.qrCodeScannedByConsumer,
        creationDateTime: ppaasTransaction.creationDateTime,
      };
  
      res.status(200).json(transaction);
      return;
    } catch (err) {
      res.status(404).json({
        message: `Transaction ${ppaasTransactionId} not found`,
      });
      return;
    }
  };

  res.status(405).json({
    message: `Method ${req.method} not allowed`,
  });
};

export default handler;
