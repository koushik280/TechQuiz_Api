import LevelConfig from "../../models/LevelConfig.js";
import Technology from "../../models/Technology.js";

class LevelConfigController {
  //get all level configurations(optionally filter by technology)
  //GET/api/admin/level-configs?technology=id
  async getLevelConfig(req, res) {
    try {
      const { technology } = req.query;
      let filter = {};
      if (technology) filter.technology = technology;

      const configs = await LevelConfig.find(filter).populate(
        "technology",
        "name",
      );

      res.status(200).json(configs);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  //create or update a level configuration
  //POST /api/admin/level-configs
  async upsertLvelConfig(req, res) {
    try {
      const { technologyId, level, totalQuestions, timeLimit } = req.body;

      const technology = await Technology.find({ technologyId });

      if (!technology) {
        return res.status(404).json({ message: "Technology not Found" });
      }

      const allowedLevels = ["basic", "intermediate", "advance"];

      if (!allowedLevels.includes(level)) {
        return res.status(400).json({
          message: "Invlaid level should be basic intermediate or advance.",
        });
      }

      let config = await LevelConfig.findOne({
        technology: technologyId,
        level,
      });

      if (config) {
        config.totalQuestions = totalQuestions;
        config.timeLimit = timeLimit;
        await config.save();
        return res.status(200).json(config);
      } else {
        config = await LevelConfig.create({
          technology: technologyId,
          level,
          totalQuestions,
          timeLimit,
        });
        return res.status(201).json(config);
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  //Delete level Config
  //DELETE /api/admin/level-config/:id

  async deleteLevelConfig(req, res) {
    try {
      const { id } = req.params;
      const config = await LevelConfig.findById(id);
      if (!config) {
        return res
          .status(404)
          .json({ message: "Level configuration not found" });
      }
      await config.deleteOne();
      res.status(200).json({ message: "Level configurations deleted" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

const LevelConfigCtrl = new LevelConfigController();

export { LevelConfigCtrl };
