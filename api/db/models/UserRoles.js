const mongoose = require("mongoose");
const Roles = require("./Roles");
const Users = require("./Users");

const schema = new mongoose.Schema({
    role_id: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: "roles" },
    user_id: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: "users" }
}, {
    versionKey: false,
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
});

class UserRoles extends mongoose.Model {}

schema.loadClass(UserRoles);
module.exports = mongoose.model("user_roles", schema);
