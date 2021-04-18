const mongoose = require('mongoose');

const ProspectsSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    product_id: { type: String },
    product_name: { type: String, loadClass: true },
    product_type: { type: String, loadClass: true },
    product_quantity: { type: String },
    isBlock: { type: Boolean,default:false },
}, {
    versionKey: false,
    timestamps: true,
});



module.exports = mongoose.model('prospect', ProspectsSchema);