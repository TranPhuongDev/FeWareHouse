import type { IProductTableFilters } from 'src/types/product';
import type { UseSetStateReturn } from 'minimal-shared/hooks';
import type { FiltersResultProps } from 'src/components/filters-result';

import { useCallback } from 'react';
import { upperFirst } from 'es-toolkit';

import Chip from '@mui/material/Chip';

import { chipProps, FiltersBlock, FiltersResult } from 'src/components/filters-result';
import { ISupplierTableFilters } from 'src/types/supplier';

// ----------------------------------------------------------------------

type Props = FiltersResultProps & {
  filters: UseSetStateReturn<ISupplierTableFilters>;
};

export function SupplierTableFiltersResult({ filters, totalResults, sx }: Props) {
  const { state: currentFilters, setState: updateFilters, resetState: resetFilters } = filters;

  const handleRemoveSupplierName = useCallback(
    (inputValue: string) => {
      const newValue = currentFilters.supplierName.filter((item) => item !== inputValue);

      updateFilters({ supplierName: newValue });
    },
    [updateFilters, currentFilters.supplierName]
  );

  const handleRemoveAddress = useCallback(
    (inputValue: string) => {
      const newValue = currentFilters.address.filter((item) => item !== inputValue);

      updateFilters({ address: newValue });
    },
    [updateFilters, currentFilters.address]
  );

  return (
    <FiltersResult totalResults={totalResults} onReset={() => resetFilters()} sx={sx}>
      <FiltersBlock label="SupplierName:" isShow={!!currentFilters.supplierName.length}>
        {currentFilters.supplierName.map((item) => (
          <Chip
            {...chipProps}
            key={item}
            label={upperFirst(item)}
            onDelete={() => handleRemoveSupplierName(item)}
          />
        ))}
      </FiltersBlock>

      <FiltersBlock label="Address:" isShow={!!currentFilters.address.length}>
        {currentFilters.address.map((item) => (
          <Chip
            {...chipProps}
            key={item}
            label={upperFirst(item)}
            onDelete={() => handleRemoveAddress(item)}
          />
        ))}
      </FiltersBlock>
    </FiltersResult>
  );
}
