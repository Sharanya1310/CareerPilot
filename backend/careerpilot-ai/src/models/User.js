import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    // ─── Core Auth Fields ──────────────────────────────────────
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },

    // ─── Profile / Career Fields ───────────────────────────────
    skills: {
      type: [String],
      default: [],
      validate: {
        validator: function (arr) {
          return arr.length <= 50;
        },
        message: "You can add a maximum of 50 skills",
      },
    },

    toolsSkills: {
      type: [String],
      default: [],
      validate: {
        validator: function (arr) {
          return arr.length <= 50;
        },
        message: "You can add a maximum of 50 tools",
      },
    },

    keywords: {
      type: [String],
      default: [],
      validate: {
        validator: function (arr) {
          return arr.length <= 50;
        },
        message: "You can add a maximum of 50 keywords",
      },
    },

    desiredRoles: {
      type: [String],
      default: [],
      validate: {
        validator: function (arr) {
          return arr.length <= 20;
        },
        message: "You can add a maximum of 20 desired roles",
      },
    },

    preferredLocations: {
      type: [String],
      default: [],
      validate: {
        validator: function (arr) {
          return arr.length <= 20;
        },
        message: "You can add a maximum of 20 preferred locations",
      },
    },

    workType: {
      type: String,
      enum: {
        values: ["Remote", "On-site", "Hybrid", "Any", ""],
        message: "workType must be one of: Remote, On-site, Hybrid, Any",
      },
      default: "",
    },

    followedCompanies: {
      type: [String],
      default: [],
      validate: {
        validator: function (arr) {
          return arr.length <= 100;
        },
        message: "You can follow a maximum of 100 companies",
      },
    },

    // ─── Meta Fields ──────────────────────────────────────────
    avatar: {
      type: String,
      default: "",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// ─── Pre-save: Hash password ───────────────────────────────────
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ─── Instance Method: Compare password ────────────────────────
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// ─── Instance Method: Safe public profile ─────────────────────
userSchema.methods.toPublicJSON = function () {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    skills: this.skills,
    toolsSkills: this.toolsSkills,
    keywords: this.keywords,
    desiredRoles: this.desiredRoles,
    preferredLocations: this.preferredLocations,
    workType: this.workType,
    followedCompanies: this.followedCompanies,
    avatar: this.avatar,
    lastLogin: this.lastLogin,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

// ─── Indexes ──────────────────────────────────────────────────

const User = mongoose.model("User", userSchema);
export default User;
