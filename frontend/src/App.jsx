import Login from "./login";
import {BrowserRouter, Routers, Route, Routes} from 'react-router-dom';
import EnterpriseSystem from "./AdminPage";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login/>}></Route>
          <Route path="/adminpage" element={<EnterpriseSystem/>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
