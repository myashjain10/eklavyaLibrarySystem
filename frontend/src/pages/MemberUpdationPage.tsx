import { useMember } from "../hooks/memberHooks";
import { useParams } from "react-router-dom";
import MemberCreationForm from "../components/MemberCreationForm";
import TopBar from "../components/TopBar";
import Footer from "../components/Footer";

const MemberUpdatePage = () =>{
  const { id } = useParams();
  const {loading, member} = useMember({ id: id || "" })

  if(!member && loading){
    return (
      <>Loading</>
    )
  }

  return(
    <>
      <div className="min-h-screen bg-gray-50 flex flex-col">
      <TopBar />
      
      <h1 className='text-4xl text-center font-semibold  my-4'> {member?.name} </h1>

      <div className="flex-grow container mx-auto py-8 px-4">
        <MemberCreationForm member={member} />
      </div>
      
      <Footer />
    </div>
    </>
  )
}

export default MemberUpdatePage;