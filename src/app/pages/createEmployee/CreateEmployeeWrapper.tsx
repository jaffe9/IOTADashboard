import {FC} from 'react'
import {PageTitle} from '../../../_metronic/layout/core'
import { CreateEmployee } from './CreateEmployee'

const CreatePageWrapper: FC = () => {
  return (
    <>
    <script src='chart.js'></script>
      <PageTitle breadcrumbs={[]}>Create Page</PageTitle>
      <CreateEmployee />
    </>
  )
}

export default CreatePageWrapper
