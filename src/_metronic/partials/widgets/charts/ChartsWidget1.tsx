
import {useEffect, useRef, FC} from 'react'
import ApexCharts, {ApexOptions} from 'apexcharts'
import {KTIcon} from '../../../helpers'
import {Dropdown1} from '../../content/dropdown/Dropdown1'
import {getCSS, getCSSVariableValue} from '../../../assets/ts/_utils'
import {useThemeMode} from '../../layout/theme-mode/ThemeModeProvider'
import { apiHelper } from '../../../../apiFactory/apiHelper'

  let val1 = 10
  let val2 = 10
  type Props = 
  {
    className: string
  }

  const getSalaryData = async () : Promise<number> => 
  {
    var sum = 0
    await apiHelper.getAllSalaries().then(function (apiData)
    {
      for(var i = 0; i < apiData?.data.length; i++)
        {
          sum = sum + apiData!.data[i].total_net_salary
        }
        val1 = sum;
        return sum
    })
    val1 = sum
    return sum
  }

  const getBillingData = async () : Promise<number> => 
    {
      var sum = 0
      await apiHelper.getBillingTotalValue().then(function (apiData)
      {
        for(var i = 0; i < apiData?.data.length; i++)
          {
            sum = sum + apiData!.data[i].billing_value / apiData!.data[i].billing_months
          }
          val2 = sum;
          return sum
      })
      val2 = sum
      return sum
    }

  const ChartsWidget1: FC<Props> = ({className}) => 
  {
    const chartRef = useRef<HTMLDivElement | null>(null)
    const {mode} = useThemeMode()

    const refreshChart = () => 
      {
        getSalaryData()
        getBillingData()
        if (!chartRef.current) 
          {
            return
          }
        const height = parseInt(getCSS(chartRef.current, 'height'))
        const chart = new ApexCharts(chartRef.current, getChartOptions(height))
        if (chart) 
          {
            getSalaryData()
            getBillingData()
            chart.render()
          }
        return chart
      }
      useEffect(() => 
      {
      getSalaryData()
      getBillingData()
        const chart = refreshChart()    
        return () => 
          {
          if (chart) 
            {
              chart.destroy()
            }
          }
      }, [chartRef, mode, refreshChart, getChartOptions])
    return (
      <div className={`card ${className}`}>
        {/* begin::Header */}
        <div className='card-header border-0 pt-5'>
          {/* begin::Title */}
          <h3 className='card-title align-items-start flex-column'>
            <span className='card-label fw-bold fs-3 mb-1'>Salary Vs Billing</span>

            <span className='text-muted fw-semibold fs-7'>Computed for the last 6 months</span>
          </h3>
          {/* end::Title */}

          {/* begin::Toolbar */}
          <div className='card-toolbar'>
            {/* begin::Menu */}
            <button
              type='button'
              className='btn btn-sm btn-icon btn-color-primary btn-active-light-primary'
              data-kt-menu-trigger='click'
              data-kt-menu-placement='bottom-end'
              data-kt-menu-flip='top-end'
            >
              <KTIcon iconName='category' className='fs-2' />
            </button>
            <Dropdown1 />
            {/* end::Menu */}
          </div>
          {/* end::Toolbar */}
        </div>
        {/* end::Header */}

        {/* begin::Body */}
        <div className='card-body'>
          {/* begin::Chart */}
          <div ref={chartRef} id='kt_charts_widget_1_chart' style={{height: '350px'}} />
          {/* end::Chart */}
        </div>
        {/* end::Body */}
      </div>
    )
  }
  
  function getChartOptions(height: number): ApexOptions 
  {
    const labelColor = getCSSVariableValue('--bs-gray-500')
    const borderColor = getCSSVariableValue('--bs-gray-200')
    const baseColor = getCSSVariableValue('--bs-primary')
    const secondaryColor = getCSSVariableValue('--bs-gray-300')
    return {
      series: [
        {
          name: 'Salary',
          data: [val1, val1, 57, 56, 61, 58],
        },
        {
          name: 'Billing',
          data: [val2, val2, 101, 98, 87, 105],
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
        show: false,
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
        categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
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
            return 'SAR ' + val
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
    }
  }
export {ChartsWidget1}