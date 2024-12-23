const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database Connection
const db = mysql.createConnection({
    host: 'localhost', // Your MySQL host
    user: 'root',      // Your MySQL username
    password: '',      // Your MySQL password
    database: 'sehat', // Replace with your database name
    port: 3306               // Specify the port explicitly (optional, default is 3306)

});

db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err);
    } else {
        console.log('Connected to MySQL database');
    }
});

// Utility function to handle database queries
function queryDatabase(sql, params = [], res) {
    db.query(sql, params, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send(err);
        } else {
            res.json(results);
        }
    });
}

// API Routes

// Docs
const path = require('path');
app.use('/docs', express.static(path.join(__dirname, 'public/docs')));


// You can access the documentation at http://localhost:5000/docs/api-docs.html


// Get all clinics
app.get('/api/clinics', (req, res) => {
    const query = 'SELECT * FROM Klinik';
    db.query(query, (err, results) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(results);
        }
    });
});


/** Manajemen Klinik **/
app.get('/api/clinics', (req, res) => queryDatabase('SELECT * FROM Klinik', [], res));
app.post('/api/clinics', (req, res) => {
    const { Nama, Lokasi, Telepon, Jam_Operasional } = req.body;
    queryDatabase('INSERT INTO Klinik (Nama, Lokasi, Telepon, Jam_Operasional) VALUES (?, ?, ?, ?)',
        [Nama, Lokasi, Telepon, Jam_Operasional], res);
});
app.put('/api/clinics/:id', (req, res) => {
    const { id } = req.params;
    const { Nama, Lokasi, Telepon, Jam_Operasional } = req.body;
    queryDatabase('UPDATE Klinik SET Nama = ?, Lokasi = ?, Telepon = ?, Jam_Operasional = ? WHERE id_klinik = ?',
        [Nama, Lokasi, Telepon, Jam_Operasional, id], res);
});
app.delete('/api/clinics/:id', (req, res) => {
    const { id } = req.params;
    queryDatabase('DELETE FROM Klinik WHERE id_klinik = ?', [id], res);
});

/** Manajemen Pasien **/

// Search patients from a specific clinic
app.get('/api/clinics/:klinik_id/patients/search', (req, res) => {
    const { klinik_id } = req.params;
    const { keyword } = req.query;
  
    const query = `
      SELECT DISTINCT p.* 
      FROM pasien p
      INNER JOIN riwayat_kunjungan rk ON p.id_pasien = rk.pasien_id 
      WHERE rk.klinik_id = ? 
      AND (p.Nama LIKE ? OR p.Email LIKE ? OR p.No_Telepon LIKE ?)
    `;
  
    const likeKeyword = `%${keyword}%`;
    queryDatabase(query, [klinik_id, likeKeyword, likeKeyword, likeKeyword], res);
  });



app.get('/api/patients', (req, res) => queryDatabase('SELECT * FROM Pasien', [], res));
app.get('/api/patients/search', (req, res) => {
    const { keyword } = req.query;
    queryDatabase('SELECT * FROM Pasien WHERE Nama LIKE ? OR Email LIKE ? OR No_Telepon LIKE ?',
        [`%${keyword}%`, `%${keyword}%`, `%${keyword}%`], res);
});
app.post('/api/patients', (req, res) => {
    const { Nama, Tanggal_Lahir, Jenis_Kelamin, Alamat, No_Telepon, Email } = req.body;
    queryDatabase('INSERT INTO Pasien (Nama, Tanggal_Lahir, Jenis_Kelamin, Alamat, No_Telepon, Email) VALUES (?, ?, ?, ?, ?, ?)',
        [Nama, Tanggal_Lahir, Jenis_Kelamin, Alamat, No_Telepon, Email], res);
});
app.put('/api/patients/:id', (req, res) => {
    const { id } = req.params;
    const { Nama, Tanggal_Lahir, Jenis_Kelamin, Alamat, No_Telepon, Email } = req.body;
    queryDatabase('UPDATE Pasien SET Nama = ?, Tanggal_Lahir = ?, Jenis_Kelamin = ?, Alamat = ?, No_Telepon = ?, Email = ? WHERE id_pasien = ?',
        [Nama, Tanggal_Lahir, Jenis_Kelamin, Alamat, No_Telepon, Email, id], res);
});
app.delete('/api/patients/:id', (req, res) => {
    const { id } = req.params;
    queryDatabase('DELETE FROM Pasien WHERE id_pasien = ?', [id], res);
});

/** Manajemen Tenaga Kesehatan (Nakes) **/
app.get('/api/nakes', (req, res) => queryDatabase('SELECT * FROM Nakes', [], res));
app.get('/api/nakes/search', (req, res) => {
    const { keyword } = req.query;
    queryDatabase('SELECT * FROM Nakes WHERE Nama LIKE ? OR Spesialisasi LIKE ?',
        [`%${keyword}%`, `%${keyword}%`], res);
});

