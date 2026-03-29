import User from "../models/User.js";
import {
  generateAcessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "../services/authService.js";

class UserController {
  async register(req, res) {
    try {
      const { name, email, password } = req.body;
      const existsuser = await User.findOne({ email });
      if (existsuser) {
        return res.status(400).json({
          message: "user already exists",
        });
      }
      const user = await User.create({
        name,
        email,
        password,
        role: "user",
      });
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } catch (error) {
      console.log("register", error);
      res.status(500).json({ message: error.message });
    }
  }
  async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res
          .status(400)
          .json({ message: "Please provide email and password" });
      }

      const user = await User.findOne({ email }).select("+password");
      if (!user) {
        return res.status(401).json("Invalid credentials");
      }

      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res.status(401).json("Invalid credentials");
      }

      const paylod = {
        id: user._id,
        email: user.email,
        role: user.role,
      };

      const accessToken = generateAcessToken(paylod);
      const refereshToken = generateRefreshToken(paylod);

      //const isProducation = process.env.NODE_ENV === "production";

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 15 * 60 * 1000,
      });
      res.cookie("refreshToken", refereshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  async logoutUser(req, res) {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.status(200).json({ message: "Logged out successfully" });
  }
  async refereshToken(req, res) {
    try {
      const refereshToken = req.cookies.refreshToken;
      if (!refereshToken) {
        return res
          .status(401)
          .json({ message: "No refresh token is provieded" });
      }

      const decoded = verifyRefreshToken(refereshToken);
      if (!decoded) {
        return res
          .status(403)
          .json({ message: "Invalid or expired refresh token" });
      }

      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      const payload = {
        id: user._id,
        email: user.email,
        role: user.role,
      };

      const newAccessToken = generateAcessToken(payload);

      //const isProduction = process.env.NODE_ENV === "production";
      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 15 * 60 * 1000,
      });

      res.status(200).json({ message: "Token refreshed" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getMe(req, res) {
    try {
      // req.user is set by authenticate middleware
      const user = await User.findById(req.user.id).select("-password");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

const UserCtrl = new UserController();

export default UserCtrl;
