const mongoose = require("mongoose");
const locationSchema = new mongoose.Schema({
    street: { type: String, required: true },
    code: { type: String },
});

const Location = new mongoose.model("Location", locationSchema);

module.exports = Location;

module.exports = {

    fetchData: function(callback) {
        var location = Location.find({});
        location.exec((err, data) => {
            if (err) throw err;
            return callback(data);
        })
    }
}