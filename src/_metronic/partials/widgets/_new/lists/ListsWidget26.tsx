
import {Fragment, useEffect, useState} from 'react'
import {KTIcon} from '../../../../helpers'
import { getNationalIdExp } from '../../../../../apiFactory/apiHelper';



type Props = {
  className: string;
};

type NationalIdRecord = {
  national_id: string;
  expiry_date: string;
  associated_user_id: { username : string };
};

const ListsWidget26 = ({ className }: Props) => {
  const [expiringRecords, setExpiringRecords] = useState<NationalIdRecord[]>([]);

  const fetchExpiringRecords = async () => {
    const records = await getNationalIdExp();

    if (records) {
      const filteredRecords = records.filter((record: NationalIdRecord) => {
        const today = new Date();
        const twoMonthsFromNow = new Date();
        twoMonthsFromNow.setMonth(today.getMonth() + 2);

        const expiryDate = new Date(record.expiry_date);
        return expiryDate <= twoMonthsFromNow && expiryDate > today;
      });

      setExpiringRecords(filteredRecords);
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
      <div className='card-header pt-5'>
        <h3 className='card-title text-gray-800 fw-bold'>Expiring National IDs</h3>
        <div className='card-toolbar'></div>
      </div>
      <div className='card-body pt-5'>
        {expiringRecords.length > 0 ? (
          expiringRecords.map((record, index) => (
            <Fragment key={`national-id-${index}`}>
              <div className='d-flex flex-stack'>
                <span className='text-primary fw-semibold fs-6 me-2'>
                {record.associated_user_id?.username || 'No username'} - {record.national_id}
                </span>
                <span className='text-danger fw-semibold'>
                  Expires on:  {formatExpiryDate(record.expiry_date)}
                </span>
              </div>
              {expiringRecords.length - 1 > index && (
                <div className='separator separator-dashed my-3' />
              )}
            </Fragment>
          ))
        ) : (
          <div>No national IDs expiring within the next 2 months.</div>
        )}
      </div>
    </div>
  );
};

export {ListsWidget26}
