import './App.css'
import { Routes, Route } from "react-router-dom";
import DashboardLayout from "./routes/DashboardLayout";
import Dashboard from "./routes/dashboard.route";
import HomePage from './Components/HomePage/HomePage';
import Planner from "./routes/planner.route";
import Tracker from "./routes/tracker.route";
import SignIn from "./Components/SignIn";
// import ResourceHub from "./routes/resourcehub.route";
// import Community from "./routes/community.route";
// import Aimentor from "./routes/aimentor.route";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="signin" element={<SignIn />} />
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
       
        <Route path="/planner" element={<Planner />} />
        <Route path="/tracker" element={<Tracker />} />
        {/* <Route path="/resourcehub" element={<ResourceHub />} />
        <Route path="/community" element={<Community />} />
        <Route path="/aimentor" element={<Aimentor />} /> */}
      </Route>
    </Routes>
 
  );
}

export default App;
