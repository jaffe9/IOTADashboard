/* eslint-disable @typescript-eslint/ban-ts-comment */
//Total Value Widget
import {FC, useEffect, useRef} from 'react'
import {KTIcon} from '../../../../helpers'
import {getCSSVariableValue} from '../../../../assets/ts/_utils'
import {useThemeMode} from '../../../layout/theme-mode/ThemeModeProvider'
import {apiHelper} from '../../../../../apiFactory/apiHelper'
type Props = {
  className: string
  chartSize?: number
  chartLine?: number
  chartRotate?: number
}

const CardsWidget17: FC<Props> = ({
  className,
  chartSize = 70,
  chartLine = 11,
  chartRotate = 145,
}) => {
  
  const chartRef = useRef<HTMLDivElement | null>(null)
  const {mode} = useThemeMode()
  useEffect(() => {
    refreshChart()
    setValues()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode])

  const refreshChart = () => {
    if (!chartRef.current) {
      return
    }

    setTimeout(() => {
      initChart(chartSize, chartLine, chartRotate)
    }, 10)
  }
  return (
   <a href='/getInvoiceDetails'
   > <div className={`card card-flush ${className}`}>
      <div className='card-header pt-5'>
        <div className='card-title d-flex flex-column'>
          <div className='d-flex align-items-center'>
            <span className='fs-4 fw-semibold text-gray-500 me-1 align-self-start'>SAR</span>
            <span id = 'unpaidTotalValueTag' className='fs-2hx fw-bold text-gray-900 me-2 lh-1 ls-n2'></span>
            <span className='badge badge-light-success fs-base'>
              <KTIcon iconName='arrow-up' className='fs-5 text-success ms-n1' />2.2%</span>
          </div>
          <span className='text-gray-500 pt-1 fw-semibold fs-6'>Pendinng Invoices</span>
        </div>
      </div>

      <div className='card-body pt-2 pb-4 d-flex flex-wrap align-items-center'>
        <div className='d-flex flex-center me-5 pt-2'>
          <div
            id='kt_card_widget_17_chart'
            ref={chartRef}
            style={{minWidth: chartSize + 'px', minHeight: chartSize + 'px'}}
            data-kt-size={chartSize}
            data-kt-line={chartLine}
          ></div>
        </div>

        <div className='d-flex flex-column content-justify-center flex-row-fluid'>
          <div className='d-flex fw-semibold align-items-center'>
            <div className='bullet w-8px h-3px rounded-2 bg-success me-3'></div>
            <div id = 'clientName1' className='text-gray-500 flex-grow-1 me-4'>ANB</div>
            <span className='fs-4 fw-semibold text-gray-500 me-1 align-self-start'>SAR</span>
            <div id = 'unpaidClient1Value' className='fw-bolder text-gray-700 text-xxl-end'></div>
          </div>

          <div className='d-flex fw-semibold align-items-center my-3'>
            <div className='bullet w-8px h-3px rounded-2 bg-primary me-3'></div>
            <div id = 'clientName2' className='text-gray-500 flex-grow-1 me-4'>RB</div>
            <span className='fs-4 fw-semibold text-gray-500 me-1 align-self-start'>SAR</span>
            <div id = 'unpaidClient2Value' className='fw-bolder text-gray-700 text-xxl-end'></div>
          </div>

          <div className='d-flex fw-semibold align-items-center'>
            <div className='bullet w-8px h-3px rounded-2 bg-danger me-3'></div>
            <div id = 'clientName4' className='text-gray-500 flex-grow-1 me-4'>ARB</div>
            <span className='fs-4 fw-semibold text-gray-500 me-1 align-self-start'>SAR</span>
            <div id = 'unpaidClient4Value' className='fw-bolder text-gray-700 text-xxl-end'></div>
          </div>

          <div className='d-flex fw-semibold align-items-center'>
            <div className='bullet w-8px h-3px rounded-2 bg-warning me-3'></div>
            <div id = 'clientName5' className='text-gray-500 flex-grow-1 me-4'>AMEX</div>
            <span className='fs-4 fw-semibold text-gray-500 me-1 align-self-start'>SAR</span>
            <div id = 'unpaidClient5Value' className='fw-bolder text-gray-700 text-xxl-end'></div>
          </div>
          
          <div className='d-flex fw-semibold align-items-center'>
            <div
              className='bullet w-8px h-3px rounded-2 me-3'
              style={{backgroundColor: '#E4E6EF', visibility:"hidden"}}  // hide the visibility
            ></div>
            <div className='text-gray-500 flex-grow-1 me-4'></div>
            <div className=' fw-bolder text-gray-700 text-xxl-end'></div>
          </div>
        </div>
      </div>
    </div>
  </a>
  )
}

