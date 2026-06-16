import InterviewExperience from "../models/InterviewExperience.js";
import User from "../models/User.js";

const seedExperiences = async () => {
  try {
    const count = await InterviewExperience.countDocuments();
    if (count > 0) {
      console.log("ℹ️  Interview experiences collection already seeded. Skipping.");
      return;
    }

    // Find a user to attach these to
    let user = await User.findOne({ email: "sharanya@email.com" });
    if (!user) {
      user = await User.findOne();
    }
    if (!user) {
      console.log("⚠️  No user found to seed interview experiences. Skipping seeder.");
      return;
    }

    const userId = user._id;

    const experiences = [
      {
        user: userId,
        company: "Accenture",
        role: "Software Engineer - Frontend",
        difficulty: "Medium",
        outcome: "Selected",
        tags: ["#Frontend", "#ReactJS", "#FTE"],
        description: "The process was quite structured. Started with an online assessment focused on data structures and general coding aptitude. The second round was a deep dive into React and system design for a scalable dashboard. Finally, an HR round focusing on cultural fit and resume achievements.",
        upvotes: 42,
        upvotedBy: [],
        commentsCount: 8,
        rounds: [
          { title: "Round 1: Online Assessment", focus: "Data structures and general coding aptitude" },
          { title: "Round 2: React Technical", focus: "React Hooks, state management, frontend rendering optimizations" },
          { title: "Round 3: HR Fit", focus: "Resume deep dive, cultural fit and scenario questions" }
        ],
        prepTips: [
          "Be thorough with Javascript closures and async behaviors.",
          "Prepare to explain state management workflows (Redux, Context API).",
          "Highlight concrete metrics in your project descriptions."
        ]
      },
      {
        user: userId,
        company: "Google",
        role: "Senior Data Scientist",
        difficulty: "Hard",
        outcome: "Selected",
        tags: ["#MachineLearning", "#Statistics", "#Python"],
        description: "Six rounds total. One phone screen, four technical interviews (Coding, ML Theory, Case Study, Applied Stats), and one Googley/Leadership round. The technical depth required was significant, especially in bayesian statistics and model validation frameworks.",
        upvotes: 126,
        upvotedBy: [],
        commentsCount: 24,
        rounds: [
          { title: "Round 1: Initial Phone Screen", focus: "ML fundamentals and simple coding exercise" },
          { title: "Round 2: Machine Learning Theory", focus: "Deep dive into model architectures, loss functions, optimization" },
          { title: "Round 3: Applied Statistics", focus: "A/B testing, hypothesis tests, probability distributions" },
          { title: "Round 4: Machine Learning Case Study", focus: "Designing an end-to-end recommendation pipeline at scale" },
          { title: "Round 5: Coding & Data Structures", focus: "Medium level LeetCode styling and complexity explanations" },
          { title: "Round 6: Googliness & Leadership", focus: "Team alignment, project ownership, ambiguity handling" }
        ],
        prepTips: [
          "Study Bayesian statistics and causal inference in detail.",
          "Practice building end-to-end ML architectures for scale.",
          "Prepare standard behavioral examples highlighting leadership."
        ]
      },
      {
        user: userId,
        company: "Microsoft",
        role: "Cloud Architect",
        difficulty: "Medium",
        outcome: "Selected",
        tags: ["#Cloud", "#Azure", "#Architect"],
        description: "Detailed Process Breakdown for the Microsoft Azure Team. The interview was highly technical but very conversation-based, focusing on practical cloud migration design and kubernetes scale topologies.",
        upvotes: 15,
        upvotedBy: [],
        commentsCount: 3,
        rounds: [
          { title: "Round 1: Technical Screening", focus: "Core Azure services, Kubernetes containerization, networking fundamentals" },
          { title: "Round 2: Architecture Deep-Dive", focus: "High availability, migration strategies, hybrid architectures" },
          { title: "Round 3: Behavioral & HR", focus: "Microsoft leadership values, conflict resolution" }
        ],
        prepTips: [
          "Know the CAP theorem and how Azure SQL services handle it.",
          "Practice the STAR method for all behavioral and project ownership questions.",
          "Understand hybrid cloud connectivity architectures (ExpressRoute, VPNs)."
        ]
      }
    ];

    await InterviewExperience.insertMany(experiences);
    console.log(`✅ Seeded ${experiences.length} interview experiences successfully.`);
  } catch (error) {
    console.error("❌ Error seeding interview experiences:", error.message);
  }
};

export default seedExperiences;
