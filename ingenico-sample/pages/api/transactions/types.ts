export type PaymentStatus =
  | "initializing"
  | "authorizing"
  | "authorized"
  | "declined"
  | "refunded"
  | "cancelled";

export interface QrPaymentTransactionRequest {
  paymentType?: string;
  paymentScenario?: "consumerscan";
  serviceDomain?: "apm";
  paymentAmount: {
    amount: number;
    currency: string;
  };
  order: {
    orderId: string;
    orderDescription: string;
  };
}

export interface QrPaymentTransaction extends QrPaymentTransactionRequest {
  serviceImplementationId: string;
  providerTransactionId: string;
  ppaasTransactionId: string;
  paymentStatus: PaymentStatus;
  creationDateTime: string;
  qrCodeConsumerScan?: {
    codeType: "qrcode";
    codeValue: string;
    displayType: string;
    expiryDateTime: string;
  };
}

export interface PPaaSTransactionRequest {
  serviceImplementationId: string;
  ppaasTransactionId: string;
  paymentScenario?: "scanned-by-consumer";
  paymentAmount: {
    amount: number;
    currency: string;
  };
  order: {
    orderId: string;
    orderDescription: string;
  };
  organization?: {
    ppaasOrganizationId: string;
    name: string;
  };
  merchant?: {
    ppaasMerchantId: string;
    name: string;
  };
  store?: {
    ppaasStoreId: string;
    name: string;
  };
}

export interface PPaaSTransaction extends PPaaSTransactionRequest {
  providerTransactionId: string;
  paymentStatus: PaymentStatus;
  creationDateTime: string;
  qrCodeScannedByConsumer?: {
    codeType: "qrcode";
    codeValue: string;
    displayType: string;
    expiryDateTime: string;
  };
}