import { useState, useEffect, Fragment } from 'react';
import { KTIcon } from '../../../../helpers';
import { getNationalIdExp } from '../../../../../apiFactory/apiHelper';

type Props = {
  className: string;
};

type NationalIdRecord = {
  national_id: string;
  expiry_date: string;
  associated_user_id: { username: string };
};

const ListsWidget26 = ({ className }: Props) => {
  const [expiringRecords, setExpiringRecords] = useState<NationalIdRecord[]>([]);

  const fetchExpiringRecords = async () => {
    const records = await getNationalIdExp();

    if (records) {
      const today = new Date();
      const twoMonthsFromNow = new Date();
      twoMonthsFromNow.setMonth(today.getMonth() + 2);

      const filteredAndSortedRecords = records
        .filter((record: NationalIdRecord) => {
          const expiryDate = new Date(record.expiry_date);
          return expiryDate <= twoMonthsFromNow && expiryDate > today;
        })
        .sort((a: { expiry_date: string | number | Date; }, b: { expiry_date: string | number | Date; }) => new Date(a.expiry_date).getTime() - new Date(b.expiry_date).getTime());

      setExpiringRecords(filteredAndSortedRecords);
    }
  };

  const formatExpiryDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).replace(/ /g, '/');
  };

  useEffect(() => {
    fetchExpiringRecords();
  }, []);

  return (
    <div className={`card card-flush ${className}`}>
      <div className="card-header pt-5">
        <h3 className="card-title text-gray-800 fw-bold">National_ID Expiries</h3>
        <div className="card-toolbar"></div>
      </div>
      <div className="card-body pt-5">
        {expiringRecords.length > 0 ? (
          expiringRecords.map((record, index) => (
            <Fragment key={`national-id-${index}`}>
              <div className="d-flex flex-stack">
                <a href="#" className="text-primary fw-bold fs-6 me-2">
                  {record.associated_user_id?.username?.toUpperCase() || 'NO USERNAME'} - {record.national_id}
                </a>
                <span className="text-danger">
                  Expiry Date: {formatExpiryDate(record.expiry_date)}
                </span>
                <button
                  type="button"
                  className="btn btn-icon btn-sm h-auto btn-color-gray-500 btn-active-color-primary justify-content-end"
                >
                  <KTIcon iconName="exit-right-corner" className="fs-2" />
                </button>
              </div>
              {expiringRecords.length - 1 > index && (
                <div className="separator separator-dashed my-3" />
              )}
            </Fragment>
          ))
        ) : (
          <div>No records expiring within the next 2 months.</div>
        )}
      </div>
    </div>
  );
};

export { ListsWidget26 };
