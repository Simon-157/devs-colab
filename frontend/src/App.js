import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Register from "./pages/auth/register/Register";
import Login from "./pages/auth/login/Login";
import PageNotFound from "./pages/errors/page-not-found/PageNotFound";
import Home from "./pages/home/Home";
import { HOME, LOGIN, PROBLEMS, REGISTER } from "./utils/constants";

function App() {
  return (
    <div className="App">

    <Router>
      
        <Navbar />
        <Routes>
          <Route path={HOME} element={<Home />} />
          <Route path={PROBLEMS} element={<Home />} />
          <Route path={REGISTER} element={<Register />} />
          <Route path={LOGIN} element={<Login />} />
          <Route path = "*" element = {<PageNotFound />} />
        </Routes>
    </Router>
  </div>
  );
}

export default App;
