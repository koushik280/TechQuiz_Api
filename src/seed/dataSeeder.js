import Techonology from "../models/Technology.js";
import LevelConfig from "../models/LevelConfig.js";
import Question from "../models/Question.js";

const seedTechnologies = async () => {
  const technologies = [
    { name: "HTML", description: "HyperText Markup Language", icon: "html5" },
    { name: "CSS", description: "Cascading Style Sheets", icon: "css3" },
    {
      name: "JavaScript",
      description: "Programming language for web",
      icon: "javascript",
    },
    { name: "React", description: "Frontend library", icon: "react" },
    { name: "Node", description: "Backend runtime", icon: "nodejs" },
  ];

  for (const tech of technologies) {
    const exists = await Techonology.findOne({ name: tech.name });
    if (!exists) {
      await Techonology.create(tech);
      console.log(`Created technology: ${tech.name}`);
    } else {
      console.log(`Technology ${tech.name} already exists, skipping.`);
    }
  }

  return await Techonology.find();
};

const seedLevelConfigs = async (technologies) => {
  const levels = [
    { level: "basic", totalQuestions: 30, timeLimit: 5 }, // minutes
    { level: "intermediate", totalQuestions: 60, timeLimit: 10 },
    { level: "advanced", totalQuestions: 100, timeLimit: 15 },
  ];

  for (const tech of technologies) {
    for (const level of levels) {
      const exists = await LevelConfig.findOne({
        technology: tech._id,
        level: level.level,
      });
      if (!exists) {
        await LevelConfig.create({
          technology: tech._id,
          level: level.level,
          questionCount: level.totalQuestions,
          timeLimit: level.timeLimit,
        });
        console.log(`Created ${tech.name} - ${level.level} config`);
      } else {
        console.log(
          `Config for ${tech.name} - ${level.level} already exists, skipping.`,
        );
      }
    }
  }
};

