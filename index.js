const express = require('express');
const app = express();
const path = require("path");

// Serve the "public" folder
app.use('/user', express.static(path.join(__dirname, 'public/user')));
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1/ecommerce');

const route = require('./routes/route');
app.use('/api', route);

app.listen(3000,function(){
    console.log("Server Is Ready");
})