// Get all nakes for a specific clinic
app.get('/api/clinics/:klinik_id/nakes', (req, res) => {
    const { klinik_id } = req.params;
    queryDatabase('SELECT * FROM Nakes WHERE klinik_id = ?', [klinik_id], res);
});

// Add a nakes for a specific clinic
app.post('/api/clinics/:klinik_id/nakes', (req, res) => {
    const { klinik_id } = req.params;
    const { Nama, Spesialisasi, Nomor_STR, Jenis_Kelamin, Telepon, Email } = req.body;
    queryDatabase(
        'INSERT INTO Nakes (Nama, Spesialisasi, Nomor_STR, Jenis_Kelamin, Telepon, Email, klinik_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [Nama, Spesialisasi, Nomor_STR, Jenis_Kelamin, Telepon, Email, klinik_id],
        res
    );
});

app.post('/api/nakes', (req, res) => {
    const { Nama, Spesialisasi, Nomor_STR, Jenis_Kelamin, Telepon, Email, klinik_id } = req.body;
    queryDatabase('INSERT INTO Nakes (Nama, Spesialisasi, Nomor_STR, Jenis_Kelamin, Telepon, Email, klinik_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [Nama, Spesialisasi, Nomor_STR, Jenis_Kelamin, Telepon, Email, klinik_id], res);
});
app.put('/api/nakes/:id', (req, res) => {
    const { id } = req.params;
    const { Nama, Spesialisasi, Nomor_STR, Jenis_Kelamin, Telepon, Email, klinik_id } = req.body;
    queryDatabase('UPDATE Nakes SET Nama = ?, Spesialisasi = ?, Nomor_STR = ?, Jenis_Kelamin = ?, Telepon = ?, Email = ?, klinik_id = ? WHERE id_nakes = ?',
        [Nama, Spesialisasi, Nomor_STR, Jenis_Kelamin, Telepon, Email, klinik_id, id], res);
});
app.delete('/api/nakes/:id', (req, res) => {
    const { id } = req.params;
    queryDatabase('DELETE FROM Nakes WHERE id_nakes = ?', [id], res);
});

/** Manajemen Riwayat Kunjungan **/

// Get all visits for a specific clinic
app.get('/api/clinics/:klinik_id/visits', (req, res) => {
    const { klinik_id } = req.params;
    queryDatabase('SELECT * FROM Riwayat_Kunjungan WHERE klinik_id = ?', [klinik_id], res);
});

// Get all visits for specific patient
app.get('/api/patients/:pasien_id/visits', (req, res) => {
    const { pasien_id } = req.params;
    queryDatabase(
        'SELECT * FROM Riwayat_Kunjungan WHERE pasien_id = ?', 
        [pasien_id], 
        res
    );
 });

// Add a visit for a specific clinic
app.post('/api/clinics/:klinik_id/visits', (req, res) => {
    const { klinik_id } = req.params;
    const { pasien_id, nakes_id, Tanggal_Kunjungan, Keluhan, Diagnosa } = req.body;
    queryDatabase(
        'INSERT INTO Riwayat_Kunjungan (pasien_id, nakes_id, Tanggal_Kunjungan, Keluhan, Diagnosa, klinik_id) VALUES (?, ?, ?, ?, ?, ?)',
        [pasien_id, nakes_id, Tanggal_Kunjungan, Keluhan, Diagnosa, klinik_id],
        res
    );
});

app.get('/api/visits', (req, res) => queryDatabase('SELECT * FROM Riwayat_Kunjungan', [], res));
app.post('/api/visits', (req, res) => {
    const { pasien_id, nakes_id, Tanggal_Kunjungan, Keluhan, Diagnosa, klinik_id } = req.body;
    queryDatabase('INSERT INTO Riwayat_Kunjungan (pasien_id, nakes_id, Tanggal_Kunjungan, Keluhan, Diagnosa, klinik_id) VALUES (?, ?, ?, ?, ?, ?)',
        [pasien_id, nakes_id, Tanggal_Kunjungan, Keluhan, Diagnosa, klinik_id], res);
});

/** Manajemen Rekam Medis **/
// Get all medical records for a specific clinic
app.get('/api/clinics/:klinik_id/medical-records', (req, res) => {
    const { klinik_id } = req.params;
    queryDatabase(
        `SELECT rm.* FROM Rekam_Medis rm 
       JOIN Riwayat_Kunjungan rk ON rm.kunjungan_id = rk.id_kunjungan 
       WHERE rk.klinik_id = ?`,
        [klinik_id],
        res
    );
});

// Get all medical records for specific patient 
app.get('/api/patients/:pasien_id/medical-records', (req, res) => {
    const { pasien_id } = req.params;
    queryDatabase(
        `SELECT rm.* FROM Rekam_Medis rm
         JOIN Riwayat_Kunjungan rk ON rm.kunjungan_id = rk.id_kunjungan
         WHERE rk.pasien_id = ?`,
        [pasien_id],
        res
    );
 });

app.get('/api/medical-records', (req, res) => queryDatabase('SELECT * FROM Rekam_Medis', [], res));
app.post('/api/medical-records', (req, res) => {
    const { kunjungan_id, Detail_Rekam_Medis } = req.body;
    queryDatabase('INSERT INTO Rekam_Medis (kunjungan_id, Detail_Rekam_Medis) VALUES (?, ?)',
        [kunjungan_id, Detail_Rekam_Medis], res);
});

/** Manajemen Obat **/
app.get('/api/medications', (req, res) => queryDatabase('SELECT * FROM Obat', [], res));
app.post('/api/medications', (req, res) => {
    const { Nama_Obat, Jenis_Obat, Harga, Stok, Keterangan } = req.body;
    queryDatabase('INSERT INTO Obat (Nama_Obat, Jenis_Obat, Harga, Stok, Keterangan) VALUES (?, ?, ?, ?, ?)',
        [Nama_Obat, Jenis_Obat, Harga, Stok, Keterangan], res);
});

/** Manajemen Janji Temu **/
app.get('/api/appointments', (req, res) => queryDatabase('SELECT * FROM Janji_Temu', [], res));
app.post('/api/appointments', (req, res) => {
    const { pasien_id, nakes_id, Tanggal_Janji, Status } = req.body;
    queryDatabase('INSERT INTO Janji_Temu (pasien_id, nakes_id, Tanggal_Janji, Status) VALUES (?, ?, ?, ?)',
        [pasien_id, nakes_id, Tanggal_Janji, Status], res);
});

/** Manajemen Pembayaran **/
// Get all payments for a specific clinic
app.get('/api/clinics/:klinik_id/payments', (req, res) => {
    const { klinik_id } = req.params;
    queryDatabase(
        `SELECT p.* FROM Pembayaran p 
       JOIN Riwayat_Kunjungan rk ON p.kunjungan_id = rk.id_kunjungan 
       WHERE rk.klinik_id = ?`,
        [klinik_id],
        res
    );
});

app.get('/api/payments', (req, res) => queryDatabase('SELECT * FROM Pembayaran', [], res));
app.post('/api/payments', (req, res) => {
    const { kunjungan_id, Total_Bayar, Metode_Bayar, Status_Pembayaran } = req.body;
    queryDatabase('INSERT INTO Pembayaran (kunjungan_id, Total_Bayar, Metode_Bayar, Status_Pembayaran) VALUES (?, ?, ?, ?)',
        [kunjungan_id, Total_Bayar, Metode_Bayar, Status_Pembayaran], res);
});

//Authentication
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    const query = 'SELECT * FROM Pengguna WHERE Email = ? AND Password = ?';

    queryDatabase(query, [email, password], (err, results) => {
        if (err || results.length === 0) {
            res.status(401).json({ message: 'Invalid email or password' });
        } else {
            // Generate a token (dummy token used here; replace with real JWT)
            const token = `sehat-token-${results[0].id_pengguna}`;
            res.json({ token, user: results[0] });
        }
    });
});

