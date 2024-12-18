import {FC} from 'react'
import { ToolbarWrapper } from '../../../../_metronic/layout/components/toolbar'
import { Content } from '../../../../_metronic/layout/components/content'
import { TablesWidget9O } from '../../../../_metronic/partials/widgets/tables/TablesWidget9O'

const Opportunities: FC = () => {
  return (
    <>
      <ToolbarWrapper />
      <Content>
        <TablesWidget9O className='mb-5 mb-xl-8' />
        </Content>
    </>
  )
}

export {Opportunities}
