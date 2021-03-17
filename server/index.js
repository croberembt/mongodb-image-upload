const express = require('express'); 
const crypto = require('crypto'); 
const mongoose = require('mongoose'); 
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override'); 

const path = require('path');
const { connect } = require('http2');
require('dotenv').config({ path: path.resolve(__dirname, './.env') });

const app = express(); 

// create Mongo connectin
const conn = mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}); 

// middleware
app.use(express.json());
app.use(methodOverride('_method')); 
app.set('view engine', 'ejs');
app.use(express.static('public')); 

// initialize gfs
let gfs; 
conn.once('open', () => {
  // initialize stream
  gfs = Grid(conn.db, mongoose.mongo); 
  gfs.collection('images')
}); 

app.get('/', (req, res) => {
  res.render('index');
});

const port = process.env.PORT; 

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
}); 