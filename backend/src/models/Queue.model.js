import mongoose from "mongoose";

const queueSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },
    admin: {
      type : mongoose.Schema.Types.ObjectId,
      ref : "Admin",
      required : true
    },
    avgServiceTime: {
      type: Number,
      required: true,
      min: 1,
    },
    lastTokenNumber:{
      type : Number,
      default : 0
    },
    isActive:{
      type : Boolean,
      default : true
    }
  },
  {
    timestamps: true,
  }
);

const Queue = mongoose.model("Queue", queueSchema);

export default Queue;