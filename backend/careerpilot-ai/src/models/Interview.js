import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    company: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },
    role: {
      type: String,
      required: [true, "Job role is required"],
      trim: true,
    },
    date: {
      type: String,
      required: [true, "Interview date is required"],
      trim: true,
    },
    time: {
      type: String,
      required: [true, "Interview time is required"],
      trim: true,
    },
    link: {
      type: String,
      default: "",
      trim: true,
    },
    notes: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id;
        return ret;
      }
    }
  }
);

// Indexes for query performance
interviewSchema.index({ user: 1, date: 1 });

const Interview = mongoose.model("Interview", interviewSchema);
export default Interview;
