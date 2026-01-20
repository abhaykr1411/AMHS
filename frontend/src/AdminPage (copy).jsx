import { useState, useEffect } from "react";
import {
  Users,
  Package,
  Wrench,
  Plus,
  Pencil,
  Trash2,
  AlertCircle,
  Clock,
  ChevronDown,
} from "lucide-react";
import axios from "axios";

const AdminPage = () => {
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/resources")
      .then((res) => setInventory(res.data))
      .catch((err) => console.log(err));
  }, []);

  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/users")
      .then((res) => setUsers(res.data));
  }, []);

  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/complaints")
      .then((res) => setComplaints(res.data))
      .catch((err) => console.log(err));
  }, []);

  const [groups, setGroups] = useState([]);
  const [selectedGroupUsers, setSelectedGroupUsers] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/groups")
      .then((res) => setGroups(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div
      className="container-fluid min-vh-100 bg-light p-4"
      style={{ fontFamily: "sans-serif" }}
    >
      {/* Top Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold m-0">AMHS</h2>
        <div className="d-flex align-items-center">
          <span className="me-2 text-secondary">
            Logged in as: <strong className="text-dark">John Admin</strong>
          </span>
          <span className="badge bg-secondary-subtle text-dark border px-2 py-1">
            Admin
          </span>
        </div>
      </div>

      {/* Main Navigation Buttons */}
      <div className="d-flex gap-3 mb-4">
        <button
          onClick={() => setActiveTab("users")}
          className={`btn d-flex align-items-center gap-2 px-4 py-2 rounded-3 shadow-sm border-0 ${activeTab === "users" ? "btn-primary" : "bg-white text-secondary"}`}
        >
          <Users size={20} /> Users
        </button>
        <button
          onClick={() => setActiveTab("inventory")}
          className={`btn d-flex align-items-center gap-2 px-4 py-2 rounded-3 shadow-sm border-0 ${activeTab === "inventory" ? "btn-primary" : "bg-white text-secondary"}`}
        >
          <Package size={20} /> Inventory
        </button>
        <button
          onClick={() => setActiveTab("complaints")}
          className={`btn d-flex align-items-center gap-2 px-4 py-2 rounded-3 shadow-sm border-0 ${activeTab === "complaints" ? "btn-primary" : "bg-white text-secondary"}`}
        >
          <Wrench size={20} /> AMC Complaints
        </button>
        <button
          onClick={() => setActiveTab("groups")}
          className={`btn d-flex align-items-center gap-2 px-4 py-2 rounded-3 shadow-sm border-0 ${activeTab === "groups" ? "btn-primary" : "bg-white text-secondary"}`}
        >
          <Users size={20} /> Groups
        </button>
      </div>

      {/* Content Area */}
      <div className="card border-0 shadow-sm rounded-4 p-4">
        {/* USERS VIEW */}
        {activeTab === "users" && (
          <>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="fw-bold mb-0">User Management</h4>
              <button className="btn btn-primary d-flex align-items-center gap-2">
                <Plus size={18} /> Add User
              </button>
            </div>
            <div className="table-responsive">
              <table className="table align-middle">
                <thead className="table-light">
                  <tr className="text-secondary small text-uppercase">
                    <th className="border-0">Name</th>
                    <th className="border-0">Email</th>
                    <th className="border-0">Role</th>
                    <th className="border-0">Groups</th>
                    <th className="border-0 text-end pe-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td className="fw-medium py-3">{u.full_name}</td>
                      <td>{u.username}</td>
                      <td>
                        <span
                          className="badge rounded-1 px-2 py-1"
                          style={{ backgroundColor: u.color, color: u.text }}
                        >
                          {u.role_name}
                        </span>
                      </td>
                      <td>{u.groups} groups</td>
                      <td className="text-end">
                        <button className="btn btn-link text-primary p-1">
                          <Pencil size={18} />
                        </button>
                        <button className="btn btn-link text-danger p-1">
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* INVENTORY VIEW */}
        {activeTab === "inventory" && (
          <>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="fw-bold mb-0">Inventory Management</h4>
              <button className="btn btn-success d-flex align-items-center gap-2">
                <Plus size={18} /> Add Resource
              </button>
            </div>
            {inventory.map((item) => (
              <div
                key={item.id}
                className="card mb-3 border border-light-subtle rounded-3 p-3 shadow-sm position-relative"
              >
                <div className="d-flex justify-content-between">
                  <div>
                    <h5 className="fw-bold mb-1">{item.resource_code}</h5>
                    <span
                      className="badge bg-primary-subtle text-primary mb-2"
                      style={{ fontSize: "0.7rem" }}
                    >
                      {item.type_name}
                    </span>

                    <p className="text-secondary mb-1 small">
                      {item.description}
                    </p>

                    <p className="mb-0 small">
                      <strong>Assigned User:</strong>{" "}
                      <span className="text-secondary">
                        {item.assigned_user
                          ? item.assigned_user
                          : "Not Assigned"}
                      </span>
                    </p>

                    <p className="mb-0 small">
                      <strong>Assigned Group:</strong>{" "}
                      <span className="text-secondary">
                        {item.assigned_group
                          ? item.assigned_group
                          : "Not Assigned"}
                      </span>
                    </p>
                  </div>
                  <div className="d-flex gap-2">
                    <button className="btn btn-link text-primary p-0">
                      <Pencil size={18} />
                    </button>
                    <button className="btn btn-link text-danger p-0">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}

        {/* COMPLAINTS VIEW */}
        {activeTab === "complaints" && (
          <>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="fw-bold mb-0">AMC Complaints</h4>
              <button
                className="btn btn-warning text-white fw-bold d-flex align-items-center gap-2"
                style={{ backgroundColor: "#e65100" }}
              >
                <Plus size={18} /> Log Complaint
              </button>
            </div>
            {complaints.map((c) => (
              <div
                key={c.id}
                className="card mb-3 border border-light-subtle rounded-3 p-3 shadow-sm"
              >
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-start gap-3">
                    {c.id === 1 ? (
                      <AlertCircle className="text-danger mt-1" />
                    ) : (
                      <Clock className="text-warning mt-1" />
                    )}
                    <div>
                      <h5 className="fw-bold mb-1">Complaint #{c.id}</h5>

                      <p className="mb-2 text-secondary">{c.title}</p>

                      <div className="small text-secondary">
                        <div className="mb-1">
                          <strong>Resource:</strong> {c.resource_code}
                        </div>
                        <div className="mb-1">
                          <strong>Raised By:</strong> {c.raised_by}
                        </div>
                        <div className="mb-1">
                          <strong>Group:</strong> {c.group_name}
                        </div>
                        <div>
                          <strong>Status:</strong> {c.status}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="dropdown">
                    <button
                      className="btn btn-light border d-flex align-items-center gap-5 px-3 py-2"
                      style={{ backgroundColor: "#e9ecef" }}
                    >
                      {c.status} <ChevronDown size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}

        {activeTab === "groups" && (
          <>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="fw-bold mb-0">Project Groups</h4>
              <button className="btn btn-primary">Add Group</button>
            </div>

            {groups.map((g) => (
              <div key={g.id} className="card p-3 mb-2 shadow-sm">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">{g.group_name}</h5>
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => {
                      axios
                        .get(`http://localhost:5000/api/groups/${g.id}/users`)
                        .then((res) => setSelectedGroupUsers(res.data));
                    }}
                  >
                    View Members
                  </button>
                </div>
              </div>
            ))}

            {selectedGroupUsers.length > 0 && (
              <div className="mt-4">
                <h6>Group Members</h6>
                <ul>
                  {selectedGroupUsers.map((u) => (
                    <li key={u.id}>
                      {u.full_name} ({u.username})
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
