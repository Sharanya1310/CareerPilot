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
    return Interview.create({
      ...interviewData,
      user: userId,
    });
  }

  static async deleteInterview(userId, interviewId) {
    const intv = await this.getInterviewById(userId, interviewId);
    await intv.deleteOne();
    return intv;
  }
}

export default InterviewService;
