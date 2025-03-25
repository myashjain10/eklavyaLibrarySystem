// memberPage.tsx
import TopBar from '../components/TopBar';
import Footer from '../components/Footer';
import { useMember } from '../hooks/memberHooks';
import { useNavigate, useParams } from 'react-router-dom';

const MemberDetailsPage = () => {
  // Sample member data - in a real app this would come from an API
  const nav = useNavigate();
  const { id } = useParams()
  const {loading, member} = useMember({ id: id || "" });

  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Present';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get background color for allotment section based on member status
  const getAllotmentBgColor = (status: 'current' | 'previous') => {
    return status === 'current' ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200';
  };
  
  const handleAllotmentButton = () =>{
    nav(`/member/allotment?id=${member?.id}`);
  }

  if(loading || !member){
    return(
      <>
      Loading
      </>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <TopBar />
      
      <div className="flex-grow container mx-auto py-8 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Back button */}
          <div className="mb-4">
            <a 
              href="/member/all" 
              className="inline-flex items-center text-blue-600 hover:text-blue-800"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Back to Members
            </a>
          </div>
          
          {/* Member details card */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-blue-600 px-6 py-4">
              <h1 className="text-xl font-bold text-white">Member Details</h1>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h2>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Member Name</p>
                      <p className="text-base font-medium">{member.name}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Phone Number</p>
                      <p className="text-base">{member.phone_number}</p>
                    </div>
                    
                    {member.email && (
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="text-base">{member.email}</p>
                      </div>
                    )}
                    
                    <div>
                      <p className="text-sm text-gray-500">Registration Date</p>
                      <p className="text-base">{formatDate(member.created_on)}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${member.status === 'current' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Last Allotment Section - Only displayed if lastAllotment exists */}
                {member.lastAllotment && (
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Last Allotment</h2>
                    
                    <div className={`border rounded-md p-4 ${getAllotmentBgColor(member.status)}`}>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-500">Seat Number</p>
                          <p className="text-base font-medium">{member.lastAllotment.seat_num}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-500">Duration</p>
                          <p className="text-base">
                            From {formatDate(member.lastAllotment.start_date)} to {formatDate(member.lastAllotment.end_date)}
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-500">Timings</p>
                          <p className="text-base">{
                              member.lastAllotment.full_day ? "Full Day (8 am - 10 pm)"
                              : (member.lastAllotment.first_half ? "First Half (8 am - 3 pm"
                                :( member.lastAllotment.second_half ? "Second Half (3 pm - 10 pm" : "-")
                                )
                            }</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Action buttons */}
              <div className="mt-8 flex justify-end space-x-4">
                <button 
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition duration-150"
                >
                  Edit Member
                </button>
                <button 
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150"
                  onClick={handleAllotmentButton}
                >
                  Create New Allotment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default MemberDetailsPage;