import Interview from "../models/Interview.js";
import AppError from "../utils/AppError.js";

class InterviewService {
  static async getUserInterviews(userId) {
    return Interview.find({ user: userId }).sort({ createdAt: 1 });
  }

  static async getInterviewById(userId, interviewId) {
    const intv = await Interview.findOne({ _id: interviewId, user: userId });
    if (!intv) {
      throw new AppError("Interview not found.", 404);
    }
    return intv;
  }

  static async scheduleInterview(userId, interviewData) {
    const interview = await Interview.create({
      ...interviewData,
      user: userId,
    });

    // Trigger upcoming interview notification asynchronously
    try {
      import("./notificationService.js").then(module => {
        module.default.createNotification(
          userId,
          `Upcoming Interview: ${interview.company}`,
          `Your interview for ${interview.role} at ${interview.company} is scheduled for ${interview.date} at ${interview.time}.`,
          "upcoming_interview",
          interview._id.toString()
        ).catch(console.error);
      });
    } catch (err) {
      console.error("Failed to trigger interview notification", err);
    }

    return interview;
  }

  static async deleteInterview(userId, interviewId) {
    const intv = await this.getInterviewById(userId, interviewId);
    await intv.deleteOne();
    return intv;
  }
}

export default InterviewService;
