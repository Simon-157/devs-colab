import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PageNotFound from "./pages/errors/page-not-found/PageNotFound";
import Home from "./pages/home/Home";

function App() {
  return (
    <div className="App">
    <Router>
     
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path = "*" element = {<PageNotFound />} />
        </Routes>
    </Router>
  </div>
  );
}

export default App;
