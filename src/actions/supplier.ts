import type { SWRConfiguration } from 'swr';

import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher, endpoints } from 'src/lib/axios';
import { ISupplierItem } from 'src/types/supplier';
import axios from 'src/lib/axios';
// ----------------------------------------------------------------------

const swrOptions: SWRConfiguration = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

// ----------------------------------------------------------------------

type SupplierData = {
  suppliers: ISupplierItem[];
};

export function useGetSupplier() {
  const url = endpoints.supplier.list;

  const { data, isLoading, error, isValidating } = useSWR<SupplierData>(url, fetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      suppliers: data?.suppliers || [],
      suppliersLoading: isLoading,
      suppliersError: error,
      suppliersValidating: isValidating,
      suppliersEmpty: !isLoading && !isValidating && !data?.suppliers.length,
    }),
    [data?.suppliers, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export async function getListSupplier() {
  const res = await axios.get(endpoints.supplier.list);

  return res.data;
}

// ----------------------------------------------------------------------

// type SupplierData = {
//   supplier: ISupplierItem;
// };

// export function useGetProduct(productId: string) {
//   const url = productId ? [endpoints.product.details, { params: { productId } }] : '';

//   const { data, isLoading, error, isValidating } = useSWR<SupplierData>(url, fetcher, swrOptions);

//   const memoizedValue = useMemo(
//     () => ({
//       supplier: data?.supplier,
//       supplierLoading: isLoading,
//       supplierError: error,
//       supplierValidating: isValidating,
//     }),
//     [data?.supplier, error, isLoading, isValidating]
//   );

//   return memoizedValue;
// }

// ----------------------------------------------------------------------

// type SearchResultsData = {
//   results: IProductItem[];
// };

// export function useSearchProducts(query: string) {
//   const url = query ? [endpoints.product.search, { params: { query } }] : '';

//   const { data, isLoading, error, isValidating } = useSWR<SearchResultsData>(url, fetcher, {
//     ...swrOptions,
//     keepPreviousData: true,
//   });

//   const memoizedValue = useMemo(
//     () => ({
//       searchResults: data?.results || [],
//       searchLoading: isLoading,
//       searchError: error,
//       searchValidating: isValidating,
//       searchEmpty: !isLoading && !isValidating && !data?.results.length,
//     }),
//     [data?.results, error, isLoading, isValidating]
//   );

//   return memoizedValue;
// }
