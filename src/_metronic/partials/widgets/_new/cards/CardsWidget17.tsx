import { FC, useEffect, useRef, useState } from 'react'
import { KTIcon } from '../../../../helpers'
import { getCSSVariableValue } from '../../../../assets/ts/_utils'
import { useThemeMode } from '../../../layout/theme-mode/ThemeModeProvider'
import { apiHelper } from '../../../../../apiFactory/apiHelper'
import clsx from 'clsx'

type Props = {
  classProtected?: string
  className?: string
  chartSize?: number
  chartLine?: number
  chartRotate?: number
}

const CardsWidget17: FC<Props> = ({
  className,
  classProtected,
  chartSize = 70,
  chartLine = 11,
  chartRotate = 145,
}) => {
  const chartRef = useRef<HTMLDivElement | null>(null)
  const { mode } = useThemeMode()
  const [showOtherClients, setShowOtherClients] = useState(false)

  const [unpaidTotals, setUnpaidTotals] = useState({
    total: 0,
    client1: 0,
    client2: 0,
    client3: 0,
    client4: 0,
    client5: 0,
  })

  const [showAmount, setShowAmount] = useState(false)
  const [showPasswordInput, setShowPasswordInput] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    fetchAndSetInvoiceData()
  }, [mode])

  const fetchAndSetInvoiceData = async () => {
    const response = await apiHelper.getInvoiceTotalValue()

    let totals = {
      total: 0,
      client1: 0,
      client2: 0,
      client3: 0,
      client4: 0,
      client5: 0,
    }

    response.invoiceValue.forEach((item: any) => {
      const value = parseFloat(item.invoice_value) || 0
      if (!item.invoice_paid_status) {
        switch (item.client_id) {
          case 1:
            totals.client1 += value
            break
          case 2:
            totals.client2 += value
            break
          case 3:
            totals.client3 += value
            break
          case 4:
            totals.client4 += value
            break
          case 5:
            totals.client5 += value
            break
        }
        totals.total += value
      }
    })

    setUnpaidTotals(totals)

    const chartData = [
      { color: '--bs-success', value: totals.client1 },
      { color: '--bs-primary', value: totals.client2 },
      { color: '--bs-danger', value: totals.client3 },
      { color: '--bs-info', value: totals.client4 },
      { color: '--bs-warning', value: totals.client5 },
    ].filter(d => d.value > 0)

    setTimeout(() => {
      initChart(chartSize, chartLine, chartRotate, chartData)
    }, 10)
  }

  const toggleShowOtherClients = () => {
    setShowOtherClients(prev => !prev)
  }

  const format = (val: number) =>
    val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  const correctPassword = 'iwtCard17'

  const handleRevealAmount = () => {
    if (showAmount) {
      // Manually hide and clear timeout if eye-slash is clicked
      if (timeoutId) clearTimeout(timeoutId)
      setShowAmount(false)
      return
    }

    setShowPasswordInput(true)
    setError('')
  }

  const handlePasswordSubmit = () => {
    if (password === correctPassword) {
      setShowAmount(true)
      setShowPasswordInput(false)
      setPassword('')
      setError('')

      const id = setTimeout(() => {
        setShowAmount(false)
      }, 30000)

      setTimeoutId(id)
    } else {
      setError('Incorrect password')
    }
  }

  return (
    <div className={`card card-flush ${className}`}>
      <div className='card-header pt-5'>
        <div className='card-title d-flex flex-column'>
          <div className='d-flex align-items-center'>
            <span className='fs-4 fw-semibold text-gray-500 me-1 align-self-start'>SAR</span>

            {showAmount ? (
              <a href='/getInvoiceDetails'>
                <span className='fs-2hx fw-bold text-gray-900 me-2 lh-1 ls-n2'>
                  {format(unpaidTotals.total)}
                </span>
              </a>
            ) : (
              <span className='fs-2hx fw-bold text-gray-900 me-2 lh-1 ls-n2'> ******* </span>
            )}

            <span
              className='cursor-pointer ms-2'
              onClick={handleRevealAmount}
              title={showAmount ? 'Hide amount' : 'Reveal with password'}
            >
              <KTIcon iconName={showAmount ? 'eye-slash' : 'eye'} className='fs-1 text-primary' />
            </span>
          </div>

          {showPasswordInput && (
            <div className='mt-2'>
              <input
                type='password'
                className='form-control form-control-sm w-200px d-inline-block me-2'
                placeholder='Enter password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button className='btn btn-sm btn-primary' onClick={handlePasswordSubmit}>
                Submit
              </button>
              {error && <div className='text-danger mt-1'>{error}</div>}
            </div>
          )}

          <span className='text-gray-500 pt-1 fw-semibold fs-6'>Pending Invoices</span>
        </div>
      </div>

      <div className='card-body pt-2 pb-4 d-flex flex-wrap align-items-center'>
        <div className='d-flex flex-center me-5 pt-2'>
          <div
            id='kt_card_widget_17_chart'
            ref={chartRef}
            style={{ minWidth: chartSize + 'px', minHeight: chartSize + 'px', cursor: 'pointer' }}
            data-kt-size={chartSize}
            data-kt-line={chartLine}
            onClick={toggleShowOtherClients}
          ></div>
        </div>

        <div className='d-flex flex-column content-justify-center flex-row-fluid'>
          {!showOtherClients ? (
            <>
              <ClientRow color="success" name="ANB"  value={unpaidTotals.client1} isHidden={!showAmount} />
              <ClientRow color="primary" name="RB" value={unpaidTotals.client2} isHidden={!showAmount}/>
              <ClientRow color="danger" name="SAB" value={unpaidTotals.client3} isHidden={!showAmount} />
            </>
          ) : (
            <>
              <ClientRow color="info" name="ARB" value={unpaidTotals.client4} isHidden={!showAmount}/>
              <ClientRow color="warning" name="AMEX" value={unpaidTotals.client5} isHidden={!showAmount} />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

const ClientRow = ({
  color,
  name,
  value,
  isHidden = false
}: {
  color: string
  name: string
  value: number
  isHidden? : boolean
}) => (
  <div className='d-flex fw-semibold align-items-center my-2'>
    <div className={`bullet w-8px h-3px rounded-2 bg-${color} me-3`}></div>
    <div className='text-gray-500 flex-grow-1 me-4'>{name}</div>
    <span className='fs-4 fw-semibold text-gray-500 me-1 align-self-start'>SAR</span>
    <div className='fw-bolder text-gray-700 text-xxl-end'>
       {isHidden
        ? '********'
        : value.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
    </div>
  </div>
)

const initChart = (
  chartSize: number,
  chartLine: number,
  chartRotate: number,
  data: { color: string; value: number }[]
) => {
  const el = document.getElementById('kt_card_widget_17_chart')
  if (!el) return

  el.innerHTML = ''
  const canvas = document.createElement('canvas')
  const span = document.createElement('span')
  const ctx = canvas.getContext('2d')
  canvas.width = canvas.height = chartSize
  el.appendChild(span)
  el.appendChild(canvas)

  if (!ctx) return

  ctx.translate(chartSize / 2, chartSize / 2)
  ctx.rotate((-1 / 2 + chartRotate / 180) * Math.PI)

  const radius = (chartSize - chartLine) / 2
  const totalValue = data.reduce((sum, d) => sum + d.value, 0)
  let startAngle = 0

  data.forEach(({ color, value }) => {
    const percent = value / totalValue
    const endAngle = startAngle + Math.PI * 2 * percent
    ctx.beginPath()
    ctx.arc(0, 0, radius, startAngle, endAngle)
    ctx.strokeStyle = getCSSVariableValue(color)
    ctx.lineCap = 'round'
    ctx.lineWidth = chartLine
    ctx.stroke()
    startAngle = endAngle
  })
}

export { CardsWidget17 }
