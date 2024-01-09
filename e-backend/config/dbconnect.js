const mongoose = require('mongoose')

mongoose.connect(process.env.MONGO_DB).then(() => console.log('Database Connected'))