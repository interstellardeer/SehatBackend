const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'sehat',
    port: 3306
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err);
    } else {
        console.log('Connected to MySQL database');
    }
});

// Improved database query handler
const queryDatabase = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.query(sql, params, (err, results) => {
            if (err) {
                console.error('Database Error:', err);
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};

// Error handler middleware
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next))
        .catch(error => {
            console.error('Error:', error);
            res.status(500).json({
                status: 'error',
                message: 'Internal server error',
                error: error.message
            });
        });
};

// Docs
app.use('/docs', express.static(path.join(__dirname, 'public/docs')));

// API Routes

/** Manajemen Klinik **/
app.get('/api/clinics', asyncHandler(async (req, res) => {
    const results = await queryDatabase('SELECT * FROM Klinik');
    res.json(results);
}));

app.post('/api/clinics', asyncHandler(async (req, res) => {
    const { Nama, Lokasi, Telepon, Jam_Operasional } = req.body;
    const results = await queryDatabase(
        'INSERT INTO Klinik (Nama, Lokasi, Telepon, Jam_Operasional) VALUES (?, ?, ?, ?)',
        [Nama, Lokasi, Telepon, Jam_Operasional]
    );
    res.status(201).json({ id: results.insertId, ...req.body });
}));

app.put('/api/clinics/:id', asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { Nama, Lokasi, Telepon, Jam_Operasional } = req.body;
    await queryDatabase(
        'UPDATE Klinik SET Nama = ?, Lokasi = ?, Telepon = ?, Jam_Operasional = ? WHERE id_klinik = ?',
        [Nama, Lokasi, Telepon, Jam_Operasional, id]
    );
    res.json({ id, ...req.body });
}));

app.delete('/api/clinics/:id', asyncHandler(async (req, res) => {
    const { id } = req.params;
    await queryDatabase('DELETE FROM Klinik WHERE id_klinik = ?', [id]);
    res.json({ message: 'Clinic deleted successfully' });
}));

/** Manajemen Pasien **/
app.get('/api/clinics/:klinik_id/patients/search', asyncHandler(async (req, res) => {
    const { klinik_id } = req.params;
    const { keyword } = req.query;
    const likeKeyword = `%${keyword}%`;
    
    const results = await queryDatabase(
        `SELECT DISTINCT p.* 
         FROM pasien p
         INNER JOIN riwayat_kunjungan rk ON p.id_pasien = rk.pasien_id 
         WHERE rk.klinik_id = ? 
         AND (p.Nama LIKE ? OR p.Email LIKE ? OR p.No_Telepon LIKE ?)`,
        [klinik_id, likeKeyword, likeKeyword, likeKeyword]
    );
    res.json(results);
}));

app.get('/api/patients', asyncHandler(async (req, res) => {
    const results = await queryDatabase('SELECT * FROM Pasien');
    res.json(results);
}));

app.get('/api/patients/search', asyncHandler(async (req, res) => {
    const { keyword } = req.query;
    const results = await queryDatabase(
        'SELECT * FROM Pasien WHERE Nama LIKE ? OR Email LIKE ? OR No_Telepon LIKE ?',
        [`%${keyword}%`, `%${keyword}%`, `%${keyword}%`]
    );
    res.json(results);
}));

// Authentication routes
const secretKey = 'your-secret-key'; // Replace with secure key in production

app.post('/api/auth/login', asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    const results = await queryDatabase(
        'SELECT * FROM Pengguna WHERE Email = ? AND Kata_Sandi = ?',
        [email, password]
    );

    if (results.length === 0) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = results[0];
    const token = jwt.sign(
        { id: user.id_pengguna, role: user.Peran },
        secretKey,
        { expiresIn: '1h' }
    );

    res.json({
        message: 'Login successful',
        token,
        user: { id: user.id_pengguna, email: user.Email, role: user.Peran }
    });
}));
// Previous code remains the same...

/** Manajemen Pasien (continued) **/
app.post('/api/patients', asyncHandler(async (req, res) => {
    const { Nama, Tanggal_Lahir, Jenis_Kelamin, Alamat, No_Telepon, Email } = req.body;
    const results = await queryDatabase(
        'INSERT INTO Pasien (Nama, Tanggal_Lahir, Jenis_Kelamin, Alamat, No_Telepon, Email) VALUES (?, ?, ?, ?, ?, ?)',
        [Nama, Tanggal_Lahir, Jenis_Kelamin, Alamat, No_Telepon, Email]
    );
    res.status(201).json({ id: results.insertId, ...req.body });
}));

