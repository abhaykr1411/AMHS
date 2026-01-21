import { useState, useEffect } from "react";
import {
  Users,
  Package,
  Wrench,
  Plus,
  Pencil,
  Trash2,
  Layers,
  CheckCircle,
  XCircle
} from "lucide-react";
import axios from "axios";

const API = "http://localhost:5000/api";

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("users");

  // Data States
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [resourceTypes, setResourceTypes] = useState([]); // NEW: For dropdowns
  const [complaints, setComplaints] = useState([]);
  const [selectedGroupUsers, setSelectedGroupUsers] = useState([]);

  // Edit/Create States
  const [editUser, setEditUser] = useState(null);
  const [editGroup, setEditGroup] = useState(null);
  const [editResource, setEditResource] = useState(null);

  const [newUser, setNewUser] = useState({
    username: "", password: "", full_name: "", role_id: 3, group_ids: [],
  });
  
  const [newGroup, setNewGroup] = useState({ group_name: "" }); // NEW
  
  const [newResource, setNewResource] = useState({ // NEW
    resource_code: "", resource_type_id: 1, description: "" 
  });

  // ---------------- LOAD DATA ----------------
  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    axios.get(`${API}/users`).then(res => setUsers(res.data));
    axios.get(`${API}/groups`).then(res => setGroups(res.data));
    axios.get(`${API}/resources`).then(res => setInventory(res.data));
    axios.get(`${API}/resource-types`).then(res => setResourceTypes(res.data)); // NEW
    axios.get(`${API}/complaints`).then(res => setComplaints(res.data));
  };

  // ======================= USER OPERATIONS (Existing) =======================
  
  const handleNewUserInput = (e) => setNewUser({ ...newUser, [e.target.name]: e.target.value });
  
  const handleNewUserGroups = (e) => {
    const values = Array.from(e.target.selectedOptions).map(o => o.value);
    setNewUser({ ...newUser, group_ids: values });
  };

  const createUser = async () => {
    try {
      const res = await axios.post(`${API}/users`, newUser);
      const newUserId = res.data.insertId;
      await Promise.all(newUser.group_ids.map(gid => 
        axios.post(`${API}/groups/assign`, { user_id: newUserId, group_id: gid })
      ));
      loadData();
      setNewUser({ username: "", password: "", full_name: "", role_id: 3, group_ids: [] });
    } catch (err) { alert("Failed to create user"); }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete User?")) return;
    await axios.delete(`${API}/users/${id}`);
    loadData();
  };

  const openEditUser = async (u) => {
    const roleMap = { 'admin': 1, 'power_user': 2, 'normal_user': 3 };
    setEditUser({ 
      ...u, 
      role_id: roleMap[u.role_name] || 3,
      group_ids: [],
      password: "" 
    });
    try {
      const res = await axios.get(`${API}/user-groups/${u.id}`);
      setEditUser(prev => ({ ...prev, group_ids: res.data.map(g => String(g.group_id)) }));
    } catch (err) { console.error(err); }
  };

  const updateUser = async () => {
    await axios.put(`${API}/users/${editUser.id}`, editUser);
    await axios.delete(`${API}/user-groups/${editUser.id}`);
    await Promise.all(editUser.group_ids.map(gid => 
      axios.post(`${API}/groups/assign`, { user_id: editUser.id, group_id: gid })
    ));
    loadData();
  };

  // ======================= GROUP OPERATIONS (NEW) =======================

  const createGroup = async () => {
    await axios.post(`${API}/groups`, newGroup);
    loadData();
    setNewGroup({ group_name: "" });
  };

  const updateGroup = async () => {
    await axios.put(`${API}/groups/${editGroup.id}`, { group_name: editGroup.group_name });
    loadData();
  };

  const deleteGroup = async (id) => {
    if(!window.confirm("Delete Group? This might fail if users are assigned.")) return;
    try {
      await axios.delete(`${API}/groups/${id}`);
      loadData();
    } catch (err) { alert("Cannot delete group. Ensure it has no members/resources."); }
  };

  const loadGroupMembers = (gid) => {
    axios.get(`${API}/groups/${gid}/users`).then(res => setSelectedGroupUsers(res.data));
  };

  // ======================= INVENTORY OPERATIONS (NEW) =======================

  const createResource = async () => {
    await axios.post(`${API}/resources`, newResource);
    loadData();
    setNewResource({ resource_code: "", resource_type_id: 1, description: "" });
  };

  const updateResource = async () => {
    await axios.put(`${API}/resources/${editResource.id}`, {
      resource_code: editResource.resource_code,
      resource_type_id: editResource.resource_type_id || 1, // Default fallback
      description: editResource.description
    });
    loadData();
  };

  const deleteResource = async (id) => {
    if(!window.confirm("Delete Resource?")) return;
    await axios.delete(`${API}/resources/${id}`);
    loadData();
  };

  // ======================= COMPLAINT OPERATIONS (NEW) =======================

  const updateComplaintStatus = async (id, status) => {
    await axios.put(`${API}/complaints/${id}`, { status });
    loadData();
  };

  const deleteComplaint = async (id) => {
    if(!window.confirm("Delete Complaint record?")) return;
    await axios.delete(`${API}/complaints/${id}`);
    loadData();
  };

  // ======================= UI RENDER =======================

  return (
    <div className="container-fluid min-vh-100 bg-light p-4">
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold">AMHS - Admin Panel</h3>
        <span className="badge bg-dark">Admin</span>
      </div>

      {/* NAV TABS */}
      <div className="d-flex gap-3 mb-4">
        <button onClick={()=>setActiveTab("users")} className={`btn ${activeTab==="users"?"btn-primary":"bg-white"}`}><Users size={18}/> Users</button>
        <button onClick={()=>setActiveTab("inventory")} className={`btn ${activeTab==="inventory"?"btn-primary":"bg-white"}`}><Package size={18}/> Inventory</button>
        <button onClick={()=>setActiveTab("complaints")} className={`btn ${activeTab==="complaints"?"btn-primary":"bg-white"}`}><Wrench size={18}/> Complaints</button>
        <button onClick={()=>setActiveTab("groups")} className={`btn ${activeTab==="groups"?"btn-primary":"bg-white"}`}><Layers size={18}/> Groups</button>
      </div>

      <div className="card p-4 shadow-sm border-0">
        
        {/* ---------------- USERS TAB ---------------- */}
        {activeTab==="users" && (
          <>
            <div className="d-flex justify-content-between mb-3">
              <h5>User Management</h5>
              <button className="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#addUserModal"><Plus size={16}/> Add User</button>
            </div>
            <table className="table align-middle">
              <thead><tr><th>Name</th><th>Username</th><th>Role</th><th>Actions</th></tr></thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td>{u.full_name}</td><td>{u.username}</td><td>{u.role_name}</td>
                    <td>
                      <button className="btn btn-link p-0 me-2" data-bs-toggle="modal" data-bs-target="#editUserModal" onClick={()=>openEditUser(u)}><Pencil size={18}/></button>
                      <button className="btn btn-link text-danger p-0" onClick={()=>deleteUser(u.id)}><Trash2 size={18}/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {/* ---------------- INVENTORY TAB ---------------- */}
        {activeTab==="inventory" && (
          <>
            <div className="d-flex justify-content-between mb-3">
              <h5>Inventory Management</h5>
              <button className="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#addResourceModal"><Plus size={16}/> Add Resource</button>
            </div>
            <table className="table align-middle">
              <thead><tr><th>Code</th><th>Type</th><th>Description</th><th>Assigned</th><th>Actions</th></tr></thead>
              <tbody>
                {inventory.map(item=>(
                  <tr key={item.id}>
                    <td className="fw-bold">{item.resource_code}</td>
                    <td>{item.type_name}</td>
                    <td>{item.description}</td>
                    <td>
                      {item.assigned_user ? <span className="badge bg-info me-1">{item.assigned_user}</span> : null}
                      {item.assigned_group ? <span className="badge bg-secondary">{item.assigned_group}</span> : null}
                      {!item.assigned_user && !item.assigned_group && <span className="text-muted">Unassigned</span>}
                    </td>
                    <td>
                      <button className="btn btn-link p-0 me-2" data-bs-toggle="modal" data-bs-target="#editResourceModal" onClick={()=>setEditResource(item)}><Pencil size={18}/></button>
                      <button className="btn btn-link text-danger p-0" onClick={()=>deleteResource(item.id)}><Trash2 size={18}/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {/* ---------------- COMPLAINTS TAB ---------------- */}
        {activeTab==="complaints" && (
          <>
            <h5>Complaints</h5>
            {complaints.length === 0 ? <p>No complaints found</p> : (
              <table className="table align-middle">
                <thead><tr><th>ID</th><th>Title</th><th>Resource</th><th>Raised By</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {complaints.map(c=>(
                    <tr key={c.id}>
                      <td>#{c.id}</td>
                      <td>{c.title} <br/><small className="text-muted">{c.description}</small></td>
                      <td>{c.resource_code}</td>
                      <td>{c.raised_by} <br/><small>{c.group_name}</small></td>
                      <td>
                        <select 
                          className={`form-select form-select-sm ${c.status === 'Resolved' ? 'border-success text-success' : 'border-warning'}`}
                          value={c.status} 
                          onChange={(e)=>updateComplaintStatus(c.id, e.target.value)}
                        >
                          <option>Pending</option>
                          <option>In Progress</option>
                          <option>Resolved</option>
                        </select>
                      </td>
                      <td>
                        <button className="btn btn-link text-danger p-0" onClick={()=>deleteComplaint(c.id)}><Trash2 size={18}/></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}

        {/* ---------------- GROUPS TAB ---------------- */}
        {activeTab==="groups" && (
          <>
            <div className="d-flex justify-content-between mb-3">
              <h5>Project Groups</h5>
              <button className="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#addGroupModal"><Plus size={16}/> Add Group</button>
            </div>
            <div className="row">
              <div className="col-md-7">
                <ul className="list-group">
                  {groups.map(g=>(
                    <li key={g.id} className="list-group-item d-flex justify-content-between align-items-center">
                      {g.group_name}
                      <div>
                        <button className="btn btn-sm btn-outline-secondary me-2" onClick={()=>loadGroupMembers(g.id)}>Members</button>
                        <button className="btn btn-link p-0 me-2" data-bs-toggle="modal" data-bs-target="#editGroupModal" onClick={()=>setEditGroup(g)}><Pencil size={16}/></button>
                        <button className="btn btn-link text-danger p-0" onClick={()=>deleteGroup(g.id)}><Trash2 size={16}/></button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="col-md-5">
                <div className="card bg-light">
                  <div className="card-body">
                    <h6>Group Members Preview</h6>
                    {selectedGroupUsers.length > 0 ? (
                      <ul className="small">
                        {selectedGroupUsers.map(u => <li key={u.id}>{u.full_name} ({u.username})</li>)}
                      </ul>
                    ) : <p className="text-muted small">Select a group to see members.</p>}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ===================== MODALS ===================== */}

      {/* ADD USER MODAL (Existing) */}
      <div className="modal fade" id="addUserModal">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header"><h5>Add User</h5><button className="btn-close" data-bs-dismiss="modal"></button></div>
            <div className="modal-body">
              <input className="form-control mb-2" placeholder="Full Name" name="full_name" value={newUser.full_name} onChange={handleNewUserInput}/>
              <input className="form-control mb-2" placeholder="Username" name="username" value={newUser.username} onChange={handleNewUserInput}/>
              <input className="form-control mb-2" placeholder="Password" type="password" name="password" value={newUser.password} onChange={handleNewUserInput}/>
              <select className="form-control mb-2" name="role_id" value={newUser.role_id} onChange={handleNewUserInput}>
                <option value="1">Admin</option><option value="2">Power User</option><option value="3">Normal User</option>
              </select>
              <label>Assign Groups</label>
              <select multiple className="form-control" value={newUser.group_ids} onChange={handleNewUserGroups}>
                {groups.map(g=><option key={g.id} value={g.id}>{g.group_name}</option>)}
              </select>
            </div>
            <div className="modal-footer"><button className="btn btn-primary" data-bs-dismiss="modal" onClick={createUser}>Create</button></div>
          </div>
        </div>
      </div>

      {/* EDIT USER MODAL (Existing) */}
      <div className="modal fade" id="editUserModal">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header"><h5>Edit User</h5><button className="btn-close" data-bs-dismiss="modal"></button></div>
            <div className="modal-body">
              <input className="form-control mb-2" placeholder="Full Name" value={editUser?.full_name||""} onChange={e=>setEditUser({...editUser,full_name:e.target.value})}/>
              <input className="form-control mb-2" placeholder="New Password (optional)" type="password" value={editUser?.password||""} onChange={e=>setEditUser({...editUser,password:e.target.value})}/>
              <select className="form-control mb-2" value={editUser?.role_id||3} onChange={e=>setEditUser({...editUser,role_id:parseInt(e.target.value)})}>
                <option value="1">Admin</option><option value="2">Power User</option><option value="3">Normal User</option>
              </select>
              <label>Assign Groups</label>
              <select multiple className="form-control" value={editUser?.group_ids||[]} onChange={e=>setEditUser({...editUser, group_ids: Array.from(e.target.selectedOptions).map(o=>o.value)})}>
                {groups.map(g=><option key={g.id} value={String(g.id)}>{g.group_name}</option>)}
              </select>
            </div>
            <div className="modal-footer"><button className="btn btn-primary" data-bs-dismiss="modal" onClick={updateUser}>Update</button></div>
          </div>
        </div>
      </div>

      {/* ADD GROUP MODAL (NEW) */}
      <div className="modal fade" id="addGroupModal">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header"><h5>Add Group</h5><button className="btn-close" data-bs-dismiss="modal"></button></div>
            <div className="modal-body">
              <input className="form-control" placeholder="Group Name" value={newGroup.group_name} onChange={e=>setNewGroup({...newGroup, group_name: e.target.value})}/>
            </div>
            <div className="modal-footer"><button className="btn btn-primary" data-bs-dismiss="modal" onClick={createGroup}>Create</button></div>
          </div>
        </div>
      </div>

      {/* EDIT GROUP MODAL (NEW) */}
      <div className="modal fade" id="editGroupModal">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header"><h5>Edit Group</h5><button className="btn-close" data-bs-dismiss="modal"></button></div>
            <div className="modal-body">
              <input className="form-control" value={editGroup?.group_name||""} onChange={e=>setEditGroup({...editGroup, group_name: e.target.value})}/>
            </div>
            <div className="modal-footer"><button className="btn btn-primary" data-bs-dismiss="modal" onClick={updateGroup}>Update</button></div>
          </div>
        </div>
      </div>

      {/* ADD RESOURCE MODAL (NEW) */}
      <div className="modal fade" id="addResourceModal">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header"><h5>Add Resource</h5><button className="btn-close" data-bs-dismiss="modal"></button></div>
            <div className="modal-body">
              <input className="form-control mb-2" placeholder="Resource Code (e.g., LP-01)" value={newResource.resource_code} onChange={e=>setNewResource({...newResource, resource_code: e.target.value})}/>
              <select className="form-control mb-2" value={newResource.resource_type_id} onChange={e=>setNewResource({...newResource, resource_type_id: e.target.value})}>
                {resourceTypes.map(rt => <option key={rt.id} value={rt.id}>{rt.type_name}</option>)}
              </select>
              <textarea className="form-control" placeholder="Description" rows="3" value={newResource.description} onChange={e=>setNewResource({...newResource, description: e.target.value})}></textarea>
            </div>
            <div className="modal-footer"><button className="btn btn-primary" data-bs-dismiss="modal" onClick={createResource}>Create</button></div>
          </div>
        </div>
      </div>

      {/* EDIT RESOURCE MODAL (NEW) */}
      <div className="modal fade" id="editResourceModal">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header"><h5>Edit Resource</h5><button className="btn-close" data-bs-dismiss="modal"></button></div>
            <div className="modal-body">
              <input className="form-control mb-2" placeholder="Resource Code" value={editResource?.resource_code||""} onChange={e=>setEditResource({...editResource, resource_code: e.target.value})}/>
              <select className="form-control mb-2" value={editResource?.resource_type_id || (resourceTypes.length>0?resourceTypes[0].id : 1)} onChange={e=>setEditResource({...editResource, resource_type_id: e.target.value})}>
                {resourceTypes.map(rt => <option key={rt.id} value={rt.id}>{rt.type_name}</option>)}
              </select>
              <textarea className="form-control" rows="3" value={editResource?.description||""} onChange={e=>setEditResource({...editResource, description: e.target.value})}></textarea>
            </div>
            <div className="modal-footer"><button className="btn btn-primary" data-bs-dismiss="modal" onClick={updateResource}>Update</button></div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AdminPage;