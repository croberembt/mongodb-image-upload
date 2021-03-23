const express = require('express'); 
const crypto = require('crypto'); 
const mongoose = require('mongoose'); 
const multer = require('multer'); 
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override'); 

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, './.env') });

const app = express(); 

// create Mongo connection

//const conn = mongoose.connect(process.env.DATABASE_URL, {
  //useNewUrlParser: true,
  //useUnifiedTopology: true
//}); 

const conn = mongoose.createConnection(process.env.DATABASE_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true
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
  gfs.collection('images'); 
}); 

// create storage engine 
const storage = new GridFsStorage({
  url: process.env.DATABASE_URL,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'images'
        };
        resolve(fileInfo);
      })
    })
  }
});

const upload = multer({ storage }); 

// get main page
app.get('/', (req, res) => {
  res.render('index');
});

// post image to db
app.post('/upload', upload.single('file'), (req, res) => {
  //res.json({file: req.file}); 
  res.redirect('/'); 
});

// get all images
app.get('/admin', async (req, res) => {
  gfs.files.find().toArray((err, files) => {
    if(!files || files.length === 0) {
      return res.status(404).json({
        err: 'No files exist'
      });
    }
    return res.json(files); 
  });
}); 

// get files by id 
app.get('/admin', async (req, res) => {
  gfs.files.find().toArray((err, files) => {
    if(!files || files.length === 0) {
      return res.status(404).json({
        err: 'No files exist'
      });
    }
    return res.json(files); 
  });
}); 


const port = process.env.PORT; 

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
}); 