app.put('/api/patients/:id', asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { Nama, Tanggal_Lahir, Jenis_Kelamin, Alamat, No_Telepon, Email } = req.body;
    await queryDatabase(
        'UPDATE Pasien SET Nama = ?, Tanggal_Lahir = ?, Jenis_Kelamin = ?, Alamat = ?, No_Telepon = ?, Email = ? WHERE id_pasien = ?',
        [Nama, Tanggal_Lahir, Jenis_Kelamin, Alamat, No_Telepon, Email, id]
    );
    res.json({ id, ...req.body });
}));

app.delete('/api/patients/:id', asyncHandler(async (req, res) => {
    const { id } = req.params;
    await queryDatabase('DELETE FROM Pasien WHERE id_pasien = ?', [id]);
    res.json({ message: 'Patient deleted successfully' });
}));

/** Manajemen Tenaga Kesehatan (Nakes) **/
app.get('/api/nakes', asyncHandler(async (req, res) => {
    const results = await queryDatabase('SELECT * FROM Nakes');
    res.json(results);
}));

app.get('/api/nakes/search', asyncHandler(async (req, res) => {
    const { keyword } = req.query;
    const results = await queryDatabase(
        'SELECT * FROM Nakes WHERE Nama LIKE ? OR Spesialisasi LIKE ?',
        [`%${keyword}%`, `%${keyword}%`]
    );
    res.json(results);
}));

app.get('/api/clinics/:klinik_id/nakes', asyncHandler(async (req, res) => {
    const { klinik_id } = req.params;
    const results = await queryDatabase('SELECT * FROM Nakes WHERE klinik_id = ?', [klinik_id]);
    res.json(results);
}));

app.post('/api/nakes', asyncHandler(async (req, res) => {
    const { Nama, Spesialisasi, Nomor_STR, Jenis_Kelamin, Telepon, Email, klinik_id } = req.body;
    const results = await queryDatabase(
        'INSERT INTO Nakes (Nama, Spesialisasi, Nomor_STR, Jenis_Kelamin, Telepon, Email, klinik_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [Nama, Spesialisasi, Nomor_STR, Jenis_Kelamin, Telepon, Email, klinik_id]
    );
    res.status(201).json({ id: results.insertId, ...req.body });
}));

app.put('/api/nakes/:id', asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { Nama, Spesialisasi, Nomor_STR, Jenis_Kelamin, Telepon, Email, klinik_id } = req.body;
    await queryDatabase(
        'UPDATE Nakes SET Nama = ?, Spesialisasi = ?, Nomor_STR = ?, Jenis_Kelamin = ?, Telepon = ?, Email = ?, klinik_id = ? WHERE id_nakes = ?',
        [Nama, Spesialisasi, Nomor_STR, Jenis_Kelamin, Telepon, Email, klinik_id, id]
    );
    res.json({ id, ...req.body });
}));

app.delete('/api/nakes/:id', asyncHandler(async (req, res) => {
    const { id } = req.params;
    await queryDatabase('DELETE FROM Nakes WHERE id_nakes = ?', [id]);
    res.json({ message: 'Healthcare professional deleted successfully' });
}));

/** Manajemen Riwayat Kunjungan **/
app.get('/api/visits', asyncHandler(async (req, res) => {
    const results = await queryDatabase('SELECT * FROM Riwayat_Kunjungan');
    res.json(results);
}));

app.get('/api/clinics/:klinik_id/visits', asyncHandler(async (req, res) => {
    const { klinik_id } = req.params;
    const results = await queryDatabase('SELECT * FROM Riwayat_Kunjungan WHERE klinik_id = ?', [klinik_id]);
    res.json(results);
}));

app.get('/api/patients/:pasien_id/visits', asyncHandler(async (req, res) => {
    const { pasien_id } = req.params;
    const results = await queryDatabase('SELECT * FROM Riwayat_Kunjungan WHERE pasien_id = ?', [pasien_id]);
    res.json(results);
}));

app.post('/api/visits', asyncHandler(async (req, res) => {
    const { pasien_id, nakes_id, Tanggal_Kunjungan, Keluhan, Diagnosa, klinik_id } = req.body;
    const results = await queryDatabase(
        'INSERT INTO Riwayat_Kunjungan (pasien_id, nakes_id, Tanggal_Kunjungan, Keluhan, Diagnosa, klinik_id) VALUES (?, ?, ?, ?, ?, ?)',
        [pasien_id, nakes_id, Tanggal_Kunjungan, Keluhan, Diagnosa, klinik_id]
    );
    res.status(201).json({ id: results.insertId, ...req.body });
}));

