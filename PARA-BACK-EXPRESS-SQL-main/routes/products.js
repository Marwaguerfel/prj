const express = require('express');
const router = express.Router();
const db = require('../lib/db.js');
const userMiddleware = require('../middleware/users.js');

/* GET users listing. */
router.get('/product', (req, res, next) => {
    db.query('SELECT * FROM product', (err, rows) => {
        if (err) throw err;
        res.send(rows);
    });
});

module.exports = router;