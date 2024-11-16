const express = require("express");
const router = express.Router();
const Response = require("../lib/Response");
const AuditLogs = require("../db/models/AuditLogs");
const moment = require("moment");

// GET users listing.  Replace with your own logic to fetch and return user data.
router.post("/", async (req, res, nex) => {
  try {
    let body = req.body;
    let query = {};
    let skip = body.skip;
    let limit = body.limit;

    if (typeof body.skip !== "number") {
      skip = 0;
    }

    if (typeof body.limit !== "number" || body.limit > 500) {
      limit = 500;
    }

    if (body.begin_date && body.end_date) {
      query.created_at = {
        $gte: moment(body.begin_date),
        $lte: moment(body.end_date),
      };
    } else {
      query.created_at = {
        $gte: moment().subtract(1, "day").startOf("day"),
        $lte: moment(),
      };
    }

    // En veri ilk olarak gelecek sort ile
    let auditLogs = await AuditLogs.find(query)
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit);

    res.json(Response.successResponse(auditLogs));
  } catch (err) {
    let errorResponse = Response.errorResponse(err);
    res.status(errorResponse.code).json(errorResponse);
  }
});

module.exports = router;
