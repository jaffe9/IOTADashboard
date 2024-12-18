import { Content } from "../../../../_metronic/layout/components/content";
import { Card3 } from "../../../../_metronic/partials/content/cards/Card3";
import { apiHelper } from "../../../../apiFactory/apiHelper";
var client_id: string = "1";
var userInfo: any = await apiHelper.getPeerEmployees(client_id).then((data) => {
  return data;
});

export function Connections() {
  return (
    <Content>
      <div className="d-flex flex-wrap flex-stack mb-6">
        <h3 className="fw-bolder my-2">
          My Peers
          <span className="fs-6 text-gray-500 fw-bold ms-1">
            ({userInfo.data.length})
          </span>
        </h3>

        <div className="d-flex my-2">
          <select
            name="status"
            data-control="select2"
            data-hide-search="true"
            className="form-select form-select-white form-select-sm w-125px"
            defaultValue="Online"
          >
            <option value="Online">Online</option>
            <option value="Pending">Pending</option>
            <option value="Declined">Declined</option>
            <option value="Accepted">Accepted</option>
          </select>
        </div>
      </div>
      <div className="row g-6 g-xl-9">
        {(() => {
          const arr = [];
          for (let i = 0; i < userInfo.data.length; i++) {
            arr.push(
              <div className="col-md-6 col-xxl-4">
                <Card3
                  key={i}
                  color="blue"
                  avatar="media/avatars/300-6.jpg"
                  name={userInfo.data[i].first_name}
                  job={userInfo.data[i].occupation}
                  avgEarnings={userInfo.data[i].salary[0].total_net_salary}
                  totalEarnings={userInfo.data[i].billing[0].billing_value}
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
  );
}
