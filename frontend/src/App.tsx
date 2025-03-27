import { BrowserRouter, Route, Routes } from "react-router-dom"
import MemberCreationPage from "./pages/MemberCreation"
import AllMembersPage from "./pages/AllMembersPage"
import MemberDetailsPage from "./pages/MemberDetailsPage"
import AllotmentCreationPage from "./pages/AllotmentCreationPage"
import MemberUpdationPage from "./pages/MemberUpdationPage"


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/member/create" element={<MemberCreationPage />} />
        <Route path="/member/update/:id" element={<MemberUpdationPage />} />
        <Route path="/member/all" element={<AllMembersPage />} />
        <Route path="/member/:id" element={<MemberDetailsPage />} />
        <Route path="/member/allotment" element={<AllotmentCreationPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
