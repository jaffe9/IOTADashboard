import { Content } from "../../../../_metronic/layout/components/content";
import { Card5 } from "../../../../_metronic/partials/content/cards/Card5";
import { apiHelper } from "../../../../apiFactory/apiHelper";



var salaryDetailsInfo: any = await apiHelper
  .getEmployeeSalaryDetailInfo("1")
  .then(async (data) => {
    return data;
  });

export function Campaigns() {
  return (
    <>
      <Content>
        <div className="d-flex flex-wrap flex-stack mb-6">
          <h3 className="fw-bolder my-2">
            <span className="fs-6 text-gray-500 fw-bold ms-1">
              Current Year
            </span>
          </h3>
          <div className="d-flex align-items-center my-2">
            <div className="w-100px me-5">
              <select
                name="status"
                data-control="select2"
                data-hide-search="true"
                className="form-select form-select-white form-select-sm"
                defaultValue="1"
              >
                <option value="1">30 Days</option>
                <option value="2">90 Days</option>
                <option value="3">6 Months</option>
                <option value="4">1 Year</option>
              </select>
            </div>
            <button
              className="btn btn-primary btn-sm"
              data-bs-toggle="tooltip"
              title="Coming soon"
            >
              Add Campaign
            </button>
          </div>
        </div>
        <div className="row g-6 g-xl-9" id="cardWidget">
        {(() => {
          const arr = [];
          for (let i = 0; i < salaryDetailsInfo.data.length; i++) {
            var arrow = 'up';
            var arrowStatus = salaryDetailsInfo.data[i].employee_leaves > 0
            if(arrowStatus){arrow = 'down'} else {arrow = 'up'}
            arr.push(
                <div className="col-sm-6 col-xl-4" key={i}>
                  <Card5
                    key={i}
                    title={salaryDetailsInfo.data[i].payslip_for_month}
                    description={
                      "SAR " + salaryDetailsInfo.data[i].total_net_salary
                    }
                    status={arrow}
                    statusValue={salaryDetailsInfo.data[i].employee_leaves}
                    statusDesc="days leaves"
                    progress={"SAR " + salaryDetailsInfo.data[i].total_deductions}
                    progressType="Other Requests"
                  />
                </div>
              
            );
          }
          return arr;
        })()}
        </div>
        <div className="d-flex flex-stack flex-wrap pt-10">
          <div className="fs-6 fw-bold text-gray-700">
            Showing 1 to 10 of 50 entries
          </div>
          <ul className="pagination">
            <li className="page-item previous">
              <a href="#" className="page-link">
                <i className="previous"></i>
              </a>
            </li>

            <li className="page-item active">
              <a href="#" className="page-link">
                1
              </a>
            </li>

            <li className="page-item">
              <a href="#" className="page-link">
                2
              </a>
            </li>

            <li className="page-item">
              <a href="#" className="page-link">
                3
              </a>
            </li>

            <li className="page-item">
              <a href="#" className="page-link">
                4
              </a>
            </li>

            <li className="page-item">
              <a href="#" className="page-link">
                5
              </a>
            </li>

            <li className="page-item">
              <a href="#" className="page-link">
                6
              </a>
            </li>

            <li className="page-item next">
              <a href="#" className="page-link">
                <i className="next"></i>
              </a>
            </li>
          </ul>
        </div>
      </Content>
    </>
  );
}
