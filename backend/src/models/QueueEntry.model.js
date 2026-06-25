import mongoose from "mongoose";

const queueEntrySchema = new mongoose.Schema(
    {
        queueId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Queue",
            required: true
        },
        name: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: [
                "Waiting",
                "Called",
                "Completed",
                "Skipped",
            ],
            default: "Waiting"
        },
        phone: {
            type: String,
            required: true
        },
        tokenNumber: {
            type : Number,
            required : true
        },
        calledAt: {
            type : Date
        },
        completedAt: {
            type : Date
        }
    },
    {
        timestamps: true,
    }
);

const QueueEntry = mongoose.model("QueueEntry", queueEntrySchema);

export default QueueEntry;