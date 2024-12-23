import {FC} from 'react'
import {PageTitle} from '../../../_metronic/layout/core'
import { CreateEmployee } from './CreateEmployee'

const ClaimPageWrapper: FC = () => {
  return (
    <>
    <script src='chart.js'></script>
      <PageTitle breadcrumbs={[]}>Claims Page</PageTitle>
      <CreateEmployee />
    </>
  )
}

export default ClaimPageWrapper
