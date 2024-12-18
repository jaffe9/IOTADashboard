import { FC } from "react";
import { PageTitle } from "../../../_metronic/layout/core";
import { EmployeeInvoice } from "./EmployeeInvoice";

const EmployeeInvoiceWrapper: FC = () => {
  return (
    <>
      <script src="chart.js"></script>
      <PageTitle breadcrumbs={[]}>Employee Invoice Page</PageTitle>
      <EmployeeInvoice />
    </>
  );
};

export default EmployeeInvoiceWrapper;
