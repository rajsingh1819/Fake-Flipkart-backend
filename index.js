const express = require('express');
var cors = require("cors");
const userRoot = require('./Routes/user');
const addProduct = require('./Routes/ProductData');
const path = require('path');
const app = express();
app.use(express.json());
app.use(cors());


app.use('/products/get', express.static(path.join(__dirname, 'public/images')));
app.use("/products", addProduct);
app.use("/user", userRoot);


module.exports = app;