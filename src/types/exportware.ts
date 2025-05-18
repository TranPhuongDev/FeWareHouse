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

export type ExportDetail = {
  exportDetailID: number;
  quantity: number;
  salePrice: number;
  productID: {
    productID: number;
    productName: string;
    description: string;
    unit: string;
  };
};
export type ExportDetailItem = {
  exportID: number;
  customerID: {
    customerID: number;
    customerName: string;
    address: string;
    phone: string;
    status: string;
    email: string;
  };
  totalAmount: number;
  exportDate: Date;
  exportDetailID: ExportDetail[];
};