const seedQuestions = async (technologies) => {
  const difficulties = ["easy", "medium", "hard"];

  // Sample question templates for each technology (just a few to test)
  const questionTemplates = {
    HTML: [
      // EASY (10+)
      {
        text: "What does HTML stand for?",
        options: [
          "Hyper Text Markup Language",
          "High Tech Modern Language",
          "Hyper Transfer Markup Language",
          "Home Tool Markup Language",
        ],
        correctOption: 0,
        difficulty: "easy",
      },
      {
        text: "Which tag is used for hyperlinks?",
        options: ["<a>", "<link>", "<href>", "<url>"],
        correctOption: 0,
        difficulty: "easy",
      },
      {
        text: "Which tag is used for images?",
        options: ["<img>", "<image>", "<pic>", "<src>"],
        correctOption: 0,
        difficulty: "easy",
      },
      {
        text: "Which tag creates a paragraph?",
        options: ["<p>", "<para>", "<text>", "<pg>"],
        correctOption: 0,
        difficulty: "easy",
      },
      {
        text: "Which tag is used for lists?",
        options: ["<ul>", "<li>", "<list>", "<ol>"],
        correctOption: 0,
        difficulty: "easy",
      },

      // MEDIUM (8+)
      {
        text: "What is semantic HTML?",
        options: ["Meaningful tags", "Styling", "JS logic", "Database"],
        correctOption: 0,
        difficulty: "medium",
      },
      {
        text: "Difference between <div> and <span>?",
        options: ["Block vs inline", "Same", "Both inline", "Both block"],
        correctOption: 0,
        difficulty: "medium",
      },
      {
        text: "Which tag defines table row?",
        options: ["<tr>", "<td>", "<th>", "<table>"],
        correctOption: 0,
        difficulty: "medium",
      },

      // HARD (5+)
      {
        text: "What is DOM?",
        options: ["Document Object Model", "Database", "Server", "Language"],
        correctOption: 0,
        difficulty: "hard",
      },
      {
        text: "What does <canvas> do?",
        options: ["Graphics", "Forms", "Text", "Links"],
        correctOption: 0,
        difficulty: "hard",
      },
    ],

    CSS: [
      // EASY
      {
        text: "What does CSS stand for?",
        options: [
          "Cascading Style Sheets",
          "Creative Style Sheets",
          "Computer Style Sheets",
          "Colorful Style Sheets",
        ],
        correctOption: 0,
        difficulty: "easy",
      },
      {
        text: "Which property changes color?",
        options: ["color", "text-color", "bgcolor", "font"],
        correctOption: 0,
        difficulty: "easy",
      },
      {
        text: "Which property sets background?",
        options: ["background-color", "bgcolor", "color", "background"],
        correctOption: 0,
        difficulty: "easy",
      },

      // MEDIUM
      {
        text: "What is Flexbox?",
        options: ["Layout system", "Color system", "Database", "API"],
        correctOption: 0,
        difficulty: "medium",
      },
      {
        text: "What is Grid?",
        options: ["2D layout", "1D layout", "Color tool", "Animation"],
        correctOption: 0,
        difficulty: "medium",
      },

      // HARD
      {
        text: "What is specificity?",
        options: ["Priority rules", "Color", "Font", "Margin"],
        correctOption: 0,
        difficulty: "hard",
      },
      {
        text: "What is z-index?",
        options: ["Stack order", "Color", "Font", "Width"],
        correctOption: 0,
        difficulty: "hard",
      },
    ],

    JavaScript: [
      // EASY
      {
        text: "How to declare variable?",
        options: ["var", "let", "const", "all"],
        correctOption: 3,
        difficulty: "easy",
      },
      {
        text: "What is typeof?",
        options: ["Type checker", "Loop", "Function", "Object"],
        correctOption: 0,
        difficulty: "easy",
      },

      // MEDIUM
      {
        text: "What is closure?",
        options: ["Function with scope", "Loop", "Object", "API"],
        correctOption: 0,
        difficulty: "medium",
      },
      {
        text: "What is promise?",
        options: ["Async handler", "Loop", "Object", "API"],
        correctOption: 0,
        difficulty: "medium",
      },

      // HARD
      {
        text: 'Output of 5 + "5"?',
        options: ["10", "55", "NaN", "undefined"],
        correctOption: 1,
        difficulty: "hard",
      },
      {
        text: "What is event loop?",
        options: ["Async engine", "Loop", "API", "Function"],
        correctOption: 0,
        difficulty: "hard",
      },
    ],

    React: [
      {
        text: "What is React?",
        options: ["Library", "Framework", "DB", "Language"],
        correctOption: 0,
        difficulty: "easy",
      },
      {
        text: "What is JSX?",
        options: ["JS XML", "HTML", "CSS", "JSON"],
        correctOption: 0,
        difficulty: "easy",
      },

      {
        text: "What is useEffect?",
        options: ["Side effects", "State", "Routing", "API"],
        correctOption: 0,
        difficulty: "medium",
      },
      {
        text: "What is props?",
        options: ["Data passing", "State", "Hook", "API"],
        correctOption: 0,
        difficulty: "medium",
      },

      {
        text: "What is Virtual DOM?",
        options: ["Light DOM", "Database", "API", "Server"],
        correctOption: 0,
        difficulty: "hard",
      },
    ],

    Node: [
      {
        text: "What is Node.js?",
        options: ["Runtime", "Framework", "DB", "Library"],
        correctOption: 0,
        difficulty: "easy",
      },
      {
        text: "What is npm?",
        options: ["Package manager", "Tool", "DB", "API"],
        correctOption: 0,
        difficulty: "easy",
      },

      {
        text: "What is event loop?",
        options: ["Async handler", "Loop", "API", "DB"],
        correctOption: 0,
        difficulty: "medium",
      },

      {
        text: "What is non-blocking IO?",
        options: ["Async process", "Sync", "Loop", "File"],
        correctOption: 0,
        difficulty: "hard",
      },
    ],
  };
  // For each technology, create at least 3 easy questions (enough to test)
  // We'll also create some medium/hard if needed later, but for initial testing, easy covers.
  for (const tech of technologies) {
    const techName = tech.name;
    const templates = questionTemplates[techName];
    if (!templates) continue;

    for (const template of templates) {
      const exists = await Question.findOne({
        text: template.text,
        technology: tech._id,
      });
      if (!exists) {
        const correctAnswer = template.options[template.correctOption];
        await Question.create({
          text: template.text,
          options: template.options,
          correctAnswer: correctAnswer, // store the answer text
          explanation: `Explanation for: ${template.text}`,
          technology: tech._id,
          difficulty: template.difficulty,
        });
        console.log(
          `Created question: ${techName} - ${template.text.substring(0, 50)}`,
        );
      } else {
        console.log(
          `Question already exists: ${template.text.substring(0, 50)}`,
        );
      }
    }
  }
};

export const seedData = async () => {
  try {
    console.log("Starting data seeding...");

    // Seed technologies
    const technologies = await seedTechnologies();

    // Seed level configurations (depends on technologies)
    await seedLevelConfigs(technologies);

    // Seed questions
    await seedQuestions(technologies);

    console.log("Data seeding completed successfully.");
  } catch (error) {
    console.error("Error seeding data:", error);
    throw error;
  }
};
