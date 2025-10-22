interface UserData {
  fullName: string
  employeeId: string
  occupation: string
  employeeJoiningDate: string
}

interface SalaryData {
  pay_period: string
  pay_date: string
  holidays: number
  working_days: number
  leaves: number
  lop_days: number
  basic_allowance: number
  hr_allowance: number
  travel_other_allowance: number
  earnings_total: number
  salary_advance: number
  lop_salary_total: number
  employee_request: number
  deductions_total: number
  total_net_salary: number
  total_net_salary_words: string
}

export const getStandardTemplate = (
  user: UserData,
  salary: SalaryData,
  formatNumber: (num: number) => string
): string => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>InnovWayz Employee Payslip</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;600&display=swap');
        @page { size: A4; margin: 0; }
        body {
            font-family: 'IBM Plex Sans', sans-serif;
            font-size: 13px;
            background: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .payslip-container {
            width: 210mm;
            min-height: 297mm;
            margin: 0 auto;
            background: #ffffff;
            padding: 40px;
            box-sizing: border-box;
        }
        .header {
            text-align: center;
            padding-bottom: 15px;
            border-bottom: 3px solid #1a237e;
        }
        .header h1 {
            color: #1a237e;
            font-size: 24px;
            font-weight: 600;
            margin: 0 0 10px 0;
        }
        .header p {
            margin: 5px 0;
            color: #444;
        }
        .rounded-box {
            width: 250px;
            font-size: 14px;
            border: 1px solid #b0c4de;
            border-radius: 12px;
            padding: 10px;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
        }
        .rounded-box h3 {
            font-size: 20px;
            margin: 0 0 5px 0;
            color: #1a237e;
        }
        .rounded-box sub {
            font-size: 10px;
            color: #1a237e;
        }
        .section {
            display: flex;
            justify-content: space-between;
            gap: 40px;
            margin-top: 20px;
            padding: 15px;
        }
        .info-row {
            display: flex;
            justify-content: space-between;
            font-size: 14px;
            color: #333;
            margin-bottom: 8px;
        }
        .info-row-right {
            display: flex;
            justify-content: space-between;
            font-size: 14px;
            color: #333;
            margin-bottom: 0px;
        }
        .salary-container {
            display: flex;
            gap: 20px;
            margin-top: 20px;
        }
        .salary-box {
            flex: 1;
            background: #fff;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.05);
        }
        .salary-box h3 {
            text-align: center;
            margin-bottom: 10px;
            color: #055499;
            font-size: 16px;
            font-weight: 600;
        }
        .table-section {
            width: 100%;
            border-collapse: collapse;
        }
        .table-section th, .table-section td {
            padding: 10px;
            border-bottom: 1px solid #ddd;
            text-align: left;
        }
        .table-section th {
            background: #055499;
            color: white;
            font-weight: 600;
        }
        .net-pay {
            margin-top: 20px;
            padding: 15px;
            background: #055499;
            color: white;
            text-align: center;
            font-size: 18px;
            font-weight: 600;
            border-radius: 8px;
        }
        .left-content {
            flex: 1;
            font-size: 12px;
            color: #333;
        }
        .footer {
            text-align: center;
            font-size: 12px;
            color: #666;
            margin-top: 10px;
            padding-top: 10px;
        }
        .footer-h2 {
            color: #055499;
            font-size: 18px;
            margin: 10px 0;
        }
        .footer-top {
            text-align: center;
            font-size: 12px;
            color: #666;
            margin-top: 10px;
            border-top: 1px solid #ddd;
            padding-top: 10px;
        }
        img {
            width: 100px;
            height: auto;
        }
    </style>
</head>
<body>
<div class="payslip-container">
    <div class="header">
        <h1>InnovWayz Technologies</h1>
        <p>Payslip - ${salary.pay_period}</p>
    </div>

    <div class="section">
        <div class="left-content">
            <div class="info-row"><span>Employee Name:</span> <span>${user.fullName}</span></div>
            <div class="info-row"><span>Employee ID:</span> <span>${user.employeeId}</span></div>
            <div class="info-row"><span>Designation:</span> <span>${user.occupation}</span></div>
            <div class="info-row"><span>Location:</span> <span>Riyadh, Saudi Arabia</span></div>
            <div class="info-row"><span>Pay Date:</span> <span>${salary.pay_date}</span></div>
            <div class="info-row"><span>Payment Mode:</span> <span>Bank</span></div>
            <div class="info-row"><span>Employee Band:</span> <span>B1</span></div>
        </div>
        <div class="rounded-box">
            <h3>${formatNumber(salary.total_net_salary)}</h3>
            <sub>Employee Net Pay</sub><br/><br/>
            <div class="info-row"><span>Working Days:</span> <span>${salary.working_days}</span></div>
            <div class="info-row"><span>Government Holidays:</span> <span>${salary.holidays}</span></div>
            <div class="info-row"><span>Employee Leaves:</span> <span>${salary.leaves}</span></div>
            <div class="info-row-right"><span>Loss Of Pay Days:</span> <span>${salary.lop_days}</span></div>
        </div>
    </div>
    
    <div class="salary-container">
        <div class="salary-box">
            <h3>Earnings</h3>
            <table class="table-section">
                <thead>
                    <tr>
                        <th>Description</th>
                        <th>Amount (SAR)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Basic Salary</td>
                        <td>${formatNumber(salary.basic_allowance)}</td>
                    </tr>
                    <tr>
                        <td>House Rent Allowance</td>
                        <td>${formatNumber(salary.hr_allowance)}</td>
                    </tr>
                    <tr>
                        <td>Travel & Other Allowance</td>
                        <td>${formatNumber(salary.travel_other_allowance)}</td>
                    </tr>
                    <tr>
                        <td><b>Total</b></td>
                        <td><b><u>${formatNumber(salary.earnings_total)}</u></b></td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="salary-box">
            <h3>Deductions</h3>
            <table class="table-section">
                <thead>
                    <tr>
                        <th>Description</th>
                        <th>Amount (SAR)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Salary Advance</td>
                        <td>${formatNumber(salary.salary_advance)}</td>
                    </tr>
                    <tr>
                        <td>Loss Of Pay</td>
                        <td>${formatNumber(salary.lop_salary_total)}</td>
                    </tr>
                    <tr>
                        <td>Employee Request</td>
                        <td>${formatNumber(salary.employee_request)}</td>
                    </tr>
                    <tr>
                        <td><b>Total</b></td>
                        <td><b><u>${formatNumber(salary.deductions_total)}</u></b></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    
    <div class="net-pay">
        Net Pay : ${formatNumber(salary.total_net_salary)} SAR
    </div>

    <div class="footer">
        <h2 class="footer-h2">${salary.total_net_salary_words}</h2>
        <p>Generated automatically by InnovWayz Payroll - No signature required</p>
    </div>
    <div class="footer-top">
        <img src="https://static.wixstatic.com/media/f76408_60c9c824e92f4e47b0d11b57c71c9e47~mv2.png/v1/fill/w_216,h_165,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/f76408_60c9c824e92f4e47b0d11b57c71c9e47~mv2.png" alt="InnovWayz Logo">
        <p>Building No: 9353, Office # 2, Shaddad Al Fahri, Farazdaq Street, Al Malaz, Riyadh - 12642 KSA.</p>
    </div>
</div>
</body>
</html>
  `
}
