const mongoose = require('mongoose');
const RolePrivileges = require("./RolePrivileges");

const schema = new mongoose.Schema(
  {
    role_name: { type: mongoose.SchemaTypes.String, required: true, unique: true },
    is_active: { type: Boolean, default: true },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      required: false, // 'required' durumu ihtiyaca göre ayarlanabilir
    },
  },
  {
    versionKey: false, // version key alanini kapatir.
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

class Roles extends mongoose.Model {
  static async deleteOne(query) {

    if(query._id){
      await RolePrivileges.deleteMany({role_id: query._id});
    }
    
    await super.deleteMany(query);
  }
}

schema.loadClass(Roles);

module.exports = mongoose.model('roles', schema);
