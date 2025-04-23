export type ISupplierItem = {
  supplierID: string;
  supplierName: string;
  address: string;
  phone: string;
  email: string;
  website: string;
};

export type IAddSupplierItem = {
  supplierID: string;
  supplierName: string;
  address: string;
  phone: string;
  email: string;
  website: string;
};

export type ISupplierTableFilters = {
  supplierName: string[];
  address: string[];
};
