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
    return Application.create({
      ...appData,
      user: userId,
      timeline,
    });
  }

  static async updateApplicationStage(userId, appId, stage) {
    const app = await this.getApplicationById(userId, appId);
    app.stage = stage;
    app.timeline = `${app.timeline || ""}\nStage updated to ${stage} on ${new Date().toLocaleDateString()}`;
    await app.save();
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
