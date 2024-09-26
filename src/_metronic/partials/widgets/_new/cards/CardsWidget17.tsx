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
    <div className={`card card-flush ${className}`}>
      <div className='card-header pt-5'>
        <div className='card-title d-flex flex-column'>
          <div className='d-flex align-items-center'>
            <span className='fs-4 fw-semibold text-gray-500 me-1 align-self-start'>$</span>
            <span id = "billingTotalValueTag" className='fs-2hx fw-bold text-gray-900 me-2 lh-1 ls-n2'></span>
            <span className='badge badge-light-success fs-base'>
              <KTIcon iconName='arrow-up' className='fs-5 text-success ms-n1' />2.2%</span>
          </div>
          <span className='text-gray-500 pt-1 fw-semibold fs-6'>Projects Earnings in April</span>
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
            <div id = 'clientName1' className='text-gray-500 flex-grow-1 me-4'></div>
            <span className='fs-4 fw-semibold text-gray-500 me-1 align-self-start'>$</span>
            <div id = 'client1Value' className='fw-bolder text-gray-700 text-xxl-end'>$7,660</div>
          </div>
          <div className='d-flex fw-semibold align-items-center my-3'>
            <div className='bullet w-8px h-3px rounded-2 bg-primary me-3'></div>
            <div id = 'clientName2' className='text-gray-500 flex-grow-1 me-4'></div>
            <span className='fs-4 fw-semibold text-gray-500 me-1 align-self-start'>$</span>
            <div id = 'client2Value' className='fw-bolder text-gray-700 text-xxl-end'>$2,820</div>
          </div>
          <div className='d-flex fw-semibold align-items-center'>
            <div
              className='bullet w-8px h-3px rounded-2 me-3'
              style={{backgroundColor: '#E4E6EF'}}
            ></div>
            <div className='text-gray-500 flex-grow-1 me-4'>Others</div>
            <div className=' fw-bolder text-gray-700 text-xxl-end'>$45,257</div>
          </div>
        </div>
      </div>
    </div>
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
  let billingTotalValue = document.getElementById('billingTotalValueTag')
  let clientNameValue1 = document.getElementById('clientName1')
  
  let clientNameValue2 = document.getElementById('clientName2')
  
  let client1ValueTag = document.getElementById('client1Value')
  
  let client2ValueTag = document.getElementById('client2Value')
  
  let billingTotal = apiHelper.getBillingTotalValue().then((response:any) => 
    {
      var txtSum = null;
      if(!billingTotalValue){ return }
      var sum = 0.0;
      var client1Value = 0.0;
      var client2Value = 0.0;
      for(let i = 0; i < response.data.length; i++)
        {
          if(response.data[i].client_id == 1)
            {
              sum = sum + response.data[i].billing_value / 11
              client1Value = client1Value + response.data[i].billing_value / 11
            }
          else
          {
            sum = sum + response.data[i].billing_value / 12
            client2Value = client2Value + response.data[i].billing_value / 11
          }
          txtSum = sum.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})
        }
      billingTotalValue.innerHTML = String(txtSum);
      if(!clientNameValue1){ return }
      clientNameValue1.innerHTML = "ANB";
      if(!clientNameValue2){ return }
      clientNameValue2.innerHTML = "RB";
      if(!client1ValueTag){ return }
      client1ValueTag.innerHTML = String(client1Value.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2}));
      if(!client2ValueTag){ return }
      client2ValueTag.innerHTML = String(client2Value.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2}));

      var topClient = null

    });
  }