//Consultants list
import { useEffect } from "react";
import { apiHelper } from "../../../../../apiFactory/apiHelper";
import { Opportunities } from "../../../../../app/modules/widgets/components/Opportunities";
import { Login } from "../../../../../app/modules/auth/components/Login";

type Props = {
  className: string;
  description: string;
  color: string;
  img: string;
};
function setValues()
{
// *********************************************** Changes for API value begins here ***********************************************
let userCountValue = document.getElementById("userCountValueTag");

let userCount = apiHelper.getUserCount().then((response: any) => {
  if (!userCountValue) {
    console.log("inside null:" + userCountValue);
    return;
  }
  userCountValue.innerHTML = response;
});

let pendingOpportunitiesValue = document.getElementById(
  "opportunitiesPendingTag"
);
let totalOpportunitiesValue = document.getElementById("totalOpportunitiesTag");

let pendingValue = apiHelper.getAllOpportunities().then((response: any) => {
  const filteredData = response.data.filter(
    (fil: { opportunity_status: number }) => fil.opportunity_status == 2
  );
  if (!pendingOpportunitiesValue) {
    return;
  }
  pendingOpportunitiesValue.innerHTML = filteredData.length + " Pending";
});
let opportunitiesValue = apiHelper
  .getAllOpportunities()
  .then((response: any) => {
    if (!totalOpportunitiesValue) {
      return;
    }
    totalOpportunitiesValue.innerHTML = response.data.length;
  });
}
// *********************************************** Changes for API value ends here ***********************************************


const CardsWidget20 = ({ className, description, color, img }: Props) => (
  useEffect(() => {
    setValues();
    }),
  <div
    className={`card card-flush bgi-no-repeat bgi-size-contain bgi-position-x-end ${className}`}
    style={{
      backgroundColor: color,
      backgroundImage: `url('${img}')`,
    }}
  >
    <div className="card-header pt-5">
      <div className="card-title d-flex flex-column">
        <span
          id="userCountValueTag"
          className="fs-2hx fw-bold text-white me-2 lh-1 ls-n2"
        ></span>

        <span className="text-white opacity-75 pt-1 fw-semibold fs-6">
          {description}
        </span>
      </div>
    </div>
    <div className="card-body d-flex align-items-end pt-0" onClick={Login}>
      <div className="d-flex align-items-center flex-column mt-3 w-100">
        <div className="d-flex justify-content-between fw-bold fs-6 text-white opacity-75 w-100 mt-auto mb-2">
          <span id="opportunitiesPendingTag"></span>
          <span id="totalOpportunitiesTag"></span>
        </div>

        <div className="h-8px mx-3 w-100 bg-white bg-opacity-50 rounded">
          <div
            id="progressBarValue"
            className="bg-white rounded h-8px"
            role="progressbar"
            style={{ width: "72%" }}
            aria-valuenow={50}
            aria-valuemin={0}
            aria-valuemax={100}
          ></div>
        </div>
      </div>
    </div>
  </div>
)

export { CardsWidget20 };

