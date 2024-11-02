const mongoose = require('mongoose');

const schema = new mongoose.Schema(
  {
    role_name: { type: mongoose.SchemaTypes.String, required: true },
    is_active: { type: Boolean, default: true },
    created_by: {
      // Yazım hatası düzeltildi
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  {
    versionKey: false,
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

class Roles extends mongoose.Model {
  async deleteMany(query) {

    if(query_id){
      await RolePrivileges.deleteMany({role_id: query._id});
    }
    
    await super.deleteMany(query);
  }
}

schema.loadClass(Roles);

module.exports = mongoose.model('roles', schema);
