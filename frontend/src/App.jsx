import Login from "./login";
import {BrowserRouter, Routers, Route, Routes} from 'react-router-dom';
import PowerPage from "./PowerPage";
import NormalPage from "./NormalPage";
import AdminPage from "./AdminPage";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login/>}></Route>
          <Route path="/adminpage" element={<AdminPage/>}></Route>
          <Route path="/powerpage" element={<PowerPage/>}></Route>
          <Route path="/userpage" element={<NormalPage/>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
