import Application from "../models/Application.js";
import AppError from "../utils/AppError.js";

class ApplicationService {
  static async getUserApplications(userId) {
    return Application.find({ user: userId }).sort({ createdAt: -1 });
  }

  static async getApplicationById(userId, appId) {
    const app = await Application.findOne({ _id: appId, user: userId });
    if (!app) {
      throw new AppError("Application not found.", 404);
    }
    return app;
  }

  static async createApplication(userId, appData) {
    const timeline = appData.timeline || `Applied on ${new Date().toLocaleDateString()}`;
    const app = await Application.create({
      ...appData,
      user: userId,
      timeline,
    });

    // Send application created notification
    try {
      import("./notificationService.js").then(module => {
        module.default.createNotification(
          userId,
          `Application Tracked: ${app.company}`,
          `Successfully added your ${app.role} application at ${app.company} under tracking.`,
          "application_followup",
          app._id.toString()
        ).catch(console.error);
      });
    } catch (err) {
      console.error("Failed to trigger application notification", err);
    }

    return app;
  }

  static async updateApplicationStage(userId, appId, stage) {
    const app = await this.getApplicationById(userId, appId);
    const oldStage = app.stage;
    app.stage = stage;
    app.timeline = `${app.timeline || ""}\nStage updated to ${stage} on ${new Date().toLocaleDateString()}`;
    await app.save();

    // Trigger stage change notifications
    try {
      import("./notificationService.js").then(module => {
        let title = `Stage Updated: ${app.company}`;
        let message = `Your application for ${app.role} at ${app.company} is now in the '${stage}' stage.`;
        let type = "application_followup";

        if (stage === "Interview") {
          title = `Interview Stage Reached at ${app.company}!`;
          message = `Excellent news! Your application for ${app.role} at ${app.company} has progressed to the Interview stage. Let's start preparing!`;
          type = "upcoming_interview";
        } else if (stage === "OA" || stage === "Assessment") {
          title = `Assessment Pending: ${app.company}`;
          message = `Your application for ${app.role} at ${app.company} requires an assessment/OA. Check your inbox for details.`;
        }

        module.default.createNotification(
          userId,
          title,
          message,
          type,
          app._id.toString()
        ).catch(console.error);
      });
    } catch (err) {
      console.error("Failed to trigger application stage notification", err);
    }

    return app;
  }

  static async updateApplication(userId, appId, appData) {
    const app = await this.getApplicationById(userId, appId);
    
    // Update fields
    const fieldsToUpdate = [
      "company",
      "role",
      "stage",
      "category",
      "date",
      "deadline",
      "interviewer",
      "notes",
      "link",
      "timeline"
    ];

    fieldsToUpdate.forEach((field) => {
      if (appData[field] !== undefined) {
        app[field] = appData[field];
      }
    });

    await app.save();
    return app;
  }

  static async deleteApplication(userId, appId) {
    const app = await this.getApplicationById(userId, appId);
    await app.deleteOne();
    return app;
  }
}

export default ApplicationService;
