// AllMembersPage.tsx
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import { useMembers } from '../hooks/memberHooks';

const AllMembersPage = () => {
  
  const nav = useNavigate();
  // const [statusFilter, setStatusFilter] = useState<'current' | 'previous' | 'all'>('all');
  const { loading, members } = useMembers();

  // Filter members based on status
  // const filteredMembers = statusFilter === 'all'
  //   ? members
  //   : members.filter(member => member.status === statusFilter);

  // Format date function

  

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Navigate to member details page
  const handleViewDetails = (memberId: string) => {
    nav(`/member/${memberId}`)
  };

  if(loading){
    return(
      <>
      Loading
      </>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <CustomTopBar />
      
      <div className="flex-grow container mx-auto py-8 px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">All Members</h1>
            
            <div className="flex items-center space-x-4">
              <div>
                <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-1">
                  Filter by Status
                </label>
                <select
                  id="statusFilter"
                  // value={statusFilter}
                  // onChange={(e) => setStatusFilter(e.target.value as 'current' | 'previous' | 'all')}
                  className="bg-white border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All</option>
                  <option value="current">Current</option>
                  <option value="previous">Previous</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Member Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Seat No.
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Start Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    End Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timings
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {members.map((member) => (
                  <tr key={member.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{member.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{member.lastAllotment?.seat_num == null ? "-": member.lastAllotment.seat_num}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{formatDate(member.lastAllotment?.start_date)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{formatDate(member.lastAllotment?.end_date)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${member.status === 'current' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {member.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{
                          member.lastAllotment?.full_day ? "Full Day (8 am - 10 pm)"
                          : (member.lastAllotment?.first_half ? "First Half (8 am - 3 pm)"
                            :( member.lastAllotment?.second_half ? "Second Half (3 pm - 10 pm)" : "-")
                            )

                        }</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => handleViewDetails(member.id)}
                        className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {members.length === 0 && (
            <div className="text-center py-4 text-gray-500">
              No members found with the selected status.
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

// CustomTopBar component that has "Create New Member" instead of "All Members"
const CustomTopBar = () => {
  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <span className="text-xl font-bold">Eklavya Library</span>
          </div>
          <div className="flex items-center space-x-4">
            <a 
              href="/member/create" 
              className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition duration-150"
            >
              Create New Member
            </a>
            <a 
              href="/admin" 
              className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition duration-150"
            >
              Admin
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AllMembersPage;