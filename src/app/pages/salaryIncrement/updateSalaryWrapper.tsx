import {FC} from 'react'
import {PageTitle} from '../../../_metronic/layout/core'
import { UpdateSalary } from './updateSalary'

const updateSalaryWrapper: FC = () => {
  return (
    <>
    <script src='chart.js'></script>
      <PageTitle breadcrumbs={[]}>Salary Page</PageTitle>
      <UpdateSalary /> 
    </>
  )
}

export default updateSalaryWrapper
