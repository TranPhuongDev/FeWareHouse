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
