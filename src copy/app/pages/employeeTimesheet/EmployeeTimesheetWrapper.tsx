import { FC } from "react";
import { PageTitle } from "../../../_metronic/layout/core";
import { EmployeeTimesheet } from "./EmployeeTimesheet";


const EmployeeTimesheetWrapper: FC = () => {
  return (
    <>
      <script src="chart.js"></script>
      <PageTitle breadcrumbs={[]}>Employee Timesheet Page</PageTitle>
      <EmployeeTimesheet />
    </>
  );
};

export default EmployeeTimesheetWrapper;
