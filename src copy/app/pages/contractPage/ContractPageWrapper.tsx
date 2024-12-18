import {FC} from 'react'
import {PageTitle} from '../../../_metronic/layout/core'
import {ContractPage} from './ContractPage'

const ContractPageWrapper: FC = () => {
  return (
    <>
    <script src='chart.js'></script>
      <PageTitle breadcrumbs={[]}>Claims Page</PageTitle>
      <ContractPage />
    </>
  )
}

export default ContractPageWrapper
