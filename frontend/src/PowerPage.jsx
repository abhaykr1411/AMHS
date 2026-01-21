import { useState, useEffect } from "react";
import { User, Package, Users, Layers, ArrowRight } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NormalPage from "./NormalPage"; // We can reuse components or logic, but for clarity I'll write it out independently or use Tabs.

const API = "http://localhost:5000/api";

const PowerPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard"); // 'dashboard' or 'manage'
  
  const [currentUser, setCurrentUser] = useState(null);
  
  // Data for Management
  const [allUsers, setAllUsers] = useState([]);
  const [allGroups, setAllGroups] = useState([]);
  const [allInventory, setAllInventory] = useState([]);
  
  // Assignment States
  const [assignGroupData, setAssignGroupData] = useState({ user_id: "", group_id: "" });
  const [editResource, setEditResource] = useState(null); // For assigning resources
  const [assignResourceData, setAssignResourceData] = useState({ assigned_user_id: "", assigned_group_id: "" });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/");
      return;
    }
    setCurrentUser(JSON.parse(storedUser));
    loadManageData();
  }, [navigate]);

  const loadManageData = () => {
    axios.get(`${API}/users`).then(res => setAllUsers(res.data));
    axios.get(`${API}/groups`).then(res => setAllGroups(res.data));
    axios.get(`${API}/resources`).then(res => setAllInventory(res.data));
  };

  // --- ACTIONS ---

  const handleAssignGroup = async () => {
    if(!assignGroupData.user_id || !assignGroupData.group_id) return alert("Select both user and group");
    
    try {
      await axios.post(`${API}/groups/assign`, assignGroupData);
      alert("User assigned to group successfully!");
      setAssignGroupData({ user_id: "", group_id: "" });
    } catch (err) {
      alert("Failed to assign group");
    }
  };

  const openResourceAssign = (item) => {
    setEditResource(item);
    setAssignResourceData({
      assigned_user_id: item.assigned_user_id || "",
      assigned_group_id: item.assigned_group_id || ""
    });
  };

  const handleAssignResource = async () => {
    try {
      await axios.put(`${API}/resources/assign/${editResource.id}`, {
        assigned_user_id: assignResourceData.assigned_user_id || null,
        assigned_group_id: assignResourceData.assigned_group_id || null
      });
      alert("Resource reassigned successfully!");
      loadManageData(); // Refresh list
    } catch (err) {
      alert("Failed to assign resource");
    }
  };

  const handleUnassignResource = async () => {
    try {
      await axios.put(`${API}/resources/unassign/${editResource.id}`);
      alert("Resource unassigned!");
      loadManageData();
    } catch (err) {
      alert("Failed");
    }
  };

  if (!currentUser) return <div>Loading...</div>;

  return (
    <div className="container-fluid min-vh-100 bg-light p-4">
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold">Power Console</h3>
          <span className="badge bg-warning text-dark">Power User</span>
        </div>
        <button onClick={() => { localStorage.clear(); navigate('/'); }} className="btn btn-outline-danger btn-sm">Logout</button>
      </div>

      {/* TABS */}
      <ul className="nav nav-pills mb-4">
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
            My Dashboard
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === 'manage' ? 'active' : ''}`} onClick={() => setActiveTab('manage')}>
            Management Console
          </button>
        </li>
      </ul>

      {/* TAB CONTENT */}
      {activeTab === 'dashboard' ? (
        // Reusing the Logic of Normal Page (visualized here)
        <NormalPage />
      ) : (
        <div className="row">
          
          {/* 1. ASSIGN GROUPS CARD */}
          <div className="col-md-4 mb-4">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-header bg-white fw-bold">
                <Users size={18} className="me-2"/> Assign User to Group
              </div>
              <div className="card-body">
                <label className="form-label">Select User</label>
                <select className="form-select mb-3" value={assignGroupData.user_id} onChange={e => setAssignGroupData({...assignGroupData, user_id: e.target.value})}>
                  <option value="">-- Select User --</option>
                  {allUsers.map(u => <option key={u.id} value={u.id}>{u.full_name} ({u.username})</option>)}
                </select>

                <label className="form-label">Select Group</label>
                <select className="form-select mb-3" value={assignGroupData.group_id} onChange={e => setAssignGroupData({...assignGroupData, group_id: e.target.value})}>
                  <option value="">-- Select Group --</option>
                  {allGroups.map(g => <option key={g.id} value={g.id}>{g.group_name}</option>)}
                </select>

                <button className="btn btn-primary w-100" onClick={handleAssignGroup}>
                  Assign Group <ArrowRight size={16}/>
                </button>
              </div>
            </div>
          </div>

          {/* 2. MANAGE INVENTORY CARD */}
          <div className="col-md-8">
            <div className="card shadow-sm border-0">
              <div className="card-header bg-white fw-bold">
                <Layers size={18} className="me-2"/> Manage Inventory Assignments
              </div>
              <div className="card-body">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Code</th>
                      <th>Current Assignment</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allInventory.map(item => (
                      <tr key={item.id}>
                        <td className="fw-bold">{item.resource_code}</td>
                        <td>
                          {item.assigned_user && <span className="badge bg-info me-1">User: {item.assigned_user}</span>}
                          {item.assigned_group && <span className="badge bg-secondary">Group: {item.assigned_group}</span>}
                          {!item.assigned_user && !item.assigned_group && <span className="text-muted small">Unassigned</span>}
                        </td>
                        <td>
                          <button 
                            className="btn btn-sm btn-outline-primary" 
                            data-bs-toggle="modal" 
                            data-bs-target="#assignResourceModal"
                            onClick={() => openResourceAssign(item)}
                          >
                            Assign
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ASSIGN RESOURCE MODAL */}
      <div className="modal fade" id="assignResourceModal">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5>Assign: {editResource?.resource_code}</h5>
              <button className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <p className="text-muted small">Assign to a User OR a Group (or both/neither)</p>
              
              <label>Assign to User</label>
              <select className="form-control mb-3" value={assignResourceData.assigned_user_id} onChange={e => setAssignResourceData({...assignResourceData, assigned_user_id: e.target.value})}>
                <option value="">-- None --</option>
                {allUsers.map(u => <option key={u.id} value={u.id}>{u.full_name}</option>)}
              </select>

              <label>Assign to Group</label>
              <select className="form-control mb-3" value={assignResourceData.assigned_group_id} onChange={e => setAssignResourceData({...assignResourceData, assigned_group_id: e.target.value})}>
                <option value="">-- None --</option>
                {allGroups.map(g => <option key={g.id} value={g.id}>{g.group_name}</option>)}
              </select>
            </div>
            <div className="modal-footer justify-content-between">
              <button className="btn btn-outline-danger" data-bs-dismiss="modal" onClick={handleUnassignResource}>Unassign All</button>
              <div>
                <button className="btn btn-secondary me-2" data-bs-dismiss="modal">Cancel</button>
                <button className="btn btn-primary" data-bs-dismiss="modal" onClick={handleAssignResource}>Save Assignment</button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default PowerPage;