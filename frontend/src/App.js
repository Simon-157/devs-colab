import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Register from "./pages/auth/register/Register";
import Login from "./pages/auth/login/Login";
import PageNotFound from "./pages/errors/page-not-found/PageNotFound";
import Home from "./pages/home/Home";
import { GROUP, HOME, LOGIN, PROBLEMS, REGISTER } from "./utils/constants";
import Problems from "./pages/problems/Problems";
import GroupEditor from "./pages/group-open-editor/GroupEditor";
import './App.css'
import RoomCreate from "./components/video-room/RoomCreate";

function App() {
  return (
    <div className="App">

    <Router>
        <Navbar />
        <Routes>
          <Route path={HOME} element={<Home />} />
          <Route path={PROBLEMS} element={<Problems />} />
          <Route path={REGISTER} element={<Register />} />
          <Route path={LOGIN} element={<Login />} />
          {/* <Route path = {GROUP} element= {<GroupEditor />} /> */}
          <Route path="/problems/:roomId" element={<GroupEditor />} />
          <Route path="/collab/:roomId" element={<RoomCreate />} />
          <Route path = "*" element = {<PageNotFound />} />
        </Routes>
    </Router>
  </div>
  );
}

export default App;
