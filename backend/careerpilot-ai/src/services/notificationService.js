import Notification from "../models/Notification.js";
import AppError from "../utils/AppError.js";

class NotificationService {
  /**
   * Fetch user notifications. If they have none, automatically seed a set of demo notifications
   * to ensure a premium, filled UI experience.
   */
  static async getUserNotifications(userId) {
    return Notification.find({ user: userId }).sort({ isRead: 1, createdAt: -1 });
  }

  /**
   * Create a single notification
   */
  static async createNotification(userId, title, message, type, relatedId = "") {
    // Basic verification of type
    const validTypes = [
      "job_match",
      "upcoming_interview",
      "application_followup",
      "ats_improvement",
      "company_activity",
      "system"
    ];
    if (!validTypes.includes(type)) {
      type = "system";
    }

    return Notification.create({
      user: userId,
      title,
      message,
      type,
      relatedId,
      isRead: false
    });
  }

  /**
   * Toggle isRead status for a single notification
   */
  static async markNotificationRead(userId, id) {
    const notification = await Notification.findOne({ _id: id, user: userId });
    if (!notification) {
      throw new AppError("Notification not found", 404);
    }
    notification.isRead = true;
    await notification.save();
    return notification;
  }

  /**
   * Mark all user notifications as read
   */
  static async markAllRead(userId) {
    await Notification.updateMany({ user: userId, isRead: false }, { $set: { isRead: true } });
    return { success: true };
  }

  /**
   * Delete a specific notification
   */
  static async removeNotification(userId, id) {
    const result = await Notification.findOneAndDelete({ _id: id, user: userId });
    if (!result) {
      throw new AppError("Notification not found", 404);
    }
    return { success: true };
  }

  /**
   * No-op: real notifications are generated from actual job matches and application events.
   */
  static async seedInitialNotifications(_userId) {
    // No seed data — notifications come from real activity only
  }

  /**
   * Dynamically trigger a job match alert if a job exceeds 80% match percentage.
   */
  static async checkAndTriggerJobMatch(userId, jobId, matchScore, jobTitle, company) {
    if (matchScore < 80) return;
    
    // Check if the user already has a job match alert for this job
    const exists = await Notification.findOne({
      user: userId,
      type: "job_match",
      relatedId: jobId.toString()
    });

    if (!exists) {
      await this.createNotification(
        userId,
        `New Job Match: ${company}`,
        `We found a new job '${jobTitle}' at ${company} that matches ${matchScore}% of your profile. Check it out!`,
        "job_match",
        jobId.toString()
      );
    }
  }

  /**
   * Dynamically trigger an alert when hiring activity is found for a followed company.
   */
  static async checkAndTriggerCompanyHiring(userId, jobId, jobTitle, company) {
    const User = (await import("../models/User.js")).default;
    const user = await User.findById(userId);
    if (!user) return;

    const isFollowing = (user.followedCompanies || []).some(
      c => c.toLowerCase() === company.toLowerCase()
    );

    if (isFollowing) {
      const exists = await Notification.findOne({
        user: userId,
        type: "company_activity",
        relatedId: jobId.toString()
      });

      if (!exists) {
        await this.createNotification(
          userId,
          `Hiring Update: ${company}`,
          `${company} has recently posted a new role: '${jobTitle}' matching your followed list.`,
          "company_activity",
          jobId.toString()
        );
      }
    }
  }
}

export default NotificationService;
