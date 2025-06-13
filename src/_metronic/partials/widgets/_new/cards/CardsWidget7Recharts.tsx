import React, { useEffect, useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts'
import { getPaidInvoices } from '../../../../../apiFactory/apiHelper'

type Props = {
  className?: string
}

type PaidInvoice = {
  client_id: { client_short_name: string }
  invoice_paid_amount: number
  invoice_paid_date: string | null // ISO format date
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#00C49F', '#FFBB28']

const CardsWidget7Backup = ({ className = '' }: Props) => {
  const [chartData, setChartData] = useState<any[]>([])
  const [clients, setClients] = useState<string[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const invoices: PaidInvoice[] = await getPaidInvoices()
        const now = new Date()
        const recentMonths = Array.from({ length: 3 }, (_, i) => {
          const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
          return {
            key: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`, // e.g., "2025-03"
            label: `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`, // "Mar 2025"
          }
        }).reverse()

        const monthMap: Record<string, any> = {}
        const clientSet = new Set<string>()

        // Initialize empty months
        recentMonths.forEach((m) => {
          monthMap[m.key] = { month: m.label }
        })

        invoices.forEach((inv) => {
          const paidDate = inv.invoice_paid_date ? new Date(inv.invoice_paid_date) : null
          if (!paidDate) return

          const monthKey = `${paidDate.getFullYear()}-${String(paidDate.getMonth() + 1).padStart(2, '0')}`
          const client = inv.client_id?.client_short_name || 'Unknown'
          const amount = inv.invoice_paid_amount || 0

          if (monthMap[monthKey]) {
            monthMap[monthKey][client] = (monthMap[monthKey][client] || 0) + amount
            clientSet.add(client)
          }
        })

        setClients(Array.from(clientSet))
        setChartData(Object.values(monthMap))
      } catch (err) {
        console.error('Error loading monthly client data:', err)
      }
    }

    fetchData()
  }, [])

  return (
    <div className={`card card-flush ${className}`}>
      <div className='card-body pt-4 px-4'>
        <h6 className='fw-bold text-gray-800 mb-2'>Monthly Paid Amount by Client</h6>
        {chartData.length === 0 ? (
          <div className='text-muted fs-7'>No data available for the last 3 months.</div>
        ) : (
          <ResponsiveContainer width='100%' height={145}>
            <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip
                formatter={(value: number) => `SAR ${value.toLocaleString()}`}
                labelStyle={{ fontSize: 12 }}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              {clients.map((client, index) => (
                <Bar
                  key={client}
                  dataKey={client}
                  stackId="a"
                  fill={COLORS[index % COLORS.length]}
                  name={client}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}

export { CardsWidget7Backup }
