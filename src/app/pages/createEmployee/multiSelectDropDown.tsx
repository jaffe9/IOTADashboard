import React from 'react';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

interface ChipSelectorProps {
  value: string[];
  onChange: (selected: string[]) => void;
}

const ChipSelector: React.FC<ChipSelectorProps> = ({ value, onChange }) => {
  const options = ['English', 'French', 'Spanish', 'German', 'Arabic', 'Mandarin'];

  return (
    <Autocomplete
      multiple
      options={options}
      value={value}
      onChange={(event, newValue) => onChange(newValue)}
      renderTags={(value: string[], getTagProps) =>
        value.map((option, index) => (
          <Chip key={index} label={option} {...getTagProps} />
        ))
      }
      renderInput={(params) => (
        <TextField 
        className='form-select form-select-lg form-select-solid'
        {...params} 
        variant="outlined" 
         sx={{
          "& fieldset": { border: 'none' },
          "label":{fontWeight:'bold', fontSize:'15px'},
          
        }} 
        label="Select Languages" />
        
      )}
    />
  );
};

export default ChipSelector;
