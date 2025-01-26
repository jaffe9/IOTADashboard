import { useEffect, useRef, FC, useState, useCallback } from 'react';
import ApexCharts, { ApexOptions } from 'apexcharts';
import { KTIcon } from '../../../helpers';
import { Dropdown1 } from '../../content/dropdown/Dropdown1';
import { getCSS, getCSSVariableValue } from '../../../assets/ts/_utils';
import { useThemeMode } from '../../layout/theme-mode/ThemeModeProvider';
import { apiHelper } from '../../../../apiFactory/apiHelper';
import dayjs from 'dayjs'; // Import dayjs for date manipulation

type Props = {
  className: string;
};

const ChartsWidget1: FC<Props> = ({ className }) => {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const { mode } = useThemeMode();

  // State variables
  const [categories, setCategories] = useState<string[]>([]);
  const [pendingInvoices, setPendingInvoices] = useState<number[]>([]);
  const [paidInvoices, setPaidInvoices] = useState<number[]>([]);

  const fetchInvoiceData = useCallback(async () => {
    try {
      const today = dayjs(); // Current date
      const startDate = today.subtract(6, 'months').startOf('month'); // Start of 6 months ago
      const months = Array.from({ length: 6 }, (_, i) =>
        startDate.add(i, 'month').format('MMM YYYY')
      ); // Generate categories for last 6 months
      setCategories(months);

      // Fetch pending and paid invoices
      const [pendingResponse, paidResponse] = await Promise.all([
        apiHelper.getPendingInvoices(),
        apiHelper.getPaidInvoices(),
      ]);

      const pendingData = pendingResponse?.data
        ? groupInvoicesByMonth(pendingResponse.data, startDate)
        : Array(6).fill(0);

      const paidData = paidResponse?.data
        ? groupInvoicesByMonth(paidResponse.data, startDate)
        : Array(6).fill(0);

      setPendingInvoices(pendingData);
      setPaidInvoices(paidData);
    } catch (error) {
      console.error('Error fetching invoice data:', error);
    }
  }, []);

  const groupInvoicesByMonth = (data: any[], startDate: dayjs.Dayjs): number[] => {
    const grouped = Array(6).fill(0); // Initialize a 6-element array with zeros
    data.forEach((invoice) => {
      const match = invoice.internal_invoice_no?.match(/_(\d{2})_(\d{4})$/);
      if (match) {
        const [_, month, year] = match;
        const invoiceDate = dayjs(`${year}-${month}-01`);
        const monthIndex = invoiceDate.diff(startDate, 'month'); // Month offset from start date
        if (monthIndex >= 0 && monthIndex < 6) {
          grouped[monthIndex] += invoice.invoice_value; // Sum invoice value into the correct month
        }
      }
    });
    return grouped;
  };

  const refreshChart = useCallback(() => {
    if (!chartRef.current) {
      return;
    }
    const height = parseInt(getCSS(chartRef.current, 'height'));
    const chart = new ApexCharts(chartRef.current, getChartOptions(height));
    chart.render();
    return chart;
  }, [categories, pendingInvoices, paidInvoices]);

  useEffect(() => {
    fetchInvoiceData(); // Fetch data once on component mount
  }, [fetchInvoiceData]);

  useEffect(() => {
    const chart = refreshChart();
    return () => {
      if (chart) {
        chart.destroy();
      }
    };
  }, [refreshChart]);

  function getChartOptions(height: number): ApexOptions {
    const labelColor = getCSSVariableValue('--bs-gray-500');
    const borderColor = getCSSVariableValue('--bs-gray-200');
    const baseColor = getCSSVariableValue('--bs-primary');
    const secondaryColor = getCSSVariableValue('--bs-gray-300');

    return {
      series: [
        {
          name: 'Pending',
          data: pendingInvoices,
        },
        {
          name: 'Paid',
          data: paidInvoices,
        },
      ],
      chart: {
        fontFamily: 'inherit',
        type: 'bar',
        height: height,
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '30%',
          borderRadius: 5,
        },
      },
      legend:{
        show : false,
      },
      dataLabels:{
       enabled : false,
      },
      xaxis: {
        categories: categories, // Updated categories
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        labels: {
          style: {
            colors: labelColor,
            fontSize: '12px',
          },
        },
      },
      tooltip: {
        y: {
          formatter: (val) => `SAR ${val}`,
        },
      },
      colors: [baseColor, secondaryColor],
    };
  }

  return (
    <div className={`card ${className}`}>
      <div className="card-header border-0 pt-5">
        <h3 className="card-title align-items-start flex-column">
          <span className="card-label fw-bold fs-3 mb-1">Pending Vs Paid</span>
          <span className="text-muted fw-semibold fs-7">For the last 6 months</span>
        </h3>
        <div className="card-toolbar">
          <KTIcon iconName="category" className="fs-2" />
          <Dropdown1 />
        </div>
      </div>
      <div className="card-body">
        <div ref={chartRef} id="kt_charts_widget_1_chart" style={{ height: '350px' }} />
      </div>
    </div>
  );
};

export { ChartsWidget1 };
