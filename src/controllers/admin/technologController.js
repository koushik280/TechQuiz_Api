import Technology from "../../models/Technology.js";
import LevelConfig from "../../models/LevelConfig.js";
import Question from "../../models/Question.js";

class TechnologyController {
  async getTechonologies(req, res) {
    try {
      const technologies = await Technology.find().sort({ name: 1 });
      res.status(200).json(technologies);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  //create technoloy
  //post ->/api/admin/technologies
  async createTechnology(req, res) {
    try {
      const { name, description, icon } = req.body;
      //check the technoloy is exists
      const exists = await Technology.findOne({
        name: { $regex: new RegExp(`^${name},'i'`) },
      });

      if (exists)
        return res.status(400).json({ message: "Techonology Already exists" });
      const technoloy = await Technology.create({ name, description, icon });
      res.status(201).json(technoloy);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  //update Techonoloy
  //PUT->/api/admin/technologies/:id
  async updateTechnology(req, res) {
    try {
      const { id } = req.params;
      const { name, description, icon } = req.body;
      const technoloy = await Technology.findById(id);

      if (!technoloy) {
        return res.status(400).json({ message: "Techonolgy not Found" });
      }

      //if the name is updated here we check that technoloy with same name already present or not
      if (name && name != technoloy.name) {
        const exists = await Technology.findOne({
          name: {
            $regex: new RegExp(`^${name}`, "i"),
          },
        });

        if (exists) {
          return res
            .status(400)
            .json({ message: "Techonoloy with that name already exists" });
        }
        technoloy.name = name;
      }

      if (description) technoloy.description = description;
      if (icon) technoloy.icon = icon;
      await technoloy.save();
      res.status(200).json(technoloy);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  //Delete Technology
  //DELETE->api/admin/technologies/:id
  async deleteTechnology(req, res) {
    try {
      const { id } = req.params;
      const technoloy = await Technology.findById(id);

      if (!technoloy)
        return res.status(400).json({ message: "Technology not found" });

      const levelConfigsCount = await LevelConfig.countDocuments({
        technology: id,
      });

      const questionsCount = await Question.countDocuments({ technology: id });

      if (levelConfigsCount > 0 || questionsCount > 0) {
        return res.status(400).json({
          message: `Cannot delete technology. It is referenced in ${levelConfigsCount} level config(s) and ${questionsCount} question(s).`,
        });
      }

      await technoloy.deleteOne();
      res.status(200).json({ message: "Technology deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

const TechnologyCtrl = new TechnologyController();
export { TechnologyCtrl };
