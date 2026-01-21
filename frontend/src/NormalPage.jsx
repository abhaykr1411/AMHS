import { useState, useEffect } from "react";
import { User, Package, AlertCircle } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:5000/api";

const NormalPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [myGroups, setMyGroups] = useState([]);
  const [myInventory, setMyInventory] = useState([]);
  
  // Complaint Modal State
  const [complaintItem, setComplaintItem] = useState(null);
  const [complaintData, setComplaintData] = useState({ title: "", description: "" });

  useEffect(() => {
    // 1. Get Logged In User
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/"); // Redirect to login if no session
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);
    loadUserData(parsedUser.id);
  }, [navigate]);

  const loadUserData = async (userId) => {
    try {
      // 2. Fetch all groups and user's group assignments to match them
      const [allGroupsRes, userGroupsRes, resourcesRes] = await Promise.all([
        axios.get(`${API}/groups`),
        axios.get(`${API}/user-groups/${userId}`),
        axios.get(`${API}/resources`)
      ]);

      // Filter My Groups
      const userGroupIds = userGroupsRes.data.map(g => g.group_id);
      const myGroupsList = allGroupsRes.data.filter(g => userGroupIds.includes(g.id));
      setMyGroups(myGroupsList);

      // Filter My Inventory (Assigned to Me OR My Groups)
      const myItems = resourcesRes.data.filter(item => 
        item.assigned_user_id === userId || userGroupIds.includes(item.assigned_group_id)
      );
      setMyInventory(myItems);

    } catch (err) {
      console.error("Error loading user data:", err);
    }
  };

  const handleRaiseComplaint = async () => {
    if (!complaintItem) return;

    try {
      await axios.post(`${API}/complaints`, {
        resource_id: complaintItem.id,
        raised_by: user.id,
        group_id: complaintItem.assigned_group_id || null, // Optional if it's a personal item
        title: complaintData.title,
        description: complaintData.description
      });
      alert("Complaint submitted successfully!");
      setComplaintData({ title: "", description: "" });
      setComplaintItem(null); // Close modal logic (handled by UI state)
    } catch (err) {
      alert("Failed to raise complaint");
    }
  };

  if (!user) return <div className="p-5">Loading...</div>;

  return (
    <div className="container-fluid min-vh-100 bg-light p-4">
      
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold">Welcome, {user.username}</h3>
        <button onClick={() => { localStorage.clear(); navigate('/'); }} className="btn btn-outline-danger btn-sm">Logout</button>
      </div>

      <div className="row">
        
        {/* LEFT COLUMN: User Info & Groups */}
        <div className="col-md-4 mb-4">
          <div className="card shadow-sm border-0 mb-3">
            <div className="card-body text-center">
              <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: 60, height: 60}}>
                <User size={30}/>
              </div>
              <h5>{user.username}</h5>
              <p className="text-muted mb-0">Role: {user.role}</p>
            </div>
          </div>

          <div className="card shadow-sm border-0">
            <div className="card-header bg-white fw-bold">My Groups</div>
            <ul className="list-group list-group-flush">
              {myGroups.length === 0 ? <li className="list-group-item text-muted">No groups assigned</li> : 
                myGroups.map(g => (
                  <li key={g.id} className="list-group-item">{g.group_name}</li>
                ))
              }
            </ul>
          </div>
        </div>

        {/* RIGHT COLUMN: Inventory */}
        <div className="col-md-8">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-white fw-bold d-flex justify-content-between align-items-center">
              <span><Package size={18} className="me-2"/>My Inventory</span>
            </div>
            <div className="card-body">
              {myInventory.length === 0 ? (
                <p className="text-muted text-center py-4">No items assigned to you or your groups.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table align-middle">
                    <thead>
                      <tr>
                        <th>Asset Code</th>
                        <th>Type</th>
                        <th>Description</th>
                        <th>Assignment</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {myInventory.map(item => (
                        <tr key={item.id}>
                          <td className="fw-bold">{item.resource_code}</td>
                          <td>{item.type_name}</td>
                          <td><small>{item.description}</small></td>
                          <td>
                            {item.assigned_user_id === user.id ? 
                              <span className="badge bg-success">Personal</span> : 
                              <span className="badge bg-secondary">Group</span>
                            }
                          </td>
                          <td>
                            <button 
                              className="btn btn-sm btn-outline-warning"
                              data-bs-toggle="modal" 
                              data-bs-target="#complaintModal"
                              onClick={() => setComplaintItem(item)}
                            >
                              <AlertCircle size={16}/> Report
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* COMPLAINT MODAL */}
      <div className="modal fade" id="complaintModal">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Report Issue: {complaintItem?.resource_code}</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Issue Title</label>
                <input 
                  className="form-control" 
                  value={complaintData.title}
                  onChange={e => setComplaintData({...complaintData, title: e.target.value})}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea 
                  className="form-control" 
                  rows="3"
                  value={complaintData.description}
                  onChange={e => setComplaintData({...complaintData, description: e.target.value})}
                ></textarea>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={handleRaiseComplaint}>Submit Complaint</button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default NormalPage;