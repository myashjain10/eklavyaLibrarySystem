import TopBar from '../components/TopBar';
import Footer from '../components/Footer';
import AllotmentCreationForm from '../components/AllotmentCreationForm';
import { useSearchParams } from 'react-router-dom';
import { useAllotment } from '../hooks/allotmentHooks';

const AllotmentCreationPage = () => {

  const [searchParams] = useSearchParams();
  const name = searchParams.get('name');
  const id = searchParams.get('id');
  const memberid = searchParams.get("memberid") || "";
  const method = (!id || id == "null") ? "CREATE": "UPDATE"
  const {loading, allotment} = useAllotment({ id: id || "" });
  console.log(allotment);

  if(method == "UPDATE" && loading){
    return (
      <div>Loading</div>
    )
  }
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <TopBar />

      <h1 className='text-4xl text-center font-semibold  my-4'> {name} </h1>

      <AllotmentCreationForm method={method} allotment={allotment} memberid={memberid} />

      
      <Footer />
    </div>
  );
};

export default AllotmentCreationPage;