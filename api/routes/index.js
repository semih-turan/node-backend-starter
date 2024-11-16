var express = require('express');
var router = express.Router();

// const config =require("../config");

// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express', config });
// });

// Dinamik Routes yapisi
const fs = require('fs');

const routes = fs.readdirSync(__dirname); // Sync ile senkron olarak bu islem bitmeden alt satira gecmemesini bildirdik. __dirname bulundugu path i aliyor "./routes" yerine kullandim.

for(let route of routes){
  if(route.includes(".js") && route != "index.js"){ // index.js olmayan *.js dosyalarini sec
    router.use("/" +route.replace(".js", ""), require('./'+route));
  }
}

module.exports = router;
