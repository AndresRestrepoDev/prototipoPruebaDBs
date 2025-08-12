import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import mysql from 'mysql2';

// Configura tu conexión MySQL (igual que en app.js)
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Riwi123*',
  database: 'lovelace',
});

connection.connect(error => {
  if (error) {
    console.error('Error conectando a la DB:', error);
    return;
  }
  console.log('Conectado a la base de datos MySQL');
});

// Ruta al archivo CSV (ajusta la ruta si es necesario)
const csvFilePath = path.join(process.cwd(), 'clients.csv');

// Función para leer el CSV y guardar en DB
function importCsv() {
  const results = [];

  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', (data) => {
      results.push(data);
    })
    .on('end', () => {
      // Insertar cada fila en la DB
      results.forEach(client => {
        const { name, email, password, phone, address, genre } = client;

        const query = 'INSERT INTO clients (name, email, password, phone, address, genre) VALUES (?, ?, ?, ?, ?, ?)';
        connection.query(query, [name, email, password, phone, address, genre], (error) => {
          if (error) {
            console.error('Error insertando cliente:', error.message);
          } else {
            console.log(`Cliente ${name} insertado`);
          }
        });
      });
    });
}

// Ejecutar importación
importCsv();
