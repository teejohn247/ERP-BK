import mongoose from 'mongoose';
import moment from 'moment/moment';


const NotificationsSchema = new mongoose.Schema({
    notificationType: {type: String, required: true, unique: true},
    notificationContent: {type: String, required: true, unique: true},
    recipientId: {type: String, required: true, unique: true},
    read:{
        type: Boolean, default: false
    },
    created_by: {type: String, required: true},
}, { timestamps: true })


module.exports = mongoose.model("Notifications", NotificationsSchema);