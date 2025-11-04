import { FC, useState, useEffect } from 'react'
import axios from 'axios'
import { useListView } from '../core/ListViewProvider'
import { getStandardTemplate } from './templates/StandardTemplate'
import { getNewJoineeTemplate } from './templates/NewJoineeTemplate'
import { getAdditionalTemplate } from './templates/AdditionalTemplate'
import { getSalForPay } from '../../../../../../apiFactory/apiHelper1'

// Types
interface UserData {
  id: string
  fullName: string
  employeeId: string
  occupation: string
  employeeJoiningDate: string
  salary: SalaryData[]
}

interface SalaryData {
  user_id: string
  pay_period: string
  salary_pay_mode: string
  holidays: number
  working_days: number
  total_net_salary: number
  earnings_total: number
  deductions_total: number
  total_net_salary_words: string
  basic_allowance: number
  hr_allowance: number
  travel_other_allowance: number
  salary_advance: number
  lop_salary_total: number
  leaves: number
  lop_days: number
  pay_date: string
  overTime: number
  employee_request: number
  is_generated: number
}

interface Props {
  employeeId: string
}

type PayslipTemplate = 'standard' | 'newJoinee' | 'additional'

const PayslipGenerator: FC<Props> = ({ employeeId }) => {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<PayslipTemplate>('standard')
  const { setItemIdForUpdate } = useListView()

  // Fetch user data from API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // const axiosUserIns = axios.create({
        //   baseURL: 'https://zhplktaovpyenmypkjql.supabase.co/rest/v1/',
        //   headers: {
        //     'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpocGxrdGFvdnB5ZW5teXBranFsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY5MjUxOTYzMywiZXhwIjoyMDA4MDk1NjMzfQ.i-QsgcR7aZTxpubO0dHGPs-li50B7GrVQKsuW866YLA',
        //     'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpocGxrdGFvdnB5ZW5teXBranFsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY5MjUxOTYzMywiZXhwIjoyMDA4MDk1NjMzfQ.i-QsgcR7aZTxpubO0dHGPs-li50B7GrVQKsuW866YLA'
        //   }
        // })

        // const response = await axiosUserIns.get(
        //   `user?id=eq.${employeeId}&select=*,salary(user_id,*)`
        // )
         const response = await getSalForPay(employeeId);
        //  console.log("This is the response form PayslipGeneration :", response)
      

        if (response && response.length > 0) {
          setUserData(response[0])
        }else {
          setError('No User Data Found')
        }
      } catch (err: any) {
        setError(err.message || 'Error fetching user data')
      }
    }

    if (employeeId) {
      fetchUserData()
    }
  }, [employeeId])

  // Format number with commas
  const formatNumber = (num: number): string => {
    return parseFloat(num.toString()).toLocaleString('en-US', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2
    })
  }

  // Get template based on selection
  const getSelectedTemplate = (user: UserData, salary: SalaryData): string => {
    switch (selectedTemplate) {
      case 'newJoinee':
        return getNewJoineeTemplate(user, salary, formatNumber)
      case 'additional':
        return getAdditionalTemplate(user, salary, formatNumber)
      default:
        return getStandardTemplate(user, salary, formatNumber)
    }
  }

  // Generate and download PDF (using browser print)
  const handleGeneratePayslip = async () => {
    if (!userData || !userData.salary || userData.salary.length === 0) {
      alert('No salary data available')
      return
    }

    setIsGenerating(true)

    try {
      const salary = userData.salary[0]
      const htmlContent = getSelectedTemplate(userData, salary)

      // Open in new window and trigger print
      const printWindow = window.open('', '_blank')
      if (printWindow) {
        printWindow.document.write(htmlContent)
        printWindow.document.close()
        
        // Wait for content to load then print
        printWindow.onload = () => {
          printWindow.document.title = `Payslip_${userData.fullName}}`;
          printWindow.print()
        }
      }

    //   // Update is_generated flag
    //   await axios.patch(
    //     `https://zhplktaovpyenmypkjql.supabase.co/rest/v1/salary?user_id=eq.${employeeId}`,
    //     { is_generated: 1 },
    //     {
    //       headers: {
    //         'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpocGxrdGFvdnB5ZW5teXBranFsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY5MjUxOTYzMywiZXhwIjoyMDA4MDk1NjMzfQ.i-QsgcR7aZTxpubO0dHGPs-li50B7GrVQKsuW866YLA',
    //         'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpocGxrdGFvdnB5ZW5teXBranFsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY5MjUxOTYzMywiZXhwIjoyMDA4MDk1NjMzfQ.i-QsgcR7aZTxpubO0dHGPs-li50B7GrVQKsuW866YLA',
    //         'Content-Type': 'application/json'
    //       }
    //     }
    //   )

    } catch (err: any) {
      console.error('Error generating payslip:', err)
      alert('Error generating payslip: ' + err.message)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleClose = () => {
    setItemIdForUpdate(undefined)
  }

  if (error) {
    return (
      <div className="alert alert-danger">
        <h4>Error</h4>
        <p>{error}</p>
        <button className="btn btn-secondary" onClick={handleClose}>
          Close
        </button>
      </div>
    )
  }

  if (!userData || !userData.salary || userData.salary.length === 0) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading salary details...</p>
      </div>
    )
  }

  const salary = userData.salary[0]

  return (
    <div className="mx-auto max-w-[850px] scale-90 origin-top space-y-4">
     
{/* Template Selection */}
<div className="card mb-5 border-primary">
  <div className="card-header bg-light-primary py-3">
    <h3 className="card-title mb-0 fs-5">Select Payslip Template</h3>
  </div>
  <div className="card-body p-4">
    <div className="row g-3">
      <div className="col-md-4">
        <div 
          className={`card cursor-pointer h-100 ${selectedTemplate === 'standard' ? 'border-primary border-2 shadow-sm' : 'border-gray-300'}`}
          onClick={() => setSelectedTemplate('standard')}
          style={{ cursor: 'pointer', transition: 'all 0.2s' }}
        >
          <div className="card-body text-center p-4">
            <i className="bi bi-file-earmark-text fs-1 text-primary mb-2"></i>
            <h6 className="card-title mb-1 fw-bold">Standard Payslip</h6>
            <p className="text-muted mb-2" style={{ fontSize: '0.8rem' }}>Basic earnings and deductions</p>
            {selectedTemplate === 'standard' && (
              <span className="badge badge-sm badge-primary">Selected</span>
            )}
          </div>
        </div>
      </div>
      <div className="col-md-4">
        <div 
          className={`card cursor-pointer h-100 ${selectedTemplate === 'newJoinee' ? 'border-primary border-2 shadow-sm' : 'border-gray-300'}`}
          onClick={() => setSelectedTemplate('newJoinee')}
          style={{ cursor: 'pointer', transition: 'all 0.2s' }}
        >
          <div className="card-body text-center p-4">
            <i className="bi bi-person-plus-fill fs-1 text-success mb-2"></i>
            <h6 className="card-title mb-1 fw-bold">New Joinee</h6>
            <p className="text-muted mb-2" style={{ fontSize: '0.8rem' }}>Pro-rated salary for new employees</p>
            {selectedTemplate === 'newJoinee' && (
              <span className="badge badge-sm badge-primary">Selected</span>
            )}
          </div>
        </div>
      </div>
      <div className="col-md-4">
        <div 
          className={`card cursor-pointer h-100 ${selectedTemplate === 'additional' ? 'border-primary border-2 shadow-sm' : 'border-gray-300'}`}
          onClick={() => setSelectedTemplate('additional')}
          style={{ cursor: 'pointer', transition: 'all 0.2s' }}
        >
          <div className="card-body text-center p-4">
            <i className="bi bi-clock-history fs-1 text-warning mb-2"></i>
            <h6 className="card-title mb-1 fw-bold">With Additionals</h6>
            <p className="text-muted mb-2" style={{ fontSize: '0.8rem' }}>Includes overtime and bonuses</p>
            {selectedTemplate === 'additional' && (
              <span className="badge badge-sm badge-primary">Selected</span>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

      {/* Employee Information */}
<div
  className="d-flex flex-column scroll-y me-n7 pe-7"
  id="kt_modal_add_user_scroll"
  data-kt-scroll="true"
  data-kt-scroll-activate="{default: false, lg: false}"
  data-kt-scroll-max-height="auto"
  data-kt-scroll-dependencies="#kt_modal_add_user_header"
  data-kt-scroll-wrappers="#kt_modal_add_user_scroll"
  data-kt-scroll-offset="300px"
>
  {/* Employee Information */}
  <div className="card mb-5">
    <div className="card-header py-3">
      <h3 className="card-title mb-0">Employee Information</h3>
    </div>
    <div className="card-body p-6">
      <div className="row g-4">
        <div className="col-md-6">
          <label className="fs-7 fw-semibold mb-1 text-muted">Employee Name</label>
          <input
            type="text"
            className="form-control form-control-sm form-control-solid"
            value={userData.fullName}
            readOnly
          />
        </div>

        <div className="col-md-6">
          <label className="fs-7 fw-semibold mb-1 text-muted">Employee ID</label>
          <input
            type="text"
            className="form-control form-control-sm form-control-solid"
            value={userData.employeeId}
            readOnly
          />
        </div>

        <div className="col-md-6">
          <label className="fs-7 fw-semibold mb-1 text-muted">Designation</label>
          <input
            type="text"
            className="form-control form-control-sm form-control-solid"
            value={userData.occupation}
            readOnly
          />
        </div>

        <div className="col-md-6">
          <label className="fs-7 fw-semibold mb-1 text-muted">Joining Date</label>
          <input
            type="text"
            className="form-control form-control-sm form-control-solid"
            value={userData.employeeJoiningDate}
            readOnly
          />
        </div>

        <div className="col-md-4">
          <label className="fs-7 fw-semibold mb-1 text-muted">Pay Period</label>
          <input
            type="text"
            className="form-control form-control-sm form-control-solid"
            value={salary.pay_period}
            readOnly
          />
        </div>

        <div className="col-md-4">
          <label className="fs-7 fw-semibold mb-1 text-muted">Pay Date</label>
          <input
            type="text"
            className="form-control form-control-sm form-control-solid"
            value={salary.pay_date}
            readOnly
          />
        </div>

        <div className="col-md-4">
          <label className="fs-7 fw-semibold mb-1 text-muted">Pay Mode</label>
          <input
            type="text"
            className="form-control form-control-sm form-control-solid"
            value={salary.salary_pay_mode}
            readOnly
          />
        </div>
        
        <div className="col-md-3">
          <label className="fs-7 fw-semibold mb-1 text-muted">Working Days</label>
          <input
            type="text"
            className="form-control form-control-sm form-control-solid"
            value={salary.working_days}
            readOnly
          />
        </div>

        <div className="col-md-3">
          <label className="fs-7 fw-semibold mb-1 text-muted">Holidays</label>
          <input
            type="text"
            className="form-control form-control-sm form-control-solid"
            value={salary.holidays}
            readOnly
          />
        </div>

        <div className="col-md-3">
          <label className="fs-7 fw-semibold mb-1 text-muted">Leaves</label>
          <input
            type="text"
            className="form-control form-control-sm form-control-solid"
            value={salary.leaves}
            readOnly
          />
        </div>
       
        <div className="col-md-3">
          <label className="fs-7 fw-semibold mb-1 text-muted">LOP Days</label>
          <input
            type="text"
            className="form-control form-control-sm form-control-solid"
            value={salary.lop_days}
            readOnly
          />
        </div>

        <div className="col-md-12">
          <label className="fs-7 fw-semibold mb-1 text-muted">Overtime</label>
          <input
            type="text"
            className="form-control form-control-sm form-control-solid"
            value={salary.overTime}
            readOnly
          />
        </div>

        <div className="col-12">
          <div className="separator my-3"></div>
          <h5 className="fw-bold text-gray-700 mb-3">Earnings Breakdown</h5>
        </div>

        <div className="col-md-4">
          <label className="fs-7 fw-semibold mb-1 text-muted">Basic Allowance</label>
          <input
            type="text"
            className="form-control form-control-sm form-control-solid"
            value={formatNumber(salary.basic_allowance)}
            readOnly
          />
        </div>

        <div className="col-md-4">
          <label className="fs-7 fw-semibold mb-1 text-muted">House Rent Allowance</label>
          <input
            type="text"
            className="form-control form-control-sm form-control-solid"
            value={formatNumber(salary.hr_allowance)}
            readOnly
          />
        </div>

        <div className="col-md-4">
          <label className="fs-7 fw-semibold mb-1 text-muted">Travel & Other Allowance</label>
          <input
            type="text"
            className="form-control form-control-sm form-control-solid"
            value={formatNumber(salary.travel_other_allowance)}
            readOnly
          />
        </div>

        <div className="col-12">
          <label className="fs-6 fw-bold mb-1 text-success">Total Earnings</label>
          <input
            type="text"
            className="form-control form-control-sm form-control-solid fw-bold text-success"
            value={formatNumber(salary.earnings_total)}
            readOnly
          />
        </div>
        
        <div className="col-12">
          <div className="separator my-3"></div>
          <h5 className="fw-bold text-gray-700 mb-3">Deductions Breakdown</h5>
        </div>

        <div className="col-md-4">
          <label className="fs-7 fw-semibold mb-1 text-muted">LOP Salary</label>
          <input
            type="text"
            className="form-control form-control-sm form-control-solid"
            value={formatNumber(salary.lop_salary_total)}
            readOnly
          />
        </div>
       
        <div className="col-md-4">
          <label className="fs-7 fw-semibold mb-1 text-muted">Salary Advance</label>
          <input
            type="text"
            className="form-control form-control-sm form-control-solid"
            value={formatNumber(salary.salary_advance)}
            readOnly
          />
        </div>
       
        <div className="col-md-4">
          <label className="fs-7 fw-semibold mb-1 text-muted">Employee Request</label>
          <input
            type="text"
            className="form-control form-control-sm form-control-solid"
            value={formatNumber(salary.employee_request)}
            readOnly
          />
        </div>

        <div className="col-12">
          <label className="fs-6 fw-bold mb-1 text-danger">Total Deductions</label>
          <input
            type="text"
            className="form-control form-control-sm form-control-solid fw-bold text-danger"
            value={formatNumber(salary.deductions_total)}
            readOnly
          />
        </div>
      </div>
    </div>
  </div>

  {/* Net Salary */}
  <div className="card mb-2 border-primary">
    <div className="card-body bg-light-primary p-5">
      <div className="row g-3">
        <div className="col-12">
          <label className="fs-3 fw-bolder mb-2 text-primary">NET SALARY</label>
          <input
            type="text"
            className="form-control form-control-lg form-control-solid fw-bold fs-2 text-primary"
            value={`${formatNumber(salary.total_net_salary)} SAR`}
            readOnly
          />
        </div>
        <div className="col-12">
          <label className="fs-7 fw-semibold text-muted">In Words</label>
          <input
            type="text"
            className="form-control form-control-sm form-control-solid text-muted"
            value={salary.total_net_salary_words}
            readOnly
          />
        </div>
      </div>
    </div>
  </div>
</div>

    {/* begin::Actions */}
    <div className="text-center pt-15">
      <button
        type="button"
        className="btn btn-light me-3"
        onClick={handleClose}
        disabled={isGenerating}
      >
        Close
      </button>
      <button
        type="button"
        className="btn btn-primary"
        onClick={handleGeneratePayslip}
        disabled={isGenerating}
      >
        {isGenerating ? (
          <>
            <span className="spinner-border spinner-border-sm me-2"></span>
            Generating...
          </>
        ) : (
          <>
            <i className="bi bi-file-pdf me-2"></i>
            Generate Payslip
          </>
        )}
      </button>
     </div>
    </div>
  )
}

export { PayslipGenerator }