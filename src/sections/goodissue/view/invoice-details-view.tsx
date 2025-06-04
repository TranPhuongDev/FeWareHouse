'use client';

import { useState, useEffect } from 'react';
import type { IInvoice } from 'src/types/invoice';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { InvoiceDetails } from '../invoice-details';
import { ExportDetailItem } from 'src/types/exportware';
import axios from 'axios';
import io from 'socket.io-client';
// ----------------------------------------------------------------------

type Props = {
  currentExport?: ExportDetailItem;
};

export function InvoiceDetailsView({ currentExport: initialExport }: Props) {
  const [exportData, setExportData] = useState<ExportDetailItem | undefined>(initialExport);

  useEffect(() => {
    setExportData(initialExport);
  }, [initialExport]);

  useEffect(() => {
    if (!exportData?.exportID) {
      return () => {}; // Return an empty cleanup function if no exportID
    }

    const socket = io('http://localhost:8080'); // Adjust if your socket server URL is different

    const handleDataChange = (data: any) => {
      // console.log('Socket event "mysql_data_changed" received:', data);
      // You might want to check if data.updatedId === exportData.exportID if the event provides it
      // For now, we'll re-fetch based on the generic event, similar to SupplierListView

      const fetchUpdatedExportData = async () => {
        try {
          const response = await axios.get<ExportDetailItem>(
            `http://localhost:8080/api/exportwarehouse/detail/${exportData.exportID}`
          );
          setExportData(response.data);
          console.log(`Export data for ID ${exportData.exportID} re-fetched and updated.`);
        } catch (error) {
          console.error('Error re-fetching export data after socket event:', error);
        }
      };

      // Optional: Add a small delay if backend changes might take time to propagate
      setTimeout(fetchUpdatedExportData, 300);
    };

    socket.on('mysql_data_changed', handleDataChange);

    return () => {
      socket.off('mysql_data_changed', handleDataChange);
      socket.disconnect();
    };
  }, [exportData?.exportID]); // Dependency on exportData.exportID ensures effect re-runs if ID changes

  if (!exportData) {
    return <div>Loading invoice details...</div>; // Or any other loading state
  }

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={`Invoice: ${exportData.exportID}`}
        backHref={paths.dashboard.invoice.root}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Invoice', href: paths.dashboard.goodissue.root },
          { name: exportData.exportID.toString() },
        ]}
        sx={{ mb: 3 }}
      />
      <InvoiceDetails currentExport={exportData} />
    </DashboardContent>
  );
}
