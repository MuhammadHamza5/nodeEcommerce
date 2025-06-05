const express = require('express');
const app = express();
const path = require("path");

// Serve the "public" folder
app.use('/user', express.static(path.join(__dirname, 'public/user')));
const mongoose = require('mongoose');
// mongoose.connect('mongodb://127.0.0.1/ecommerce');
mongoose.connect('mongodb+srv://muhammadhamza:2HRABlAph9WLuEkf@cluster0.edurm8b.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
// mongoose.connect('mongodb+srv://muhammadhamza:2HRABlAph9WLuEkf@cluster0.mongodb.net/ecommerce?retryWrites=true&w=majority&tls=true');

const route = require('./routes/route');
app.use('/api', route);

app.listen(3000,function(){
    console.log("Server Is Ready");
})