import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Admin from "./pages/admin/Admin";
import Login from "./pages/auth/login/Login";
import PageNotFound from "./pages/errors/page-not-found/PageNotFound";
import Home from "./pages/home/Home";
import { HOME, LOGIN, PROBLEMS, ADMIN } from "./utils/constants";
import Problems from "./pages/problems/Problems";
import GroupEditor from "./pages/group-open-editor/GroupEditor";
import "./App.css";
import RoomCreate from "./components/video-room/RoomCreate";
import ModalContextProvider from "./contexts/roommodalContext";

function App() {
  return (
    <div className="App">
      <ModalContextProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path={HOME} element={<Home />} />
            <Route path={PROBLEMS} element={<Problems />} />
            <Route path={ADMIN} element={<Admin />} />
            <Route path={LOGIN} element={<Login />} />
            {/* <Route path = {GROUP} element= {<GroupEditor />} /> */}
            <Route path="/problems/:roomId" element={<GroupEditor />} />
            <Route path="/collab/:roomId" element={<RoomCreate />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Router>
      </ModalContextProvider>
    </div>
  );
}

export default App;
