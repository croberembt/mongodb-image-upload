const express = require('express'); 
const path = require('path');
const crypto = require('crypto'); 
const mongoose = require('mongoose'); 
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override'); 
const dotenv = require('dotenv'); 

const app = express(); 

//middleware
app.use(express.json());
app.use(methodOverride('_method')); 
app.set('view engine', 'ejs');
app.use(express.static('public')); 

dotenv.config();

const mongoURI = process.env.MONGO_URI; 

app.get('/', (req, res) => {
  res.render('index');
});

const port = process.env.PORT; 
app.listen(port, () => console.log(`Server started on port ${port}`)); 