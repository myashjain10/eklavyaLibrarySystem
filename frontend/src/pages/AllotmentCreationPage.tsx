import React from 'react';
import TopBar from '../components/TopBar';
import Footer from '../components/Footer';
import AllotmentCreationForm from '../components/AllotmentCreationForm';
import { useSearchParams } from 'react-router-dom';

const AllotmentCreationPage = () => {

  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const memberid = searchParams.get('memberid');
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <TopBar />

      <h1 className='text-4xl text-center font-semibold  mt-4'>  </h1>

      <AllotmentCreationForm />

      
      <Footer />
    </div>
  );
};

export default AllotmentCreationPage;