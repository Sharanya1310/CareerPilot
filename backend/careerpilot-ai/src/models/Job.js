import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
    },
    company: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },
    team: {
      type: String,
      default: "",
      trim: true,
    },
    logo: {
      type: String,
      default: "",
      trim: true,
    },
    logoBg: {
      type: String,
      default: "bg-blue-600 text-white",
      trim: true,
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    experience: {
      type: String,
      default: "Any experience",
      trim: true,
    },
    salary: {
      type: String,
      default: "Competitive",
      trim: true,
    },
    posted: {
      type: String,
      default: "Just now",
      trim: true,
    },
    jobType: {
      type: String,
      default: "Full Time",
      trim: true,
    },
    workType: {
      type: String,
      enum: {
        values: ["Remote", "On-site", "Hybrid", "Any", ""],
        message: "workType must be Remote, On-site, Hybrid, Any, or empty",
      },
      default: "Any",
    },
    description: {
      type: String,
      required: [true, "Job description is required"],
      trim: true,
    },
    requirements: {
      type: [String],
      default: [],
    },
    skills: {
      type: [String],
      default: [],
    },
    companyHighlights: {
      rating: {
        type: Number,
        default: 4.0,
      },
      size: {
        type: String,
        default: "10,000+ employees",
      },
      industry: {
        type: String,
        default: "Technology",
      },
      culture: {
        type: String,
        default: "Innovation-driven, fast-paced",
      },
      benefits: {
        type: [String],
        default: ["Health insurance", "401k", "Remote work friendly"],
      },
    },
    isPremium: {
      type: Boolean,
      default: false,
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

// Indexes
jobSchema.index({ title: "text", company: "text" });

const Job = mongoose.model("Job", jobSchema);
export default Job;
