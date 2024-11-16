var express = require("express");
var router = express.Router();
const Categories = require("../db/models/Categories");
const Response = require("../lib/Response");
const CustomError = require("../lib/Error");
const Enum = require("../config/Enum");
const AuditLogs = require("../lib/AuditLogs");
const logger = require("../lib/logger/LoggerClass");
const auth = require("../lib/auth")();

router.all("*", auth.authenticate(), (req, res, next) => {
  next();
});

/* GET users listing. */
router.get("/", auth.checkRoles("category_view"), async (req, res, next) => {
  try {
    let categories = await Categories.find({});

    res.json(Response.successResponse(categories));
  } catch (err) { 
    let errorRespone = Response.errorResponse(err);
    res.status(errorRespone.code).json(Response.errorResponse(err));
  }
});

/* POST create a new category */
router.post("/add", auth.checkRoles("category_add"), async (req, res) => {
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
      is_active: true, // body.is_active seklinde de alabilirsin
      created_by: req.user?.id,  // req.user varsa, user = req.user.id; yoksa, user = undefined
    });

    await category.save(); // DB'ye category'yi kayit et.

    AuditLogs.info(req.user?.email, "Categories", "Add", category);
    logger.info(req.user?.email, "Categories", "Add", category);

    res.json(
      Response.successResponse({ success: true }, Enum.HTTP_CODES.CREATED)
    );
  } catch (err) {
    logger.error(req.user?.email, "Categories", "Add", err);
    let errorRespone = Response.errorResponse(err);
    res.status(errorRespone.code).json(errorRespone);
  }
});

/* Update a category */
router.post("/update",auth.checkRoles("category_update"), async (req, res) => {
    let body = req.body;
    try {

        if(!body._id) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Bad Request", "Category ID is required");

        let updates = {};

        if(body.name) updates.name = body.name;
        if(typeof body.is_active === "boolean") updates.is_active = body.is_active;
    
        await Categories.updateOne({_id: body._id}, updates);

        AuditLogs.info(req.user?.email, "Categories", "Update", { _id: body._id, ...updates });

        res.json(Response.successResponse({success: true}));

    } catch (err) {
        let errorRespone = Response.errorResponse(err);
    res.status(errorRespone.code).json(errorRespone);
    }
});

/* Delete a category */

router.post("/delete", auth.checkRoles("category_delete"),async (req, res) => {
    let body = req.body;
    try {

        if(!body._id) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Bad Request", "Category ID is required");

        await Categories.deleteOne({_id: body._id});

        AuditLogs.info(req.user?.email, "Categories", "Delete", { _id: body._id });
  
        res.json(Response.successResponse({success: true}));

    } catch (err) {
        let errorRespone = Response.errorResponse(err);
        res.status(errorRespone.code).json(errorRespone);
    }
});

module.exports = router;
