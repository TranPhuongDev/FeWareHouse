export type ExportItem = {
  exportID: number;
  customerID: {
    customerID: number;
    customerName: string;
    address: string;
    phone: string;
    email: string;
    status: string;
  };
  totalAmount: number;
  exportDate: Date;
};
