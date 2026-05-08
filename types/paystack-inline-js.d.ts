declare module "@paystack/inline-js" {
  type PaystackTransactionResponse = {
    reference: string;
    id?: number;
    message?: string;
  };

  type PaystackCallbacks = {
    onSuccess?: (transaction: PaystackTransactionResponse) => void | Promise<void>;
    onCancel?: () => void;
    onError?: (error: { message?: string }) => void;
    onLoad?: (response: { id?: number; customer?: unknown; accessCode?: string }) => void;
  };

  export default class PaystackPop {
    newTransaction(options: Record<string, unknown> & PaystackCallbacks): unknown;
    resumeTransaction(accessCode: string, callbacks: PaystackCallbacks): unknown;
    static resumeTransaction(accessCode: string, callbacks: PaystackCallbacks): unknown;
  }
}
