//Define the schema of the collection
const mongoose = require("mongoose");

//Object as the representation of the data schema
const MachineSchema = new mongoose.Schema( {
    _id: String,
    manName: String,
    modelName: String,
    wash30: String,
    wash40: String,
    wash60: String,
    notes: String,
    file: String,
});

//mongoose.set('strictQuery', true);

const MachineModel = mongoose.model('machine', MachineSchema);

module.exports = MachineModel;