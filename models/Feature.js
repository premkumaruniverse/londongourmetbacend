const mongoose = require("mongoose");

const FeatureSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: false
    },
    isActive: {
      type: Boolean,
      default: true
    },
    type: {
      type: String,
      enum: ['banner', 'feature'],
      default: 'banner'
    },
    order: {
      type: Number,
      default: 0
    },
    link: {
      type: String,
      required: false
    },
    buttonText: {
      type: String,
      required: false
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

module.exports = mongoose.model("Feature", FeatureSchema);