/** Manajemen Rekam Medis **/
app.get('/api/medical-records', asyncHandler(async (req, res) => {
    const results = await queryDatabase('SELECT * FROM Rekam_Medis');
    res.json(results);
}));

app.get('/api/clinics/:klinik_id/medical-records', asyncHandler(async (req, res) => {
    const { klinik_id } = req.params;
    const results = await queryDatabase(
        `SELECT rm.* FROM Rekam_Medis rm 
         JOIN Riwayat_Kunjungan rk ON rm.kunjungan_id = rk.id_kunjungan 
         WHERE rk.klinik_id = ?`,
        [klinik_id]
    );
    res.json(results);
}));

app.get('/api/patients/:pasien_id/medical-records', asyncHandler(async (req, res) => {
    const { pasien_id } = req.params;
    const results = await queryDatabase(
        `SELECT rm.* FROM Rekam_Medis rm
         JOIN Riwayat_Kunjungan rk ON rm.kunjungan_id = rk.id_kunjungan
         WHERE rk.pasien_id = ?`,
        [pasien_id]
    );
    res.json(results);
}));

app.post('/api/medical-records', asyncHandler(async (req, res) => {
    const { kunjungan_id, Detail_Rekam_Medis } = req.body;
    const results = await queryDatabase(
        'INSERT INTO Rekam_Medis (kunjungan_id, Detail_Rekam_Medis) VALUES (?, ?)',
        [kunjungan_id, Detail_Rekam_Medis]
    );
    res.status(201).json({ id: results.insertId, ...req.body });
}));

/** Manajemen Obat **/
app.get('/api/medications', asyncHandler(async (req, res) => {
    const results = await queryDatabase('SELECT * FROM Obat');
    res.json(results);
}));

app.post('/api/medications', asyncHandler(async (req, res) => {
    const { Nama_Obat, Jenis_Obat, Harga, Stok, Keterangan } = req.body;
    const results = await queryDatabase(
        'INSERT INTO Obat (Nama_Obat, Jenis_Obat, Harga, Stok, Keterangan) VALUES (?, ?, ?, ?, ?)',
        [Nama_Obat, Jenis_Obat, Harga, Stok, Keterangan]
    );
    res.status(201).json({ id: results.insertId, ...req.body });
}));

/** Manajemen Janji Temu **/
app.get('/api/appointments', asyncHandler(async (req, res) => {
    const results = await queryDatabase('SELECT * FROM Janji_Temu');
    res.json(results);
}));

app.post('/api/appointments', asyncHandler(async (req, res) => {
    const { pasien_id, nakes_id, Tanggal_Janji, Status } = req.body;
    const results = await queryDatabase(
        'INSERT INTO Janji_Temu (pasien_id, nakes_id, Tanggal_Janji, Status) VALUES (?, ?, ?, ?)',
        [pasien_id, nakes_id, Tanggal_Janji, Status]
    );
    res.status(201).json({ id: results.insertId, ...req.body });
}));

/** Manajemen Pembayaran **/
app.get('/api/payments', asyncHandler(async (req, res) => {
    const results = await queryDatabase('SELECT * FROM Pembayaran');
    res.json(results);
}));

app.get('/api/clinics/:klinik_id/payments', asyncHandler(async (req, res) => {
    const { klinik_id } = req.params;
    const results = await queryDatabase(
        `SELECT p.* FROM Pembayaran p 
         JOIN Riwayat_Kunjungan rk ON p.kunjungan_id = rk.id_kunjungan 
         WHERE rk.klinik_id = ?`,
        [klinik_id]
    );
    res.json(results);
}));

app.post('/api/payments', asyncHandler(async (req, res) => {
    const { kunjungan_id, Total_Bayar, Metode_Bayar, Status_Pembayaran } = req.body;
    const results = await queryDatabase(
        'INSERT INTO Pembayaran (kunjungan_id, Total_Bayar, Metode_Bayar, Status_Pembayaran) VALUES (?, ?, ?, ?)',
        [kunjungan_id, Total_Bayar, Metode_Bayar, Status_Pembayaran]
    );
    res.status(201).json({ id: results.insertId, ...req.body });
}));

