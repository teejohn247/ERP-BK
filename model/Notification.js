import mongoose from 'mongoose';


const NotificationsSchema = new mongoose.Schema({
    notificationName: {type: String, required: true, unique: true},
    enabled:{
        type: Boolean, default: false
    },
    availableTo: [{
        schools: {
            type: Boolean,
            default: false
        },
        nigeniusAdmin: {
            type: Boolean,
            default: false
        }
    }],
    assigned_to:  [{
        school_id: {
            type: String,
        },
        school_name: {
            type: String
        },
        date_assigned: {
            type: Date,
            default: Date.now()
        }
    }],
    created_by: {type: String, required: true},
}, { timestamps: true })


module.exports = mongoose.model("Notifications", NotificationsSchema);