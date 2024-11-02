const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  companyName: { type: String },
  email: { type: String, required: true },
  companyId: { type: String, required: true },
  status: {
    type: String,
    enum: ['free', 'paid'],
    required: true,
    default: 'free'
  },
  price: {
    type: Number,
    required: function() {
      return this.status === 'paid';
    }
  },
  subscriptionCycle: {
    type: String,
    enum: ['monthly', 'annually'],
    required: function() {
      return this.status === 'paid';
    }
  },
  startDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: function() {
      return this.status === 'paid';
    }
  },
  modules: [{
    type: String,
    required: true
  }],
}, {
  timestamps: true
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

module.exports = Subscription;
