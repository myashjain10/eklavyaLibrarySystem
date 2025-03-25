import React from 'react';
import TopBar from '../components/TopBar';
import MemberCreationForm from '../components/MemberCreationForm';
import Footer from '../components/Footer';

const MemberCreationPage = () => {

  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <TopBar />
      
      <div className="flex-grow container mx-auto py-8 px-4">
        <MemberCreationForm />
      </div>
      
      <Footer />
    </div>
  );
};

export default MemberCreationPage;