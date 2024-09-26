import { FC, useState } from "react";
import Flatpickr from "react-flatpickr";

const Example1: FC = () => {
    const [dateState, setDateState] = useState<any>({
      date1: new Date(),
      date2: new Date()
    });
  
    return (
      <>
        <Flatpickr
          value={dateState.date}
          onChange={([date1]) => {
            setDateState({ date1 });
          }}
          className='form-control'
          placeholder='Pick date'
        />
  
        <Flatpickr
          value={dateState.date}
          onChange={([date2]) => {
            setDateState({ date2 });
          }}
          className='form-control form-control-solid'
          placeholder='Pick date'
        />
      </>
    )
  }