import {FC} from 'react'

// type Props = {
//   companyName?: string
// }

// const UserClientNameCell: FC<Props> = ({companyName}) => (
//   <div className='badge badge-light-warning fw-bolder '>{companyName}</div>
// )
type Props = {
  companyName?: string;
};

const UserClientNameCell: FC<Props> = ({ companyName }) => {
  // Determine badge color based on company name
  const getBadgeColor = () => {
    switch (companyName) {
      case 'Arab National Bank':
        return 'badge-light-success'; // Green color
      case 'Riyad Bank':
        return 'badge-light-primary'; // Blue color
      default:
        return 'badge badge-pill badge-info'; // Default color 
    }
  };

  return (
    <div className={`badge ${getBadgeColor()} fw-bolder`}>
      {companyName}
    </div>
  );
};


export {UserClientNameCell}
