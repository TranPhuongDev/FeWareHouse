export type ExportDetail = {
  exportDetailID: number;
  quantity: number;
  salePrice: number;
  exportID: {
    exportID: number;
    totalAmount: number;
    exportDate: Date;
  };
  productID: {
    productID: number;
    productName: string;
    description: string;
    unit: string;
    importPrice: number;
    salePrice: number;
  };
};

export type ExportDetailAdd = {
  exportDetailID: number;
  quantity: number;
  salePrice: number;
  exportID: number;
  productID: number;
};
