import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from "./login";
import PowerPage from "./PowerPage";
import NormalPage from "./NormalPage";
import AdminPage from "./AdminPage";
import PrivateRoute from "./PrivateRoute"; // Import the guard

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Public Route */}
          <Route path="/" element={<Login />} />

          {/* Protected Admin Route - Only 'admin' can enter */}
          <Route 
            path="/adminpage" 
            element={
              <PrivateRoute allowedRoles={['admin']}>
                <AdminPage />
              </PrivateRoute>
            } 
          />

          {/* Protected Power User Route - 'power_user' AND 'admin' can enter */}
          <Route 
            path="/powerpage" 
            element={
              <PrivateRoute allowedRoles={['power_user', 'admin']}>
                <PowerPage />
              </PrivateRoute>
            } 
          />

          {/* Protected Normal User Route - All roles can enter (or limit to just normal_user) */}
          <Route 
            path="/userpage" 
            element={
              <PrivateRoute allowedRoles={['normal_user', 'power_user', 'admin']}>
                <NormalPage />
              </PrivateRoute>
            } 
          />

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;