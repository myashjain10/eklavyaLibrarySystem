import axios from 'axios';
import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Allotment } from '../types';

//this component will just take user input, do validation, and then submit the details.
interface Prop{
  method: "CREATE" | "UPDATE",
  allotment: Allotment | null,
  memberid: string
}

// Define types for component state and props
interface AllotmentType {
  fullDay: boolean;
  firstHalf: boolean;
  secondHalf: boolean;
}

const AllotmentCreationForm = ({method, allotment, memberid}:Prop) => {
  const nav = useNavigate();

  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [seatNumber, setSeatNumber] = useState<string>('');
  const [allotmentType, setAllotmentType] = useState<AllotmentType>({
    fullDay: false,
    firstHalf: false,
    secondHalf: false
  });

  const handleCheckAvailability = (): void => {
    // Implement availability checking logic here
    alert(`Checking availability for Seat ${seatNumber}`);
  };

  const handleCheckboxChange = (type: keyof AllotmentType): void => {
    setAllotmentType(prev => ({
      fullDay: type === 'fullDay' ? !prev.fullDay : false,
      firstHalf: type === 'firstHalf' ? !prev.firstHalf : false,
      secondHalf: type === 'secondHalf' ? !prev.secondHalf : false
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Implement submission logic here
    const formData = {
      member_id: memberid,
      start_date: startDate,
      end_date: endDate,
      seat_num: seatNumber,
      full_day: allotmentType.fullDay,
      first_half: allotmentType.firstHalf,
      second_half: allotmentType.secondHalf
    }
    try{
      if(method == "CREATE"){
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/allotment`,
          formData,
          {
            headers:{
              Authorization: localStorage.getItem("token") || ""
            }
          }
        );
      } else if(method == "UPDATE"){
        const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/v1/allotment/${allotment?.id}`,
          formData,
          {
            headers:{
              Authorization: localStorage.getItem("token") || ""
            }
          }
        );
      }

      nav(`/member/${memberid}`);
    }catch(e){
      console.error(e)
    }

    console.log({
      startDate,
      endDate,
      seatNumber,
      allotmentType
    });
  };

  return (
    <div className="m-auto flex items-center justify-center w-screen ">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Create Allotment
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
            />
          </div>

          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
              End Date
            </label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex-grow">
              <label htmlFor="seatNumber" className="block text-sm font-medium text-gray-700">
                Seat Number
              </label>
              <input
                type="text"
                id="seatNumber"
                value={seatNumber}
                onChange={(e) => setSeatNumber(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required
              />
            </div>
            <button
              type="button"
              onClick={handleCheckAvailability}
              className="mt-6 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition duration-300 flex items-center"
            >
              Check
            </button>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Allotment Type
            </label>
            <div className="flex space-x-4">
              {Object.keys(allotmentType).map((type) => (
                <div key={type} className="flex items-center">
                  <input
                    type="checkbox"
                    id={type}
                    checked={allotmentType[type as keyof AllotmentType]}
                    onChange={() => handleCheckboxChange(type as keyof AllotmentType)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label 
                    htmlFor={type} 
                    className="ml-2 block text-sm text-gray-900 capitalize"
                  >
                    {type.replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md transition duration-300"
            >
              Create Allotment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AllotmentCreationForm;