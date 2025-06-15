import React, { useEffect } from 'react'
import * as am5 from '@amcharts/amcharts5'
import * as am5xy from '@amcharts/amcharts5/xy'
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated'
import { getPaidInvoices } from '../../../../../apiFactory/apiHelper'
import { auto } from '@popperjs/core'

type Props = {
  className?: string
}

type PaidInvoice = {
  client_id: { client_short_name: string }
  invoice_paid_amount: number
  invoice_paid_date: string | null
}

export const CardsWidget7 = ({ className = '' }: Props) => {
  useEffect(() => {
    let root = am5.Root.new('amchartdiv')

    root.setThemes([am5themes_Animated.new(root)])

    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        paddingLeft: 0,
        wheelX: 'panX',
        wheelY: 'zoomX',
        layout: root.verticalLayout,
      })
    )

    const legend = chart.children.push(
      am5.Legend.new(root, {
        centerX: am5.p50,
        x: am5.p50,
      })
    )

    // Customize marker and label sizes
      legend.markers.template.setAll({
        width: 10,
        height: 10,
      })

      legend.labels.template.setAll({
        fontSize: 10
      })

      legend.itemContainers.template.setAll({
  paddingTop: 2,
  paddingBottom: 2,
  paddingLeft: 4,
  paddingRight: 4,
  marginBottom: 0,
  marginTop: 0
})

    const xRenderer = am5xy.AxisRendererX.new(root, {
      cellStartLocation: 0.1,
      cellEndLocation: 0.9,
    })
    xRenderer.labels.template.setAll({
    fontSize: 10, // reduce to 9 or 8 if needed below the x axis in chart 
   });

    const xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: 'month',
        renderer: xRenderer,
        tooltip: am5.Tooltip.new(root, {}),
      })
    )

    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {
          strokeOpacity: 0.1,
        }),
      })
    )

    const makeSeries = (name: string, field: string, data: any[]) => {
      const series = chart.series.push(
        am5xy.ColumnSeries.new(root, {
          name,
          xAxis,
          yAxis,
          valueYField: field,
          categoryXField: 'month',
          // Not stacking → side-by-side bars
        })
      )

      series.columns.template.setAll({
        tooltipText: `{name}, {categoryX}: {valueY}`,
        width: am5.percent(90),
        tooltipY: 0,
        strokeOpacity: 0,
      })

      series.bullets.push(() =>
        am5.Bullet.new(root, {
          locationY: 0,
          sprite: am5.Label.new(root, {
            text: '{valueY}',
            fill: root.interfaceColors.get('alternativeText'),
            centerY: 0,
            centerX: am5.p50,
            populateText: true,
          }),
        })
      )

      series.data.setAll(data)
      legend.data.push(series)
    }

    const fetchData = async () => {
      try {
        const invoices: PaidInvoice[] = await getPaidInvoices()
        const now = new Date()
        const recentMonths = Array.from({ length: 3 }, (_, i) => {
          const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
          return {
            key: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`,
            label: `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`,
          }
        }).reverse()

        const monthMap: Record<string, any> = {}
        const clientSet = new Set<string>()

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

        const data = Object.values(monthMap)
        const clients = Array.from(clientSet)

        xAxis.data.setAll(data)
        clients.forEach((client) => makeSeries(client, client, data))
        chart.appear(1000, 100)
      } catch (err) {
        console.error('Error loading chart data:', err)
      }
    }

    fetchData()

    return () => {
      root.dispose()
      // Remove amCharts logo
      root._logo?.dispose()
    }
  }, [])

  return (
    <div className={`card card-flush ${className}`}>
      <div className='card-body pt-4 px-4'>
        <h6 className='fw-bold text-gray-800 mb-2'>Monthly Paid Amount by Client</h6>
        <div id='amchartdiv' style={{ width: '100%', height: '150px' }} />
      </div>
    </div>
  )
}
