var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var moment = require('moment');

var CounterSchema = Schema({
    _id: {type: String, required: true},
    seq: { type: Number, default: 0 }
});
var counter = mongoose.model('counter', CounterSchema);

var IssueSchema = new Schema({
    id: String,
    description: String,
    creator: String,
    assignee: String,
    createDate: Date
});

IssueSchema.pre('save', function(next) {
    now = new Date();
    if (!this.created_at) {
        this.createDate = now;
    }

    var doc = this;
    counter.findByIdAndUpdate({
        _id: 'issueid'
    }, {
        $inc: {
            seq: 1
        }
    }, function(error, counter) {
        if (error)
            return next(error);
        doc.id = counter.seq;
        next();
    });
});

module.exports = mongoose.model('Issue', IssueSchema);
