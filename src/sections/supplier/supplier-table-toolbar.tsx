import type { IProductTableFilters } from 'src/types/product';
import type { SelectChangeEvent } from '@mui/material/Select';
import type { UseSetStateReturn } from 'minimal-shared/hooks';

import { useState, useCallback } from 'react';
import { varAlpha } from 'minimal-shared/utils';
import { usePopover } from 'minimal-shared/hooks';

import Select from '@mui/material/Select';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';

import { Iconify } from 'src/components/iconify';
import { CustomPopover } from 'src/components/custom-popover';
import { ISupplierTableFilters } from 'src/types/supplier';

// ----------------------------------------------------------------------

type Props = {
  filters: UseSetStateReturn<ISupplierTableFilters>;
  options: {
    supplierName: { value: string; label: string }[];
    address: { value: string; label: string }[];
  };
};

export function SupplierTableToolbar({ filters, options }: Props) {
  const menuActions = usePopover();

  const { state: currentFilters, setState: updateFilters } = filters;

  const [supplierName, setsupplierName] = useState(currentFilters.supplierName);
  const [address, setAddress] = useState(currentFilters.address);

  const handleChangeSupplierName = useCallback((event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;

    setsupplierName(typeof value === 'string' ? value.split(',') : value);
  }, []);

  const handleChangeAddress = useCallback((event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;

    setAddress(typeof value === 'string' ? value.split(',') : value);
  }, []);

  const handleFilterSupplierName = useCallback(() => {
    updateFilters({ supplierName });
  }, [updateFilters, supplierName]);

  const handleFilterAddress = useCallback(() => {
    updateFilters({ address });
  }, [address, updateFilters]);

  const renderMenuActions = () => (
    <CustomPopover
      open={menuActions.open}
      anchorEl={menuActions.anchorEl}
      onClose={menuActions.onClose}
      slotProps={{ arrow: { placement: 'right-top' } }}
    >
      <MenuList>
        <MenuItem onClick={() => menuActions.onClose()}>
          <Iconify icon="solar:printer-minimalistic-bold" />
          Print
        </MenuItem>

        <MenuItem onClick={() => menuActions.onClose()}>
          <Iconify icon="solar:import-bold" />
          Import
        </MenuItem>

        <MenuItem onClick={() => menuActions.onClose()}>
          <Iconify icon="solar:export-bold" />
          Export
        </MenuItem>
      </MenuList>
    </CustomPopover>
  );

  return (
    <>
      <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 200 } }}>
        <InputLabel htmlFor="filter-name-select">Supplier Name</InputLabel>
        <Select
          multiple
          value={supplierName}
          onChange={handleChangeSupplierName}
          onClose={handleFilterSupplierName}
          input={<OutlinedInput label="Supplier Name" />}
          renderValue={(selected) => selected.map((value) => value).join(', ')}
          inputProps={{ id: 'filter-name-select' }}
          sx={{ textTransform: 'capitalize' }}
        >
          {options.supplierName.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              <Checkbox
                disableRipple
                size="small"
                checked={supplierName.includes(option.value)}
                slotProps={{
                  input: {
                    id: `${option.value}-checkbox`,
                    'aria-label': `${option.label} checkbox`,
                  },
                }}
              />
              {option.label}
            </MenuItem>
          ))}
          <MenuItem
            onClick={handleFilterSupplierName}
            sx={[
              (theme) => ({
                justifyContent: 'center',
                fontWeight: theme.typography.button,
                bgcolor: varAlpha(theme.vars.palette.grey['500Channel'], 0.08),
                border: `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.16)}`,
              }),
            ]}
          >
            Apply
          </MenuItem>
        </Select>
      </FormControl>

      <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 200 } }}>
        <InputLabel htmlFor="filter-address-select">Address</InputLabel>
        <Select
          multiple
          value={address}
          onChange={handleChangeAddress}
          onClose={handleFilterAddress}
          input={<OutlinedInput label="Address" />}
          renderValue={(selected) => selected.map((value) => value).join(', ')}
          inputProps={{ id: 'filter-address-select' }}
          sx={{ textTransform: 'capitalize' }}
        >
          {options.address.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              <Checkbox
                disableRipple
                size="small"
                checked={address.includes(option.value)}
                slotProps={{
                  input: {
                    id: `${option.value}-checkbox`,
                    'aria-label': `${option.label} checkbox`,
                  },
                }}
              />
              {option.label}
            </MenuItem>
          ))}

          <MenuItem
            disableGutters
            disableTouchRipple
            onClick={handleFilterAddress}
            sx={[
              (theme) => ({
                justifyContent: 'center',
                fontWeight: theme.typography.button,
                bgcolor: varAlpha(theme.vars.palette.grey['500Channel'], 0.08),
                border: `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.16)}`,
              }),
            ]}
          >
            Apply
          </MenuItem>
        </Select>
      </FormControl>

      {renderMenuActions()}
    </>
  );
}
