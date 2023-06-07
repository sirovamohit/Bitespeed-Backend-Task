var express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
var app = express();
const hostname = '0.0.0.0';
app.use(bodyParser.json());
app.use(cors({
    origin: '*'
}));
global.DB = require('./config/connection');
app.listen(8080,hostname, function(err) {
    if(err){
       console.log(err);
       } else {
       console.log("listen:8000");
    }
});

app.use('/identify', require('./routes/contact'));
module.exports = app;