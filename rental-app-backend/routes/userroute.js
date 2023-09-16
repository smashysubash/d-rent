const Model = require("../model/user");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
  const data = new Model({
    email: req.body.email,
    password: req.body.password,
  });

  try {
    const dataToSave = await data.save();
    res.status(200).json({ success: true, error: null });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const data = await Model.findOne({ email: req.body.email });
    if (data == null) {
      res.status(401).json({ error: "user not found" });
    } else {
      if (req.body.password == data.password) {
        let token = jwt.sign(
          { email: req.body.email, role: "user" },
          "keyboard cat 4 ever",
          { expiresIn: 129600 }
        ); // Signing the token
        res.json({
          error: null,
          token,
        });
      } else {
        res.status(401).json({ error: "Invalid username or password" });
      }
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  signup,
  login,
};
