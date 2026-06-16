import mongoose from "mongoose";

const sectionScoreSchema = new mongoose.Schema(
  { label: String, score: Number, color: { type: String, default: "bg-indigo-500" } },
  { _id: false }
);

const analysisSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    resume: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
      required: true,
    },
    resumeName:       { type: String, default: "" },
    jobTitle:         { type: String, default: "" },
    company:          { type: String, default: "" },
    jobDescription:   { type: String, required: true },
    matchPercentage:  { type: Number, default: 0 },
    atsScore:         { type: Number, default: 0 },
    missingKeywords:  { type: [String], default: [] },
    matchedKeywords:  { type: [String], default: [] },
    recommendations:  { type: [String], default: [] },
    sectionScores:    { type: [sectionScoreSchema], default: [] },
    summary:          { type: String, default: "" },
  },
  { timestamps: true }
);

analysisSchema.index({ user: 1, createdAt: -1 });

const Analysis = mongoose.model("Analysis", analysisSchema);
export default Analysis;
