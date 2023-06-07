var express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
var app = express();
app.use(bodyParser.json());
app.use(cors({
    origin: '*'
}));
global.DB = require('./config/connection');
app.listen(8080, function(err) {
    if(err){
       console.log(err);
       } else {
       console.log("listen:8000");
    }
});

app.use('/', require('./routes/contact'));
module.exports = app;