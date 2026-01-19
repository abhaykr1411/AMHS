const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  const sql = `
    SELECT users.*, roles.role_name 
    FROM users 
    JOIN roles ON users.role_id = roles.id 
    WHERE username = ? AND password = ?
  `;

  db.query(sql, [username, password], (err, result) => {
    if (err) return res.status(500).json({ success: false });

    if (result.length === 0)
      return res.json({ success: false });

    const user = result[0];

    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        role: user.role_name
      }
    });
  });
});

app.get('/api/users', (req, res) => {
  const sql = `
    SELECT users.id, users.username, users.full_name, roles.role_name 
    FROM users 
    JOIN roles ON users.role_id = roles.id
  `;
  
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

app.post('/api/users', (req, res) => {
  const { username, password, full_name, role_id } = req.body;

  const sql = `
    INSERT INTO users (username,password,full_name,role_id)
    VALUES (?,?,?,?)
  `;

  db.query(sql, [username,password,full_name,role_id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ success:true, message:"User created" });
  });
});

app.delete('/api/users/:id', (req,res)=>{
  const sql = "DELETE FROM users WHERE id=?";
  db.query(sql,[req.params.id],(err,result)=>{
    if(err) return res.status(500).json(err);
    res.json({success:true});
  });
});

app.put('/api/users/:id', (req,res)=>{
  const { full_name, role_id } = req.body;
  
  const sql = `
    UPDATE users 
    SET full_name=?, role_id=?
    WHERE id=?
  `;
  
  db.query(sql,[full_name, role_id, req.params.id],(err)=>{
    if(err) return res.status(500).json(err);
    res.json({success:true});
  });
});

app.get('/api/groups', (req, res) => {
  db.query("SELECT * FROM project_groups", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

app.post('/api/groups', (req, res) => {
  const { group_name } = req.body;
  db.query(
    "INSERT INTO project_groups (group_name) VALUES (?)",
    [group_name],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ success: true });
    }
  );
});

app.post('/api/groups/assign', (req, res) => {
  const { user_id, group_id } = req.body;
  db.query(
    "INSERT INTO user_groups (user_id, group_id) VALUES (?,?)",
    [user_id, group_id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ success: true });
    }
  );
});

app.get('/api/groups/:id/users', (req, res) => {
  const sql = `
    SELECT users.id, users.full_name, users.username
    FROM user_groups
    JOIN users ON user_groups.user_id = users.id
    WHERE user_groups.group_id = ?
  `;
  db.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

app.get('/api/resource-types', (req,res)=>{
  db.query("SELECT * FROM resource_types", (err,result)=>{
    if(err) return res.status(500).json(err);
    res.json(result);
  });
});

app.get('/api/resources', (req,res)=>{
  const sql = `
    SELECT r.id, r.resource_code, r.description,
           rt.type_name,
           u.full_name AS assigned_user,
           pg.group_name AS assigned_group
    FROM resources r
    JOIN resource_types rt ON r.resource_type_id = rt.id
    LEFT JOIN users u ON r.assigned_user_id = u.id
    LEFT JOIN project_groups pg ON r.assigned_group_id = pg.id
  `;
  
  db.query(sql,(err,result)=>{
    if(err) return res.status(500).json(err);
    res.json(result);
  });
});

app.post('/api/resources', (req,res)=>{
  const { resource_code, resource_type_id, description } = req.body;
  
  const sql = `
    INSERT INTO resources (resource_code,resource_type_id,description)
    VALUES (?,?,?)
  `;
  
  db.query(sql,[resource_code,resource_type_id,description],(err)=>{
    if(err) return res.status(500).json(err);
    res.json({success:true});
  });
});

app.put('/api/resources/assign/:id', (req,res)=>{
  const { assigned_user_id, assigned_group_id } = req.body;
  
  const sql = `
    UPDATE resources
    SET assigned_user_id=?, assigned_group_id=?
    WHERE id=?
  `;
  
  db.query(sql,[assigned_user_id,assigned_group_id,req.params.id],(err)=>{
    if(err) return res.status(500).json(err);
    res.json({success:true});
  });
});

app.put('/api/resources/unassign/:id', (req,res)=>{
  const sql = `
    UPDATE resources
    SET assigned_user_id=NULL, assigned_group_id=NULL
    WHERE id=?
  `;
  db.query(sql,[req.params.id],(err)=>{
    if(err) return res.status(500).json(err);
    res.json({success:true});
  });
});

app.get('/api/complaints', (req,res)=>{
  const sql = `
    SELECT c.id, c.title, c.description, c.status, c.created_at,
           r.resource_code,
           u.full_name AS raised_by,
           pg.group_name
    FROM complaints c
    JOIN resources r ON c.resource_id = r.id
    JOIN users u ON c.raised_by = u.id
    JOIN project_groups pg ON c.group_id = pg.id
    ORDER BY c.created_at DESC
  `;
  
  db.query(sql,(err,result)=>{
    if(err) return res.status(500).json(err);
    res.json(result);
  });
});

app.post('/api/complaints', (req,res)=>{
  const { resource_id, raised_by, group_id, title, description } = req.body;
  
  const sql = `
    INSERT INTO complaints (resource_id, raised_by, group_id, title, description)
    VALUES (?,?,?,?,?)
  `;
  
  db.query(sql,[resource_id,raised_by,group_id,title,description],(err)=>{
    if(err) return res.status(500).json(err);
    res.json({success:true});
  });
});

app.put('/api/complaints/:id', (req,res)=>{
  const { status } = req.body;
  
  const sql = `
    UPDATE complaints
    SET status=?
    WHERE id=?
  `;
  
  db.query(sql,[status,req.params.id],(err)=>{
    if(err) return res.status(500).json(err);
    res.json({success:true});
  });
});



app.listen(5000, () => {
  console.log("Server running on port 5000");
});
