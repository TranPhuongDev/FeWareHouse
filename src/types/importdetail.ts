export type ImportDetail = {
  importDetailID: number;
  quantity: number;
  importPrice: number;
  importID: {
    importID: number;
    totalAmount: number;
    importDate: Date;
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
