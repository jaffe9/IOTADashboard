import React, { useEffect, useState } from 'react';
import ApexCharts from 'apexcharts';
import { getPaidInvoices } from '../../../../../apiFactory/apiHelper';

type Props = {
  className?: string;
};

type PaidInvoice = {
  client_id: { client_short_name: string };
  invoice_paid_amount: number;
  invoice_paid_date: string | null;
};

const COLORS = [
  '#3699FF', // Primary
  '#FFA800', // Orange
  '#1BC5BD', // Green
  '#8950FC', // Violet
  '#F64E60', // Red
  '#FFCE56', // Yellow
  '#50CD89', // Teal
  '#0BB783', // Aqua
  '#663259', // Deep Purple
];

const CardsWidget7 = ({ className = '' }: Props) => {
  const [chartReady, setChartReady] = useState(false);
  const [noData, setNoData] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const invoices: PaidInvoice[] = await getPaidInvoices();
        const now = new Date();
        const startDate = new Date(now.getFullYear(), now.getMonth() - 2, 1); // 3 months ago

        const totals: Record<string, number> = {};

        invoices.forEach((inv) => {
          const paidDate = inv.invoice_paid_date ? new Date(inv.invoice_paid_date) : null;
          if (!paidDate || paidDate < startDate) return;

          const client = inv.client_id?.client_short_name || 'Unknown';
          const amount = inv.invoice_paid_amount || 0;

          totals[client] = (totals[client] || 0) + amount;
        });

        const clients = Object.keys(totals);
        const data = clients.map((c) => totals[c]);

        if (clients.length === 0) {
          setNoData(true);
          return;
        }

        const options: ApexCharts.ApexOptions = {
          series: data,
          labels: clients,
          colors: COLORS,
          fill: {
            colors: COLORS,
          },
          chart: {
            type: 'donut',
            height: 190,  // modify the chart height here 
          },
          stroke: {
            show: true,
            width: 2,
            colors: ['var(--color-background)'],
          },
          tooltip: {
            y: {
              formatter: (value: number) => {
                return `SAR ${value.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`;
              },
            },
          },
          dataLabels: {
            enabled: true,  // this will show the percentage of particular client 
            // formatter: (val: number) => {
            //   return val.toLocaleString('en-US', {
            //     minimumFractionDigits: 2,
            //     maximumFractionDigits: 2,
            //   });
            // },
          },
          plotOptions: {
            pie: {
              expandOnClick: false,
            },
          },
          legend: {
            offsetY: -5,
            offsetX: -10,
            fontSize: '14px',
            fontWeight: 500,
            labels: {
              colors: 'var(--color-secondary-foreground)',
              useSeriesColors: false,
            },
            markers: {
              width: 10,
              height: 10,
            },
          },
          responsive: [
            {
              breakpoint: 480,
              options: {
                chart: {
                  width: 200,
                },
                legend: {
                  position: 'bottom',
                },
              },
            },
          ],
        };

        const chartElement = document.querySelector('#kt_charts_widget_7_pie_chart');
        if (!chartElement) return;

        const chart = new ApexCharts(chartElement, options);
        chart.render();
        setChartReady(true);

        return () => {
          chart.destroy();
        };
      } catch (err) {
        console.error('Error loading pie chart data:', err);
        setNoData(true);
      }
    };

    fetchData();
  }, []);

  return (
    <div className={`card card-flush ${className}`}>
      <div className='card-body pt-4 px-4'>
        <h6 className='fw-bold text-gray-800 mb-2'>Paid Amount by Client (Last 3 Months)</h6>
        {noData ? (
          <div className='text-muted fs-7'>No data available for the last 3 months.</div>
        ) : (
          <div id='kt_charts_widget_7_pie_chart' className=''></div>
        )}
      </div>
    </div>
  );
};

export { CardsWidget7 };
