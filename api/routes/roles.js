const express = require("express");
const router = express.Router();

const Roles = require("../db/models/Roles");
const RolePrivileges = require("../db/models/RolePrivileges");
const Response = require("../lib/Response");
const CustomError = require("../lib/Error");
const Enum = require("../config/Enum");
const role_privileges = require("../config/role_privileges");

router.get("/", async (req, res) => {
  try {
    let roles = await Roles.find();

    res.json(Response.successResponse(roles));
  } catch (error) {
    let errorResponse = Response.errorResponse(err);
    res.status(errorResponse.status).json(errorResponse);
  }
});

/* POST create a new roles */
router.post("/add", async (req, res) => {
  let body = req.body;
  try {
    if (!body.role_name)
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        "Bad Request",
        "Role name is required!"
      );

    if (
      !body.permissions ||
      Array.isArray(body.permissions) ||
      body.permissions.length === 0
    ) {
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        "Bad Request",
        "Permissions is required and must be an array!"
      );
    }

    let role = new Roles({
      role_name: body.role_name,
      is_active: true,
      created_by: req.user?.id, // if id is true return id, otherwise return null
    });

    await role.save();

    for (let i = 0; i < body.permissions.length; i++) {
      let priv = new RolePrivileges({
        role_id: role._id,
        permission: body.permissions[i],
        created_by: req.user?.id,
      });

      await priv.save();
    }

    res.json(
      Response.successResponse({ success: true }, Enum.HTTP_CODES.CREATED)
    );
  } catch (err) {
    let errorRespone = Response.errorResponse(err);
    res.status(errorRespone.code).json(errorRespone);
  }
});

/* POST update roles */
router.post("/update", async (req, res) => {
  let body = req.body;
  try {
    if (!body._id)
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        "Bad Request",
        "ID is required!"
      );

    let updates = {};

    if (body.role_name) updates.role_name = body.role_name;

    if (typeof body.is_active === "boolean") updates.is_active = body.is_active;

    if (
      body.permissions &&
      Array.isArray(body.permissions) &&
      body.permissions.length > 0
    ) {

        let rolePrivs = await RolesPrivileges.find({role_id: BeforeUnloadEvent._id});

        // body.permissions = ['user_view', 'user_add', 'user_update', 'user_delete'];
        // permissions = [{role_id: 'abc', permission: 'user_add', _id: "bvd"}];
        let removedPermissions = permissions.filter(x => !body.permissions.includes(x.permission));

        let newPermissions = body.permissions.filter(x => !permissions.map(p => p.permission ).includes(x));

        if(removedPermissions.length > 0) {
            await RolePrivileges.deleteMany({_id: {$in: removedPermissions.map(x => x._id)}});
        }

        if(newPermissions.length > 0) {
            for (let i = 0; i < newPermissions.length; i++) {
                let priv = new RolePrivileges({
                  role_id: body._id,
                  permission: newPermissions[i],
                  created_by: req.user?.id,
                });
          
                await priv.save();
              }
        }

      for (let i = 0; i < body.permissions.length; i++) {
        let priv = new RolePrivileges({
          role_id: role._id,
          permission: body.permissions[i],
          created_by: req.user?.id,
        });
      }
    }

    await Roles.updateOne({ _id: body._id }, updates);

    res.json(
      Response.successResponse({ success: true }, Enum.HTTP_CODES.CREATED)
    );
  } catch (err) {
    let errorRespone = Response.errorResponse(err);
    res.status(errorRespone.code).json(errorRespone);
  }
});

/* POST delete roles */
router.post("/delete", async (req, res) => {
  let body = req.body;
  try {
    if (!body._id)
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        "Bad Request",
        "ID is required!"
      );

    await Roles.deleteOne({ _id: body._id });

    res.json(
      Response.successResponse({ success: true }, Enum.HTTP_CODES.CREATED)
    );
  } catch (err) {
    let errorRespone = Response.errorResponse(err);
    res.status(errorRespone.code).json(errorRespone);
  }
});

router.get("/role_privileges", async (req, res) => {
  res.json(role_privileges);
});

module.exports = router;
