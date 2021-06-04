const mongoose = require('mongoose');
const getacabSchema = new mongoose.Schema({
    startDest: { type: String, required: true },
    endDest: { type: String, required: true },
    timeanddate: { type: String, required: true },
    cars: { type: String, required: true },
    phone: { type: Number, required: true },
    status: { type: Boolean, default: null}
});

const Getacab = new mongoose.model('Getacab', getacabSchema);



module.exports = {
    get: Getacab,

    fetchData: function(callback) {
        var getacab = Getacab.find({});
        getacab.exec((err, data) => {
            if (err) throw err;
            return callback(data);
        })
    }
}