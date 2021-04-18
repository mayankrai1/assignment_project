const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const com = Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, {
    versionKey: false,
    _id: false
})

const ApplicationSchema = new Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    client_id: { type: mongoose.Schema.Types.ObjectId, ref: 'client', required: false },
    App_Id:{ type: String, required: true },
    applicationType: { type: String, required: true },
    dependentsInclusion: { type: String, required: true },
    applicationFee: { type: Number, required: true },
    gstStatus: { type: String, required: true },
    gstRate: { type: String, required: true },
    payableAmount: { type: Number, required: true },
    balance: { type: Number, required: true },
    paymentSchedule: { type: String, required: true },
    designateTo: { type: String, required: true },
    designateRelationship: { type: String, required: true },
    designateAddress: { type: String, required: true },
    designatePhone: { type: Number, required: true },
    designateEmail: { type: String, required: true },
    employerName: { type: String, required: true },
    employerContactPerson: { type: String, required: true },
    employeeDesignation: { type: String, required: true },
    employerAddress: { type: String, required: true },
    employerPhone: { type: Number, required: true },
    employerEmail: { type: String, required: true },
    referenceType: { type: String, required: true },
    referenceName: { type: String, required: true },
    referenceAddress: { type: String, required: true },
    referencePhone: { type: Number, required: true },
    referenceEmail: { type: String, required: true },
    uciNumber: { type: Number, required: false },
    govtFileNumber: { type: Number, required: false },
    status: { type: String, required: false },
    statusUpdateDate: { type: Date, required: false },
    retainingDate: { type: Date, required: false },
    assing_to: [com]
}, {
    versionKey: false,
    timestamps: true,
});

module.exports = mongoose.model('application', ApplicationSchema);


