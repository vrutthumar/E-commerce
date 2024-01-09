require('dotenv').config()
require('./config/dbconnect')
const port = process.env.PORT || 3000;
const express = require('express')
const app = express()
const cors = require('cors')
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./Swagger Ui/CodesWear.json');

app.use('/apis', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }

app.use(cors(corsOptions))
app.use(express.json())
const codeswear = require('./routes')

app.use('/codeswear', codeswear);
app.use('/image',express.static('public'))

app.listen(port,() => {
    console.log(`Example app listening on port http://localhost:${port}`);
})