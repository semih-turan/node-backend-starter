const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    role_id: { type: mongoose.SchemaTypes.ObjectId, required: true },
    permission: { type: String, required: true },
    created_by: { type: mongoose.SchemaTypes.ObjectId, required: false } // 'required' durumu ihtiyaca göre ayarlanabilir
}, {
    versionKey: false,
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
});

class RolePrivilege extends mongoose.Model {}

schema.loadClass(RolePrivilege);
module.exports = mongoose.model("RolePrivilege", schema);
