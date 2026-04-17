const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(express.static('./')); 

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',      
    password: '',      
    database: 'tech_hub_db' 
});

// GET all products
app.get('/api/products', (req, res) => {
    db.query('SELECT * FROM products', (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// TASK 1 & 3: Apply Flash Sale via DB Function & Trigger
// This endpoint updates the database prices and triggers the trg_PriceAudit
app.post('/api/flash-sale', (req, res) => {
    const sql = 'UPDATE products SET price = fn_ApplyFlashSale(price)';
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Database prices updated. Audit logs created.' });
    });
});

// TASK 2: Check Low Stock via Stored Procedure
app.get('/api/low-stock/:min_qty', (req, res) => {
    const minQty = parseInt(req.params.min_qty);
    // Call the stored procedure, then select the OUT variable @out_qty
    db.query('CALL sp_CheckLowStock(?, @out_qty)', [minQty], (err) => {
        if (err) return res.status(500).json(err);
        db.query('SELECT @out_qty AS count', (err, results) => {
            if (err) return res.status(500).json(err);
            res.json({ low_stock_count: results[0].count });
        });
    });
});

app.listen(3000, () => {
    console.log('Tech Hub running at http://localhost:3000');
});
