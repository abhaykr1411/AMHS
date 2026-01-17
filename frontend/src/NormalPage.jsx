import React, { useState } from 'react';
import { 
  Users, Package, Wrench, Plus, Pencil, Trash2, 
  AlertCircle, Clock, ChevronDown 
} from 'lucide-react';

const NormalPage= () => {
  const [activeTab, setActiveTab] = useState('users');

  // --- Mock Data ---
  const users = [
    { id: 1, name: 'John Admin', email: 'john@company.com', role: 'Admin', groups: 2, color: '#fce4ec', text: '#d81b60' },
    { id: 2, name: 'Sarah Manager', email: 'sarah@company.com', role: 'Power User', groups: 1, color: '#e3f2fd', text: '#1976d2' },
    { id: 3, name: 'Mike User', email: 'mike@company.com', role: 'Normal User', groups: 1, color: '#e8f5e9', text: '#388e3c' },
  ];

  const inventory = [
    { id: 'WS-001', type: 'Workstation', desc: 'Dell Precision, 32GB RAM', assigned: 'User: John Admin' },
    { id: 'DT-045', type: 'Desktop', desc: 'HP EliteDesk', assigned: 'User: Mike User' },
    { id: 'SRV-01', type: 'Server', desc: 'Dell R740', assigned: 'Group: IT Department' },
    { id: 'PR-012', type: 'Printer', desc: 'HP LaserJet', assigned: 'Group: IT Department' },
  ];

  const complaints = [
    { id: 1, title: 'Monitor flickering', priority: 'High', resource: 'WS-001 (Workstation)', reporter: 'John Admin', date: '15/1/2026', status: 'Open', color: '#fff3e0', text: '#ef6c00' },
    { id: 2, title: 'Server overheating', priority: 'Critical', resource: 'SRV-01 (Server)', reporter: 'Sarah Manager', date: '15/1/2026', status: 'In Progress', color: '#ffebee', text: '#c62828' },
  ];

  return (
    <div className="container-fluid min-vh-100 bg-light p-4" style={{ fontFamily: 'sans-serif' }}>
      {/* Top Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold m-0">Enterprise Management System</h2>
        <div className="d-flex align-items-center">
          <span className="me-2 text-secondary">Logged in as: <strong className="text-dark">John Admin</strong></span>
          <span className="badge bg-secondary-subtle text-dark border px-2 py-1">Admin</span>
        </div>
      </div>

      {/* Main Navigation Buttons */}
      <div className="d-flex gap-3 mb-4">
        <button 
          onClick={() => setActiveTab('users')}
          className={`btn d-flex align-items-center gap-2 px-4 py-2 rounded-3 shadow-sm border-0 ${activeTab === 'users' ? 'btn-primary' : 'bg-white text-secondary'}`}
        >
          <Users size={20} /> Users
        </button>
        <button 
          onClick={() => setActiveTab('inventory')}
          className={`btn d-flex align-items-center gap-2 px-4 py-2 rounded-3 shadow-sm border-0 ${activeTab === 'inventory' ? 'btn-primary' : 'bg-white text-secondary'}`}
        >
          <Package size={20} /> Inventory
        </button>
        <button 
          onClick={() => setActiveTab('complaints')}
          className={`btn d-flex align-items-center gap-2 px-4 py-2 rounded-3 shadow-sm border-0 ${activeTab === 'complaints' ? 'btn-primary' : 'bg-white text-secondary'}`}
        >
          <Wrench size={20} /> AMC Complaints
        </button>
      </div>

      {/* Content Area */}
      <div className="card border-0 shadow-sm rounded-4 p-4">
        
        {/* USERS VIEW */}
        {activeTab === 'users' && (
          <>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="fw-bold mb-0">User Management</h4>
              <button className="btn btn-primary d-flex align-items-center gap-2"><Plus size={18} /> Add User</button>
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
                  {users.map(u => (
                    <tr key={u.id}>
                      <td className="fw-medium py-3">{u.name}</td>
                      <td>{u.email}</td>
                      <td><span className="badge rounded-1 px-2 py-1" style={{ backgroundColor: u.color, color: u.text }}>{u.role}</span></td>
                      <td>{u.groups} groups</td>
                      <td className="text-end">
                        <button className="btn btn-link text-primary p-1"><Pencil size={18} /></button>
                        <button className="btn btn-link text-danger p-1"><Trash2 size={18} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* INVENTORY VIEW */}
        {activeTab === 'inventory' && (
          <>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="fw-bold mb-0">Inventory Management</h4>
              <button className="btn btn-success d-flex align-items-center gap-2"><Plus size={18} /> Add Resource</button>
            </div>
            {inventory.map(item => (
              <div key={item.id} className="card mb-3 border border-light-subtle rounded-3 p-3 shadow-sm position-relative">
                <div className="d-flex justify-content-between">
                  <div>
                    <h5 className="fw-bold mb-1">{item.id}</h5>
                    <span className="badge bg-primary-subtle text-primary mb-2" style={{fontSize: '0.7rem'}}>{item.type}</span>
                    <p className="text-secondary mb-1 small">{item.desc}</p>
                    <p className="mb-0 small"><strong>Assigned to:</strong> <span className="text-secondary">{item.assigned}</span></p>
                  </div>
                  <div className="d-flex gap-2">
                    <button className="btn btn-link text-primary p-0"><Pencil size={18} /></button>
                    <button className="btn btn-link text-danger p-0"><Trash2 size={18} /></button>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}

        {/* COMPLAINTS VIEW */}
        {activeTab === 'complaints' && (
          <>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="fw-bold mb-0">AMC Complaints</h4>
              <button className="btn btn-warning text-white fw-bold d-flex align-items-center gap-2" style={{backgroundColor: '#e65100'}}>
                <Plus size={18} /> Log Complaint
              </button>
            </div>
            {complaints.map(c => (
              <div key={c.id} className="card mb-3 border border-light-subtle rounded-3 p-3 shadow-sm">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-start gap-3">
                    {c.id === 1 ? <AlertCircle className="text-danger mt-1" /> : <Clock className="text-warning mt-1" />}
                    <div>
                      <h5 className="fw-bold mb-1 d-flex align-items-center gap-2">
                        Complaint #{c.id} 
                        <span className="badge rounded-1" style={{backgroundColor: c.color, color: c.text, fontSize: '0.65rem'}}>{c.priority}</span>
                      </h5>
                      <p className="mb-2 text-secondary">{c.title}</p>
                      <div className="small text-secondary">
                        <div className="mb-1"><strong>Resource:</strong> {c.resource}</div>
                        <div className="mb-1"><strong>Reported by:</strong> {c.reporter}</div>
                        <div><strong>Date:</strong> {c.date}, 12:20:53 am</div>
                      </div>
                    </div>
                  </div>
                  <div className="dropdown">
                    <button className="btn btn-light border d-flex align-items-center gap-5 px-3 py-2" style={{backgroundColor: '#e9ecef'}}>
                      {c.status} <ChevronDown size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}

      </div>
    </div>
  );
};

export default NormalPage;