// Authentication routes (continued)
app.post('/api/auth/register', asyncHandler(async (req, res) => {
    const { Nama, Tanggal_Lahir, Jenis_Kelamin, Alamat, No_Telepon, Email, Password, klinik_id } = req.body;
    const results = await queryDatabase(
        'INSERT INTO Pasien (Nama, Tanggal_Lahir, Jenis_Kelamin, Alamat, No_Telepon, Email, klinik_id, Password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [Nama, Tanggal_Lahir, Jenis_Kelamin, Alamat, No_Telepon, Email, klinik_id, Password]
    );
    res.status(201).json({ id: results.insertId, message: 'Registration successful' });
}));

app.post('/api/auth/reset-password/request', asyncHandler(async (req, res) => {
    const { email } = req.body;
    const results = await queryDatabase('SELECT * FROM Pengguna WHERE Email = ?', [email]);
    
    if (results.length === 0) {
        return res.status(404).json({ message: 'Email not found' });
    }
    
    const resetLink = `http://example.com/reset-password/${results[0].id_pengguna}`;
    res.json({ message: 'Password reset link sent', resetLink });
}));

app.post('/api/auth/reset-password', asyncHandler(async (req, res) => {
    const { userId, newPassword } = req.body;
    await queryDatabase('UPDATE Pengguna SET Password = ? WHERE id_pengguna = ?', [newPassword, userId]);
    res.json({ message: 'Password reset successful' });
}));

// Add these routes after the existing authentication routes and before starting the server

/** User Management **/
// Get all users
app.get('/api/users', asyncHandler(async (req, res) => {
    const results = await queryDatabase(`
        SELECT 
            p.id_user,
            p.Nama,
            p.Email,
            p.Peran,
            CASE 
                WHEN p.Peran = 'Pasien' THEN pas.id_pasien
                WHEN p.Peran = 'Dokter' THEN n.id_nakes
                ELSE NULL
            END as role_id,
            CASE 
                WHEN p.Peran = 'Pasien' THEN pas.Tanggal_Lahir
                WHEN p.Peran = 'Dokter' THEN n.Spesialisasi
                ELSE NULL
            END as additional_info
        FROM Pengguna p
        LEFT JOIN Pasien pas ON p.pasien_id = pas.id_pasien
        LEFT JOIN Nakes n ON p.nakes_id = n.id_nakes
        ORDER BY p.id_user DESC
    `);
    res.json(results);
}));

// Get user by ID
app.get('/api/users/:id', asyncHandler(async (req, res) => {
    const { id } = req.params;
    const results = await queryDatabase(`
        SELECT 
            p.id_user,
            p.Nama,
            p.Email,
            p.Peran,
            CASE 
                WHEN p.Peran = 'Pasien' THEN pas.id_pasien
                WHEN p.Peran = 'Dokter' THEN n.id_nakes
                ELSE NULL
            END as role_id,
            CASE 
                WHEN p.Peran = 'Pasien' THEN pas.Tanggal_Lahir
                WHEN p.Peran = 'Dokter' THEN n.Spesialisasi
                ELSE NULL
            END as additional_info
        FROM Pengguna p
        LEFT JOIN Pasien pas ON p.pasien_id = pas.id_pasien
        LEFT JOIN Nakes n ON p.nakes_id = n.id_nakes
        WHERE p.id_user = ?
    `, [id]);

    if (results.length === 0) {
        return res.status(404).json({ 
            status: 'error',
            message: 'User not found' 
        });
    }
    res.json({
        status: 'success',
        data: results[0]
    });
}));

// Create new user
app.post('/api/users', asyncHandler(async (req, res) => {
    const { Nama, Email, Kata_Sandi, Peran, pasien_id, nakes_id } = req.body;

    // Validate required fields
    if (!Nama || !Email || !Kata_Sandi || !Peran) {
        return res.status(400).json({ 
            status: 'error',
            message: 'Missing required fields' 
        });
    }

    // Check if email already exists
    const existingUser = await queryDatabase('SELECT id_user FROM Pengguna WHERE Email = ?', [Email]);
    if (existingUser.length > 0) {
        return res.status(409).json({ 
            status: 'error',
            message: 'Email already exists' 
        });
    }

    // Create user
    const results = await queryDatabase(
        `INSERT INTO Pengguna (
            Nama, 
            Email, 
            Kata_Sandi, 
            Peran, 
            pasien_id, 
            nakes_id
        ) VALUES (?, ?, ?, ?, ?, ?)`,
        [Nama, Email, Kata_Sandi, Peran, pasien_id, nakes_id]
    );

    // Fetch the created user to return complete data
    const newUser = await queryDatabase(
        'SELECT id_user, Nama, Email, Peran FROM Pengguna WHERE id_user = ?',
        [results.insertId]
    );

    res.status(201).json({
        status: 'success',
        message: 'User created successfully',
        data: newUser[0]
    });
}));

