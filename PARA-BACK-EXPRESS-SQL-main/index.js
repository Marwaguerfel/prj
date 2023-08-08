const express = require('express');
const app = express();
const cors = require('cors');



require('dotenv').config();
const PORT = process.env.PORT || 3000;


app.use(express.json());
app.use(cors());

const router = require('./routes/router.js');
const routerProcuct = require('./routes/products.js');
const routerreset = require('./routes/restpassword.js');
const routerCategory=require('./routes/categorys.js')
app.use('/api', routerCategory);
app.use('/api', router);
app.use('/api', routerProcuct);
app.use('/api', routerreset);

app.listen(PORT, () => console.log('Server running on port ' + PORT));
