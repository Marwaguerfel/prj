const express = require('express');
const router = express.Router();
const db = require('../lib/db.js');
const userMiddleware = require('../middleware/users.js');


    router.get('/get', (req, res, next) =>{
        var query = "select *from category order by name";
        db.query(query, (err, results)=>{
            if (err) throw err;
        res.send(results);
        })
    })
    module.exports = router;
