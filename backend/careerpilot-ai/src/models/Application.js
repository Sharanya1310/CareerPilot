import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
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
    stage: {
      type: String,
      enum: {
        values: ["Applied", "Assessment", "OA", "Interview", "Offer", "Rejected"],
        message: "stage must be one of: Applied, Assessment, OA, Interview, Offer, Rejected",
      },
      default: "Applied",
    },
    category: {
      type: String,
      default: "Engineering",
      trim: true,
    },
    date: {
      type: String,
      default: () =>
        new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    },
    deadline: {
      type: String,
      default: "No deadline",
      trim: true,
    },
    interviewer: {
      type: String,
      default: "",
      trim: true,
    },
    notes: {
      type: String,
      default: "",
      trim: true,
    },
    link: {
      type: String,
      default: "",
      trim: true,
    },
    timeline: {
      type: String,
      default: "",
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
applicationSchema.index({ user: 1, stage: 1 });
applicationSchema.index({ user: 1, createdAt: -1 });

const Application = mongoose.model("Application", applicationSchema);
export default Application;
