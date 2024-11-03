var express = require('express');
var router = express.Router();
const Users = require('../db/models/Users');
const Response = require('../lib/Response');
const CustomError = require('../lib/Error');
const Enum = require('../config/Enum');

/* GET users listing. */
router.get('/', async (req, res) => {
  try {
    let users = await Users.find({});

    res.json(Response.successResponse(users));

  } catch (err) {
    let errorResponse = Response.errorResponse(err.message);
    res.status(errorResponse.code).json(errorResponse);
  }
});

router.post("/add", async (req, res) => {
  let body = req.body;
  try{
    
    if(!body.email) throw new CustomError(Enum.HTTP_CODES);
  } catch (err) {
    let errorResponse = Response.errorResponse(err.message);
    res.status(errorResponse.code).json(errorResponse);
  }
});


module.exports = router;