// Update user
app.put('/api/users/:id', asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { Nama, Email, Kata_Sandi, Peran, pasien_id, nakes_id } = req.body;

    // Check if user exists
    const existingUser = await queryDatabase('SELECT id_user FROM Pengguna WHERE id_user = ?', [id]);
    if (existingUser.length === 0) {
        return res.status(404).json({ 
            status: 'error',
            message: 'User not found' 
        });
    }

    // Check if new email already exists (if email is being changed)
    if (Email) {
        const emailCheck = await queryDatabase(
            'SELECT id_user FROM Pengguna WHERE Email = ? AND id_user != ?',
            [Email, id]
        );
        if (emailCheck.length > 0) {
            return res.status(409).json({ 
                status: 'error',
                message: 'Email already exists' 
            });
        }
    }

    // Build update query dynamically based on provided fields
    let updateFields = [];
    let updateValues = [];
    
    if (Nama) {
        updateFields.push('Nama = ?');
        updateValues.push(Nama);
    }
    if (Email) {
        updateFields.push('Email = ?');
        updateValues.push(Email);
    }
    if (Kata_Sandi) {
        updateFields.push('Kata_Sandi = ?');
        updateValues.push(Kata_Sandi);
    }
    if (Peran) {
        updateFields.push('Peran = ?');
        updateValues.push(Peran);
    }
    if (pasien_id !== undefined) {
        updateFields.push('pasien_id = ?');
        updateValues.push(pasien_id);
    }
    if (nakes_id !== undefined) {
        updateFields.push('nakes_id = ?');
        updateValues.push(nakes_id);
    }

    // Add id to values array
    updateValues.push(id);

    // Update user
    await queryDatabase(
        `UPDATE Pengguna SET ${updateFields.join(', ')} WHERE id_user = ?`,
        updateValues
    );

    // Fetch updated user data
    const updatedUser = await queryDatabase(
        'SELECT id_user, Nama, Email, Peran FROM Pengguna WHERE id_user = ?',
        [id]
    );

    res.json({
        status: 'success',
        message: 'User updated successfully',
        data: updatedUser[0]
    });
}));

// Delete user
app.delete('/api/users/:id', asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Check if user exists
    const existingUser = await queryDatabase('SELECT id_user FROM Pengguna WHERE id_user = ?', [id]);
    if (existingUser.length === 0) {
        return res.status(404).json({ 
            status: 'error',
            message: 'User not found' 
        });
    }

    await queryDatabase('DELETE FROM Pengguna WHERE id_user = ?', [id]);
    res.json({
        status: 'success',
        message: 'User deleted successfully'
    });
}));

// Search users
app.get('/api/users/search', asyncHandler(async (req, res) => {
    const { keyword, role } = req.query;
    let query = `
        SELECT 
            p.id_user,
            p.Nama,
            p.Email,
            p.Peran,
            CASE 
                WHEN p.Peran = 'Pasien' THEN pas.id_pasien
                WHEN p.Peran = 'Dokter' THEN n.id_nakes
                ELSE NULL
            END as role_id,
            CASE 
                WHEN p.Peran = 'Pasien' THEN pas.Tanggal_Lahir
                WHEN p.Peran = 'Dokter' THEN n.Spesialisasi
                ELSE NULL
            END as additional_info
        FROM Pengguna p
        LEFT JOIN Pasien pas ON p.pasien_id = pas.id_pasien
        LEFT JOIN Nakes n ON p.nakes_id = n.id_nakes
        WHERE 1=1
    `;
    const params = [];

    if (keyword) {
        query += ` AND (p.Nama LIKE ? OR p.Email LIKE ?)`;
        params.push(`%${keyword}%`, `%${keyword}%`);
    }

    if (role) {
        query += ` AND p.Peran = ?`;
        params.push(role);
    }

    query += ` ORDER BY p.id_user DESC`;

    const results = await queryDatabase(query, params);
    res.json({
        status: 'success',
        data: results
    });
}));

// Start the Server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});