const initChart = function (
  chartSize: number = 150,
  chartLine: number = 50,
  chartRotate: number = 200
) {
  const el = document.getElementById('kt_card_widget_17_chart')
  if (!el) {
    return
  }
  el.innerHTML = ''

  const options = {
    size: chartSize,
    lineWidth: chartLine,
    rotate: chartRotate,
    //percent:  el.getAttribute('data-kt-percent') ,
  }
  // *********************************************** Changes for API value begins here ***********************************************
  const canvas = document.createElement('canvas')
  const span = document.createElement('span')
  
  // *********************************************** Changes for API value ends here ***********************************************

  interface User {
    id: bigint,
    startDate: string
};

  //@ts-ignore
  if (typeof G_vmlCanvasManager !== 'undefined') {
    //@ts-ignore
    G_vmlCanvasManager.initElement(canvas)
  }

  const ctx = canvas.getContext('2d')
  canvas.width = canvas.height = options.size

  el.appendChild(span)
  el.appendChild(canvas)


  ctx?.translate(options.size / 2, options.size / 2) // change center
  ctx?.rotate((-1 / 2 + options.rotate / 180) * Math.PI) // rotate -90 deg

  //imd = ctx.getImageData(0, 0, 240, 240);
  const radius = (options.size - options.lineWidth) / 2

  const drawCircle = function (color: string, lineWidth: number, percent: number) {
    percent = Math.min(Math.max(0, percent || 1), 1)
    if (!ctx) {
      return
    }

    ctx.beginPath()
    ctx.arc(0, 0, radius, 0, Math.PI * 2 * percent, false)
    ctx.strokeStyle = color
    ctx.lineCap = 'round' // butt, round or square
    ctx.lineWidth = lineWidth
    ctx.stroke()
  }

  // Init 2
  drawCircle('#E4E6EF', options.lineWidth, 100 / 100)
  drawCircle(getCSSVariableValue('--bs-primary'), options.lineWidth, 100 / 150)
  drawCircle(getCSSVariableValue('--bs-success'), options.lineWidth, 100 / 250)
}

export {CardsWidget17}
function setValues()
  {
  let invoiceTotalValue = document.getElementById('invoiceTotalValueTag')
  let clientNameValue1 = document.getElementById('clientName1')
  
  let clientNameValue2 = document.getElementById('clientName2')

  let clientNameValue4 = document.getElementById('clientName4')

  let clientNameValue5 = document.getElementById('clientName5')
  
  let client1ValueTag = document.getElementById('client1Value')
  
  let client2ValueTag = document.getElementById('client2Value')

  let client4ValueTag = document.getElementById('client4Value')

  let client5ValueTag = document.getElementById('client5Value')

  let unpaidTotalValueTag = document.getElementById('unpaidTotalValueTag'); // New element for unpaid total
  let unpaidClient1ValueTag = document.getElementById('unpaidClient1Value'); // New element for unpaid client1
  let unpaidClient2ValueTag = document.getElementById('unpaidClient2Value');

  let unpaidClient4ValueTag = document.getElementById('unpaidClient4Value');
  let unpaidClient5ValueTag = document.getElementById('unpaidClient5Value');
  
  apiHelper.getInvoiceTotalValue().then((response: any) => {
    let totalInvoiceValue = 0.0;
    let client1TotalValue = 0.0;
    let client2TotalValue = 0.0;
    let client4TotalValue = 0.0;
    let client5TotalValue = 0.0;

    let unpaidTotalValue = 0.0;
    let unpaidClient1Value = 0.0;
    let unpaidClient2Value = 0.0;
    let unpaidClient4Value = 0.0;
    let unpaidClient5Value = 0.0;

    // Loop through response data
    response.data.forEach((item: any) => {
      const billingValue = parseFloat(item.invoice_value) || 0;
      const isPaid = item.invoice_paid_status;

      // Calculate total values
      totalInvoiceValue += billingValue;
      if (item.client_id === 1) {
        client1TotalValue += billingValue;
        if (!isPaid) unpaidClient1Value += billingValue;
      } else if (item.client_id === 2) {
        client2TotalValue += billingValue;
        if (!isPaid) unpaidClient2Value += billingValue;
      } else if (item.client_id === 4) {
        client4TotalValue += billingValue;
        if (!isPaid) unpaidClient4Value += billingValue;
      } else if (item.client_id === 5) {
        client5TotalValue += billingValue;
        if (!isPaid) unpaidClient5Value += billingValue;
      }

      if (!isPaid) unpaidTotalValue += billingValue;
    });

    // Format values to 2 decimal places
    const formatValue = (value: number) =>
      value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    // Update DOinvoicents
    if (invoiceTotalValue) invoiceTotalValue.innerHTML = formatValue(totalInvoiceValue);
    if (clientNameValue1) clientNameValue1.innerHTML = "ANB";
    if (client1ValueTag) client1ValueTag.innerHTML = formatValue(client1TotalValue);

    if (clientNameValue2) clientNameValue2.innerHTML = "RB";
    if (client2ValueTag) client2ValueTag.innerHTML = formatValue(client2TotalValue);

    if (clientNameValue4) clientNameValue4.innerHTML = "ARB";
    if (client4ValueTag) client4ValueTag.innerHTML = formatValue(client4TotalValue);

    if (clientNameValue5) clientNameValue5.innerHTML = "AMEX";
    if (client5ValueTag) client5ValueTag.innerHTML = formatValue(client5TotalValue);

    // Update unpaid invoice values
    if (unpaidTotalValueTag) unpaidTotalValueTag.innerHTML = formatValue(unpaidTotalValue);
    if (clientNameValue1) clientNameValue1.innerHTML = "ANB";
    if (unpaidClient1ValueTag) unpaidClient1ValueTag.innerHTML = formatValue(unpaidClient1Value);

    if (clientNameValue2) clientNameValue2.innerHTML = "RB";
    if (unpaidClient2ValueTag) unpaidClient2ValueTag.innerHTML = formatValue(unpaidClient2Value);
    
    if (clientNameValue4) clientNameValue4.innerHTML = "ARB";
    if (unpaidClient4ValueTag) unpaidClient4ValueTag.innerHTML = formatValue(unpaidClient4Value);
    
    if (clientNameValue5) clientNameValue5.innerHTML = "AMEX";
    if (unpaidClient5ValueTag) unpaidClient5ValueTag.innerHTML = formatValue(unpaidClient5Value);

  });
  }