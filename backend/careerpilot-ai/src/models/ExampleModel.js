/**
 * Example Model Pattern
 * 
 * Each model represents a database collection.
 * Schemas define structure; methods add business logic.
 * 
 * Usage in service:
 *   const user = await User.findById(id);
 *   const jobs = await Job.find({ status: 'Applied' });
 */

// import mongoose from "mongoose";

/*
const exampleSchema = new mongoose.Schema(
  {
    // String field with validation
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [3, "Name must be at least 3 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },

    // Email field with unique index
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email"],
    },

    // Status with enum
    status: {
      type: String,
      enum: ["active", "inactive", "deleted"],
      default: "active",
    },

    // Number field
    age: {
      type: Number,
      min: [0, "Age cannot be negative"],
      max: [150, "Age cannot exceed 150"],
    },

    // Array of strings
    tags: {
      type: [String],
      default: [],
    },

    // Reference to another model
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Nested object
    metadata: {
      lastLogin: Date,
      loginCount: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
    toJSON: { virtuals: true }, // Include virtuals in JSON
  }
);

// Index for faster queries
exampleSchema.index({ email: 1, status: 1 });

// Instance method
exampleSchema.methods.getFullInfo = function () {
  return `${this.name} (${this.email})`;
};

// Static method
exampleSchema.statics.findActive = function () {
  return this.find({ status: "active" });
};

// Virtual field
exampleSchema.virtual("isAdult").get(function () {
  return this.age >= 18;
});

// Pre-save middleware
exampleSchema.pre("save", async function (next) {
  // Custom logic before saving (e.g., hash password, validate)
  next();
});

const Example = mongoose.model("Example", exampleSchema);
export default Example;
*/

export default {};
