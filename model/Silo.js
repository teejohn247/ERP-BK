import mongoose from 'mongoose';

const SiloERPSchema = new mongoose.Schema({
    companyName: { type: String, default: 'SiloERP'},
    email: { type: String, required: true },
    password: { type: String, required: true },
})

module.exports = mongoose.model("SiloERP", SiloERPSchema);
