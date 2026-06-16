import mongoose from "mongoose";

const atsSectionScoresSchema = new mongoose.Schema(
  {
    skills: { type: Number, min: 0, max: 100, default: 0 },
    projects: { type: Number, min: 0, max: 100, default: 0 },
    experience: { type: Number, min: 0, max: 100, default: 0 },
    formatting: { type: Number, min: 0, max: 100, default: 0 },
  },
  { _id: false }
);

const aiOptimizedContentSchema = new mongoose.Schema(
  {
    rewrittenExperience: { type: [String], default: [] },
    skillsEnhancement: { type: [String], default: [] },
  },
  { _id: false }
);

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: [true, "Resume title is required"],
      trim: true,
      maxlength: [255, "Title cannot exceed 255 characters"],
    },

    fileName: {
      type: String,
      required: [true, "File name is required"],
      trim: true,
    },

    fileUrl: {
      type: String,
      required: [true, "File URL is required"],
    },

    fileType: {
      type: String,
      required: [true, "File type is required"],
    },

    fileSize: {
      type: Number,
      required: [true, "File size is required"],
      max: [5 * 1024 * 1024, "File size cannot exceed 5MB"],
    },

    cloudinaryPublicId: {
      type: String,
      default: "",
    },

    extractedText: {
      type: String,
      default: "",
      select: false,
    },

    isActive: {
      type: Boolean,
      default: false,
    },

    atsScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    atsPercentile: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    atsSectionScores: {
      type: atsSectionScoresSchema,
      default: () => ({}),
    },

    jobMatchScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    missingSkills: {
      type: [String],
      default: [],
    },

    matchSummary: {
      type: String,
      default: "",
      maxlength: [2000, "Match summary cannot exceed 2000 characters"],
    },

    aiOptimizedContent: {
      type: aiOptimizedContentSchema,
      default: () => ({}),
    },

    resumeKeywords: {
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
      }
    }
  }
);

resumeSchema.index({ user: 1, isActive: 1 });
resumeSchema.index({ user: 1, createdAt: -1 });

const Resume = mongoose.model("Resume", resumeSchema);
export default Resume;
