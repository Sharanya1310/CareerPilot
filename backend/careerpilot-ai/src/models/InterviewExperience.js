import mongoose from "mongoose";

const interviewExperienceSchema = new mongoose.Schema(
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
      required: [true, "Role title is required"],
      trim: true,
    },
    difficulty: {
      type: String,
      enum: {
        values: ["Easy", "Medium", "Hard", "Extreme"],
        message: "difficulty must be one of: Easy, Medium, Hard, Extreme",
      },
      default: "Medium",
    },
    outcome: {
      type: String,
      enum: {
        values: ["Selected", "Rejected", "No Offer", "Pending"],
        message: "outcome must be one of: Selected, Rejected, No Offer, Pending",
      },
      default: "Selected",
    },
    tags: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    upvotes: {
      type: Number,
      default: 0,
    },
    upvotedBy: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    commentsCount: {
      type: Number,
      default: 0,
    },
    rounds: [
      {
        title: {
          type: String,
          required: [true, "Round title is required"],
          trim: true,
        },
        focus: {
          type: String,
          default: "",
          trim: true,
        },
      },
    ],
    prepTips: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id;
        return ret;
      },
    },
  }
);

interviewExperienceSchema.index({ company: 1, createdAt: -1 });

const InterviewExperience = mongoose.model(
  "InterviewExperience",
  interviewExperienceSchema
);
export default InterviewExperience;
