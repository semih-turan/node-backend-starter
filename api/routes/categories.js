var express = require("express");
var router = express.Router();
const Categories = require("../db/models/Categories");
const Response = require("../lib/Response");
const CustomError = require("../lib/Error");
const Enum = require("../config/Enum");

/* GET users listing. */
router.get("/", async (req, res, next) => {
  try {
    let categories = await Categories.find({});

    res.json(Response.successResponse(categories));
  } catch (err) {
    let errorRespone = Response.errorResponse(err);
    res.status(errorRespone.code).json(Response.errorResponse(err));
  }
});

/* POST create a new category */
router.post("/add", async (req, res) => {
  let body = req.body;
  try {
    if (!body.name)
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        "Bad Request",
        "Name is required"
      );

    let category = new Categories({
      name: body.name,
      is_active: true,
      created_by: req.user?.id,
    });

    await category.save();

    res.json(
      Response.successResponse({ success: true }, Enum.HTTP_CODES.CREATED)
    );
  } catch (err) {
    let errorRespone = Response.errorResponse(err);
    res.status(errorRespone.code).json(errorRespone);
  }
});

/* Update a category */
router.post("/update", async (req, res) => {
    let body = req.body;
    try {

        if(!body._id) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Bad Request", "Category ID is required");

        let updates = {};

        if(body.name) updates.name = body.name;
        if(typeof body.is_active === "boolean") updates.is_active = body.is_active;
    
        await Categories.updateOne({_id: body._id}, updates);

        res.json(Response.successResponse({success: true}));

    } catch (err) {
        let errorRespone = Response.errorResponse(err);
    res.status(errorRespone.code).json(errorRespone);
    }
});

/* Delete a category */

router.post("/delete", async (req, res) => {
    let body = req.body;
    try {

        if(!body._id) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Bad Request", "Category ID is required");

        await Categories.deleteOne({_id: body._id});

        res.json(Response.successResponse({success: true}));

    } catch (err) {
        let errorRespone = Response.errorResponse(err);
        res.status(errorRespone.code).json(errorRespone);
    }
});

module.exports = router;
