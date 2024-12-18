import {FC} from 'react'
import {PageTitle} from '../../../_metronic/layout/core'
import {ClaimPage} from './ClaimPage'

const ClaimPageWrapper: FC = () => {
  return (
    <>
    <script src='chart.js'></script>
      <PageTitle breadcrumbs={[]}>Claims Page</PageTitle>
      <ClaimPage />
    </>
  )
}

export default ClaimPageWrapper