app.post('/api/auth/logout', (req, res) => {
    // Token invalidation logic (e.g., using a token blacklist)
    res.json({ message: 'Logout successful' });
});

app.post('/api/auth/register', (req, res) => {
    const { Nama, Tanggal_Lahir, Jenis_Kelamin, Alamat, No_Telepon, Email, Password, klinik_id } = req.body;

    const query = `
      INSERT INTO Pasien (Nama, Tanggal_Lahir, Jenis_Kelamin, Alamat, No_Telepon, Email, klinik_id, Password)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    queryDatabase(
        query,
        [Nama, Tanggal_Lahir, Jenis_Kelamin, Alamat, No_Telepon, Email, klinik_id, Password],
        res
    );
});

//Middleware for Role-based Access Control
// const rbacMiddleware = (allowedRoles) => (req, res, next) => {
//     const { user } = req; // Assume `user` is attached to `req` after authentication
//     if (!user || !allowedRoles.includes(user.role)) {
//         return res.status(403).json({ message: 'Forbidden: You do not have access' });
//     }
//     next();
// };

// Example usage
// app.get('/api/admin/dashboard', rbacMiddleware(['admin']), (req, res) => {
//   res.json({ message: 'Welcome to admin dashboard' });
// });

app.post('/api/auth/reset-password', (req, res) => {
    const { userId, newPassword } = req.body;
    const query = 'UPDATE Pengguna SET Password = ? WHERE id_pengguna = ?';

    queryDatabase(query, [newPassword, userId], res);
});


// Start the Server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
