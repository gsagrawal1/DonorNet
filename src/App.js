import DonorRegistration from "./pages/BloodDonationForm";
import Dashboard from "./pages/Dashboard";
import { HashRouter, Routes, Route } from "react-router-dom";
function App() {
  return (
    <div>
    <Routes>
      <Route path='/' element={<DonorRegistration />} />
      <Route path='/dashboard' element={<Dashboard />} />
    </Routes>
    </div>
  );
}

export default App;

