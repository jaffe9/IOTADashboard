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
  const [PaidInvoices, setPaidInvoices] = useState<number[]>([]);

  // Memoized function to prevent recreation on each render
  const fetchInvoiceData = useCallback(async () => {
    try {
      const today = dayjs(); // Get today's date
      const startDate = today.subtract(6, 'months').startOf('month'); // Start of 6 months ago
      const endDate = today.endOf('month'); // End of the current month
      const months = Array.from({ length: 6 }, (_, i) =>
        startDate.add(i, 'month').format('MMM')
      ); // Generate last 6 months
      setCategories(months);

      // Fetch pending invoices and group by month
      const pendingResponse = await apiHelper.getPendingInvoices();
      const pendingData = pendingResponse?.data
        ? groupInvoicesByMonth(pendingResponse.data, startDate, endDate)
        : Array(6).fill(0);

      // Fetch paid invoices and group by month
      const paidResponse = await apiHelper.getPaidInvoices();
      const paidData = paidResponse?.data
        ? groupInvoicesByMonth(paidResponse.data, startDate, endDate)
        : Array(6).fill(0);

      // Update series data
      setPendingInvoices(pendingData);
      setPaidInvoices(paidData);
    } catch (error) {
      console.error('Error fetching invoice data:', error);
    }
  }, []);

  const groupInvoicesByMonth = (data: any[], startDate: dayjs.Dayjs, endDate: dayjs.Dayjs): number[] => {
    const grouped = Array(6).fill(0); // Initialize an array of 6 months with 0 values
    data.forEach((invoice) => {
      const invoiceDate = dayjs(invoice.invoice_date); // Parse invoice date
      if (invoiceDate.isAfter(startDate) && invoiceDate.isBefore(dayjs())) {
        const monthIndex = invoiceDate.diff(startDate, 'month'); // Calculate month index
        if (monthIndex >= 0 && monthIndex < 6) {
          grouped[monthIndex] += invoice.invoice_value; // Sum up invoice values
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
  }, [categories, pendingInvoices, PaidInvoices]);

  useEffect(() => {
    fetchInvoiceData(); // Fetch data only once
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
          data: PaidInvoices,
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
      legend: {
        show: true,
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent'],
      },
      xaxis: {
        categories: categories, // Dynamic categories
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
      yaxis: {
        labels: {
          style: {
            colors: labelColor,
            fontSize: '12px',
          },
        },
      },
      fill: {
        opacity: 1,
      },
      states: {
        normal: {
          filter: {
            type: 'none',
            value: 0,
          },
        },
        hover: {
          filter: {
            type: 'none',
            value: 0,
          },
        },
        active: {
          allowMultipleDataPointsSelection: false,
          filter: {
            type: 'none',
            value: 0,
          },
        },
      },
      tooltip: {
        style: {
          fontSize: '12px',
        },
        y: {
          formatter: function (val) {
            return 'SAR ' + val;
          },
        },
      },
      colors: [baseColor, secondaryColor],
      grid: {
        borderColor: borderColor,
        strokeDashArray: 4,
        yaxis: {
          lines: {
            show: true,
          },
        },
      },
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
          <button
            type="button"
            className="btn btn-sm btn-icon btn-color-primary btn-active-light-primary"
            data-kt-menu-trigger="click"
            data-kt-menu-placement="bottom-end"
            data-kt-menu-flip="top-end"
          >
            <KTIcon iconName="category" className="fs-2" />
          </button>
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
