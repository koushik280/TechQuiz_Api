import Question from "../../models/Question.js";

import Technology from "../../models/Technology.js";

class QuestionsController {
  //get all the question with filter
  //GET /api/admin/questions?technology=id&difficulty=string
  async getQuestions(req, res) {
    try {
      const { technology, difficulty } = req.query;
      let filter = {};

      if (technology) filter.technology = technology;
      if (difficulty) filter.difficulty = difficulty;

      const questions = await Question.find(filter)
        .populate("technology", "name")
        .sort({ createdAt: -1 });

      res.status(200).json(questions);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  //create new questions
  //POST /api/admin/questions

  async createQuestion(req, res) {
    try {
      const {
        text,
        options,
        correctAnswer,
        explanation,
        technology,
        difficulty,
      } = req.body;

      const tech = await Technology.findById(technology);

      if (!tech)
        return res.status(404).json({ message: "Technology not found" });

      const allowedDifficulties = ["easy", "medium", "hard"];

      if (!allowedDifficulties.includes(difficulty)) {
        return res
          .status(400)
          .json({ message: "Difficulty must be easy, medium, or hard" });
      }

      if (!Array.isArray(options) || options.length < 2) {
        return res
          .status(400)
          .json({ message: "At least two options are required" });
      }

      if (
        typeof correctAnswer !== "number" ||
        correctAnswer < 0 ||
        correctAnswer >= options.length
      ) {
        return res
          .status(400)
          .json({ message: "Correct option must be a valid index" });
      }

      const question = await Question.create({
        text,
        options,
        correctAnswer,
        explanation,
        technology,
        difficulty,
      });

      const populated = await question.populate("technology", "name");
      res.status(201).json(populated);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  //Update a questions
  //PUT /api/admin/questions/:id

  async updateQuestion(req, res) {
    try {
      const { id } = req.params;
      const {
        text,
        options,
        correctOption,
        explanation,
        technology,
        difficulty,
      } = req.body;

      const question = await Question.findById(id);
      if (!question) {
        return res.status(404).json({ message: "Question not found" });
      }

      if (technology) {
        const tech = await Technology.findById(technology);
        if (!tech)
          return res.status(404).json({ message: "Technology not found" });
        question.technology = technology;
      }

      if (difficulty) {
        const allowed = ["easy", "medium", "hard"];
        if (!allowed.includes(difficulty))
          return res.status(400).json({ message: "Invalid difficulty" });
        question.difficulty = difficulty;
      }

      if (text) question.text = text;

      if (options) {
        if (!Array.isArray(options) || options.length < 2) {
          return res
            .status(400)
            .json({ message: "At least two options are required" });
        }
        question.options = options;
      }

      if (correctOption !== undefined) {
        if (
          typeof correctOption !== "number" ||
          correctOption < 0 ||
          correctOption >= question.options.length
        ) {
          return res
            .status(400)
            .json({ message: "Invalid correct option index" });
        }
        question.correctOption = correctOption;
      }

      if (explanation) question.explanation = explanation;

      await question.save();
      await question.populate("technology", "name");
      res.status(200).json(question);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async deleteQuestion(req, res) {
    try {
      const { id } = req.params;
      const question = await Question.findById(id);
      if (!question) {
        return res.status(404).json({ message: "Question not found" });
      }
      await question.deleteOne();
      res.status(200).json({ message: "Question deleted" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

const questionCtrl = new QuestionsController();

export { questionCtrl };
