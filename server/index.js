const express = require('express'); 
const app = express(); 

app.set('view engine', 'ejs');

app.use(express.static('public')); 
//app.use(express.static(__dirname + '/public'));
//app.use('/public', express.static('public'));

app.get('/', (req, res) => {
  res.render('index');
});

const port = 5000; 

app.listen(port, () => console.log(`Server started on port ${port}`)); 