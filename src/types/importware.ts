export type ImportItem = {
  importID: number;
  supplierID: {
    supplierID: number;
    supplierName: string;
    address: string;
    phone: string;
    email: string;
    website: string;
  };
  totalAmount: number;
  importDate: Date;
};

export type ImportDetail = {
  importDetailID: number;
  quantity: number;
  importPrice: number;
  productID: {
    productID: number;
    productName: string;
    description: string;
    unit: string;
    importPrice: number;
    salePrice: number;
  };
};
export type ImportDetailItem = {
  importID: number;
  supplierID: {
    supplierID: number;
    supplierName: string;
    address: string;
    phone: string;
    email: string;
    website: string;
  };
  totalAmount: number;
  importDate: Date;
  importDetailWarehosueID: ImportDetail[];
};
