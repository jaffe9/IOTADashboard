import axios, { AxiosResponse } from "axios";
import { fetchPayslip, sendPayslipEmail } from "../../apiFactory/apiHelper1";

//  Define interfaces for type safety
export interface PayslipUser {
  fullName: string;
  email: string;
}

export interface PayslipRecord {
  associatedUserId: PayslipUser;
  paySlipLink: string;
}

interface SendEmailParams {
  email: string;
  name: string;
  link: string;
}

//  Utility to get previous month and current year
const getPreviousMonthAndYear = (): { month: string; year: string } => {
  const now = new Date();
  const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1);
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  return {
    month: monthNames[prevMonth.getMonth()],
    year: prevMonth.getFullYear().toString(),
  };
};

const { month, year } = getPreviousMonthAndYear();

//  Fetch payslip data from Supabase REST API
export const fetchPayslipData = async (): Promise<PayslipRecord[]> => {
  try {
    const response = await fetchPayslip(month,year)
    console.log("This is form send payslips to employees :", response)
    return response;
  } catch (err: any) {
    console.error(" Error fetching payslip data:", err.message);
    return [];
  }
};

export const sendAllPayslips = async () => {
  const data = await fetchPayslipData();
  
  if (!data || data.length === 0) {
    throw new Error("No payslip data found");
  }

  const results = {
    success: 0,
    failed: 0,
    errors: [] as string[]
  };

  for (const item of data) {
    const user = item.associatedUserId;
    const name = user?.fullName;
    const email = user?.email;
    const link = item.paySlipLink;

    if (email && name && link) {
      try {
        await sendPayslipEmail(email, name, link, month, year);
        results.success++;
      } catch (error) {
        results.failed++;
        results.errors.push(`Failed to send to ${email}`);
        console.error(`Failed to send payslip to ${email}:`, error);
      }
    } else {
      console.warn("Incomplete data, skipping:", item);
      results.failed++;
    }
  }

  console.log(`Payslip sending complete: ${results.success} succeeded, ${results.failed} failed`);
  
  if (results.failed > 0) {
    throw new Error(`${results.failed} payslip(s) failed to send. Check console for details.`);
  }
};