const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());


app.post('/api/login', async (req, res) => {
    const {username, password} = req.body;

    try{
        const [users] = await db.query(
            'SELECT id, username, role, group_id FROM users WHERE username = ? AND password = ?', [username, password]
        );

        if (users.length > 0){
            res.json({success: true, user: users[0]});
        }else{
            res.status(401).json({success: false, message: "Invalid username or password"});
        }
    }catch(err) {
        res.status(500).json({error: err.message});
    }
});
// app.post('/', async (req, res) => {
//     const {username, password} = req.body;

// });

// app.get('/api/resources', async (req, res) => {
//     try{
//         const [rows] = await db.query('SELECT * FROM resources');
//         res.json(rows);
//     } catch (err){
//         res.status(500).json({error: err.message});
//     }
// });

// app.post('/api/resources', async (req, res) => {
//     const {resource_type, serial_number, group_id} = req.body;
//     try{
//         const [result] =  await db.query(
//             'INSERT INTO resources (resource_type, serial_number, assigned_group_id) VALUES (?, ?, ?)', [resource_type, serial_number, group_id]
//         );
//         res.status(201).json({id: result.insertId, message: "Resources added!"});
//     } catch (err){
//         res.status(500).json({error: err.message});
//     }
// });

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
})