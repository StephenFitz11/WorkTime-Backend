const express = require("express");
const router = express.Router();

const Client = require("../../models/Clients");

router.get("/", async (req, res) => {
  const projects = await Client.find({ projects: req.body.projectId });

  if (!projects) {
    return res.send("No project found");
  }

  res.send(projects);
});

module.exports = router;
