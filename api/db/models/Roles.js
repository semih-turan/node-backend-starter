const mongoose = require('mongoose');

const schema = mongoose.createSchema({
    role_name: {type: mongoose.SchemaTypes.String, required: true},
    is_active: {type: Boolean, default: true},
    createt_by: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
},{
    versionKey: false,
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

class Roles extends mongoose.Model {

};

schema.loadClass(Roles);

module.exports = mongoose.model('roles', schema);