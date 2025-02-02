import {FC} from 'react'

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
      case 'InnovWayz Technologies':
        return 'badge-light-info'; // Red color
      case 'American Express':
        return 'badge-light-warning' // yellow color
      case 'Saudi Telecom Company':
        return 'badge-light fw-bold'
      default:
        return 'badge-light-danger'; // Default color (yellow)
    }
  };

  return (
    <div className={`badge ${getBadgeColor()} fw-bolder`}>
      {companyName}
    </div>
  );
};

export {UserClientNameCell}
