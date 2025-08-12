import mysql from 'mysql2';
import express from 'express';
import multer from 'multer';
import csv from 'csv-parser';
import fs from 'fs';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Calcular __dirname para módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
dotenv.config();
app.use(cors());

// Servir archivos estáticos desde carpeta frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Configuración multer (almacenamiento temporal)
const upload = multer({ dest: 'uploads/' });

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

connection.connect(
    (error) => {
    if (error) throw error;

    console.log('Conectado correctamente');
});

app.get('/clients', (request, response) => {
    connection.query('SELECT * FROM clients', (error, results) => {
        if(error) return response.status(500).json(error);
        response.json(results);
    });
});

// Ruta para subir CSV y procesarlo
app.post('/upload-csv', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const results = [];
  const filePath = path.join(process.cwd(), req.file.path);

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      // Insertar cada fila en la DB
      results.forEach(client => {
        const { name, email, password, phone, address, genre } = client;
        const query = 'INSERT INTO clients (name, email, password, phone, address, genre) VALUES (?, ?, ?, ?, ?, ?)';
        connection.query(query, [name, email, password, phone, address, genre], (error) => {
          if (error) console.error('Error insertando:', error.message);
        });
      });

      // Borrar archivo temporal
      fs.unlink(filePath, (err) => {
        if (err) console.error('Error borrando archivo:', err);
      });

      res.json({ message: 'Archivo CSV procesado y datos insertados' });
    });
});

// Crear cliente
app.post('/clients', (req, res) => {
  const { name, email, password, phone, address, genre } = req.body;

  const query = 'INSERT INTO clients (name, email, password, phone, address, genre) VALUES (?, ?, ?, ?, ?, ?)';
  connection.query(query, [name, email, password, phone, address, genre], (error, results) => {
    if (error) return res.status(500).json(error);
    res.status(201).json({ id: results.insertId, ...req.body });
  });
});

// Actualizar cliente
app.put('/clients/:id', (req, res) => {
  const { id } = req.params;
  const { name, email, password, phone, address, genre } = req.body;

  const query = 'UPDATE clients SET name = ?, email = ?, password = ?, phone = ?, address = ?, genre = ? WHERE id = ?';
  connection.query(query, [name, email, password, phone, address, genre, id], (error) => {
    if (error) return res.status(500).json(error);
    res.json({ id, ...req.body });
  });
});

// Borrar cliente
app.delete('/clients/:id', (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM clients WHERE id = ?';
  connection.query(query, [id], (error) => {
    if (error) return res.status(500).json(error);
    res.json({ message: `Cliente con id ${id} eliminado` });
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});


