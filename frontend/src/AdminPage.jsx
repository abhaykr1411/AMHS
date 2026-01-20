import { useState, useEffect } from "react";
import {
  Users,
  Package,
  Wrench,
  Plus,
  Pencil,
  Trash2,
  Layers
} from "lucide-react";
import axios from "axios";

const API = "http://localhost:5000/api";

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("users");

  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [selectedGroupUsers, setSelectedGroupUsers] = useState([]);

  const [editUser, setEditUser] = useState(null);

  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    full_name: "",
    role_id: 3,
    group_ids: [],
  });

  // ---------------- LOAD INITIAL DATA ----------------
  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    axios.get(`${API}/users`)
      .then(res => setUsers(res.data))
      .catch(err => console.error("Error loading users:", err));
    
    axios.get(`${API}/groups`)
      .then(res => setGroups(res.data))
      .catch(err => console.error("Error loading groups:", err));
    
    axios.get(`${API}/resources`)
      .then(res => setInventory(res.data))
      .catch(err => console.error("Error loading inventory:", err));
    
    axios.get(`${API}/complaints`)
      .then(res => setComplaints(res.data))
      .catch(err => console.error("Error loading complaints:", err));
  };

  // ---------------- USER CRUD ----------------

  const handleNewUserInput = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleNewUserGroups = (e) => {
    const values = Array.from(e.target.selectedOptions).map(o => o.value);
    setNewUser({ ...newUser, group_ids: values });
  };

  const createUser = async () => {
    try {
      const res = await axios.post(`${API}/users`, newUser);
      const newUserId = res.data.insertId;

      // Assign groups
      const groupPromises = newUser.group_ids.map(gid => 
        axios.post(`${API}/groups/assign`, {
          user_id: newUserId,
          group_id: gid
        })
      );
      
      await Promise.all(groupPromises);
      
      // Reload users
      const usersRes = await axios.get(`${API}/users`);
      setUsers(usersRes.data);
      
      // Reset form
      setNewUser({
        username: "",
        password: "",
        full_name: "",
        role_id: 3,
        group_ids: [],
      });
      
      alert("User created successfully!");
    } catch (err) {
      console.error("Error creating user:", err);
      alert("Failed to create user");
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    
    try {
      await axios.delete(`${API}/users/${id}`);
      const res = await axios.get(`${API}/users`);
      setUsers(res.data);
      alert("User deleted successfully!");
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Failed to delete user");
    }
  };

  // Load groups of selected user when clicking edit
  const openEditUser = async (u) => {
    // FIXED: Properly get role_id from database
    const roleMap = {
      'admin': 1,
      'power_user': 2,
      'normal_user': 3
    };
    
    setEditUser({ 
      ...u, 
      role_id: roleMap[u.role_name] || 3,
      group_ids: [],
      password: "" 
    });

    try {
      const res = await axios.get(`${API}/user-groups/${u.id}`);
      const gids = res.data.map(g => String(g.group_id));
      setEditUser(prev => ({ ...prev, group_ids: gids }));
    } catch (err) {
      console.error("Error loading user groups:", err);
    }
  };

  const handleEditUserGroups = (e) => {
    const values = Array.from(e.target.selectedOptions).map(o => o.value);
    setEditUser({ ...editUser, group_ids: values });
  };

  const updateUser = async () => {
    try {
      // Update user basic info
      await axios.put(`${API}/users/${editUser.id}`, {
        full_name: editUser.full_name,
        role_id: editUser.role_id,
        password: editUser.password || ""
      });

      // Clear old group mappings
      await axios.delete(`${API}/user-groups/${editUser.id}`);

      // Assign new groups
      const groupPromises = editUser.group_ids.map(gid => 
        axios.post(`${API}/groups/assign`, {
          user_id: editUser.id,
          group_id: gid
        })
      );
      
      await Promise.all(groupPromises);

      // Reload users
      const res = await axios.get(`${API}/users`);
      setUsers(res.data);
      
      alert("User updated successfully!");
    } catch (err) {
      console.error("Error updating user:", err);
      alert("Failed to update user");
    }
  };

  // ---------------- GROUP MEMBERS ----------------

  const loadGroupMembers = (gid) => {
    axios.get(`${API}/groups/${gid}/users`)
      .then(res => setSelectedGroupUsers(res.data))
      .catch(err => console.error("Error loading group members:", err));
  };

  // ---------------- UI ----------------

  return (
    <div className="container-fluid min-vh-100 bg-light p-4">

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold">AMHS - Admin Panel</h3>
        <span className="badge bg-dark">Admin</span>
      </div>

      {/* NAV TABS */}
      <div className="d-flex gap-3 mb-4">
        <button onClick={()=>setActiveTab("users")} className={`btn ${activeTab==="users"?"btn-primary":"bg-white"}`}>
          <Users size={18}/> Users
        </button>
        <button onClick={()=>setActiveTab("inventory")} className={`btn ${activeTab==="inventory"?"btn-primary":"bg-white"}`}>
          <Package size={18}/> Inventory
        </button>
        <button onClick={()=>setActiveTab("complaints")} className={`btn ${activeTab==="complaints"?"btn-primary":"bg-white"}`}>
          <Wrench size={18}/> Complaints
        </button>
        <button onClick={()=>setActiveTab("groups")} className={`btn ${activeTab==="groups"?"btn-primary":"bg-white"}`}>
          <Layers size={18}/> Groups
        </button>
      </div>

      <div className="card p-4 shadow-sm border-0">

        {/* ---------------- USERS ---------------- */}
        {activeTab==="users" && (
          <>
            <div className="d-flex justify-content-between mb-3">
              <h5>User Management</h5>
              <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addUserModal">
                <Plus size={16}/> Add User
              </button>
            </div>

            <table className="table align-middle">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Username</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td>{u.full_name}</td>
                    <td>{u.username}</td>
                    <td>{u.role_name}</td>
                    <td>
                      <button className="btn btn-link"
                        data-bs-toggle="modal"
                        data-bs-target="#editUserModal"
                        onClick={()=>openEditUser(u)}>
                        <Pencil size={18}/>
                      </button>
                      <button className="btn btn-link text-danger"
                        onClick={()=>deleteUser(u.id)}>
                        <Trash2 size={18}/>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {/* ---------------- INVENTORY ---------------- */}
        {activeTab==="inventory" && (
          <>
            <h5>Inventory</h5>
            {inventory.length === 0 ? (
              <p>No inventory items found</p>
            ) : (
              inventory.map(item=>(
                <div key={item.id} className="border rounded p-2 mb-2">
                  <b>{item.resource_code}</b> ({item.type_name})<br/>
                  {item.description}<br/>
                  User: {item.assigned_user || "Not Assigned"}<br/>
                  Group: {item.assigned_group || "Not Assigned"}
                </div>
              ))
            )}
          </>
        )}

        {/* ---------------- COMPLAINTS ---------------- */}
        {activeTab==="complaints" && (
          <>
            <h5>Complaints</h5>
            {complaints.length === 0 ? (
              <p>No complaints found</p>
            ) : (
              complaints.map(c=>(
                <div key={c.id} className="border rounded p-2 mb-2">
                  <b>#{c.id}</b> {c.title}<br/>
                  Resource: {c.resource_code}<br/>
                  Raised By: {c.raised_by}<br/>
                  Group: {c.group_name}<br/>
                  Status: {c.status}
                </div>
              ))
            )}
          </>
        )}

        {/* ---------------- GROUPS ---------------- */}
        {activeTab==="groups" && (
          <>
            <h5>Project Groups</h5>
            {groups.length === 0 ? (
              <p>No groups found</p>
            ) : (
              groups.map(g=>(
                <div key={g.id} className="border rounded p-2 mb-2 d-flex justify-content-between">
                  {g.group_name}
                  <button className="btn btn-sm btn-outline-secondary" onClick={()=>loadGroupMembers(g.id)}>
                    View Members
                  </button>
                </div>
              ))
            )}

            {selectedGroupUsers.length>0 && (
              <div className="mt-3">
                <b>Group Members</b>
                <ul>
                  {selectedGroupUsers.map(u=>(
                    <li key={u.id}>{u.full_name} ({u.username})</li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}

      </div>

      {/* ---------------- ADD USER MODAL ---------------- */}
      <div className="modal fade" id="addUserModal">
        <div className="modal-dialog">
          <div className="modal-content">

            <div className="modal-header">
              <h5>Add User</h5>
              <button className="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <div className="modal-body">
              <input 
                className="form-control mb-2" 
                placeholder="Full Name" 
                name="full_name" 
                value={newUser.full_name}
                onChange={handleNewUserInput}
              />
              <input 
                className="form-control mb-2" 
                placeholder="Username" 
                name="username" 
                value={newUser.username}
                onChange={handleNewUserInput}
              />
              <input 
                className="form-control mb-2" 
                placeholder="Password" 
                type="password" 
                name="password" 
                value={newUser.password}
                onChange={handleNewUserInput}
              />

              <select className="form-control mb-2" name="role_id" value={newUser.role_id} onChange={handleNewUserInput}>
                <option value="1">Admin</option>
                <option value="2">Power User</option>
                <option value="3">Normal User</option>
              </select>

              <label>Assign Groups</label>
              <select multiple className="form-control" value={newUser.group_ids} onChange={handleNewUserGroups}>
                {groups.map(g=>(
                  <option key={g.id} value={g.id}>{g.group_name}</option>
                ))}
              </select>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button className="btn btn-primary" data-bs-dismiss="modal" onClick={createUser}>Create</button>
            </div>

          </div>
        </div>
      </div>

      {/* ---------------- EDIT USER MODAL ---------------- */}
      <div className="modal fade" id="editUserModal">
        <div className="modal-dialog">
          <div className="modal-content">

            <div className="modal-header">
              <h5>Edit User</h5>
              <button className="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <div className="modal-body">
              <input className="form-control mb-2"
                placeholder="Full Name"
                value={editUser?.full_name || ""}
                onChange={e=>setEditUser({...editUser, full_name:e.target.value})}
              />

              <input className="form-control mb-2"
                placeholder="New Password (optional)"
                type="password"
                value={editUser?.password || ""}
                onChange={e=>setEditUser({...editUser, password:e.target.value})}
              />

              <select 
                className="form-control mb-2"
                value={editUser?.role_id || 3}
                onChange={e=>setEditUser({...editUser, role_id: parseInt(e.target.value)})}
              >
                <option value="1">Admin</option>
                <option value="2">Power User</option>
                <option value="3">Normal User</option>
              </select>

              <label>Assign Groups</label>
              <select
                multiple
                className="form-control"
                value={editUser?.group_ids || []}
                onChange={handleEditUserGroups}
              >
                {groups.map(g=>(
                  <option key={g.id} value={String(g.id)}>{g.group_name}</option>
                ))}
              </select>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button className="btn btn-primary" data-bs-dismiss="modal" onClick={updateUser}>
                Update
              </button>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
};

export default AdminPage;