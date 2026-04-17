const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(express.static('./')); // Serves your HTML/CSS/JS files

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',      // Change this to your MySQL username
    password: '',      // Change this to your MySQL password
    database: 'tech_hub'
});

// GET all products
app.get('/api/products', (req, res) => {
    db.query('SELECT * FROM products', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// POST new product (Seller Feature)
app.post('/api/products', (req, res) => {
    const { title, description, price, image_url } = req.body;
    const sql = 'INSERT INTO products (title, description, price, image_url) VALUES (?, ?, ?, ?)';
    db.query(sql, [title, description, price, image_url], (err, result) => {
        if (err) throw err;
        res.json({ message: 'Product added!' });
    });
});

// Start server
app.listen(3000, () => {
    console.log('Tech Hub running at http://localhost:3000');
});