const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const auth = require("../../middleware/auth");
const company = require("../../middleware/company");

const Client = require("../../models/Clients");

router.get("/", auth, async (req, res) => {
  const clients = await Client.find({ parentCompany: req.user._id });
  res.send(clients);
});

router.post("/", [auth, company], async (req, res) => {
  const { clientCompanyName, aliasName, contact, address, projects } = req.body;

  const client = new Client({
    clientCompanyName,
    aliasName,
    parentCompany: req.user._id,
    contact,
    address,
    projects
  });

  await client.save();

  res.send(client);
});

router.put("/", auth, async (req, res) => {
  const { clientId, clientCompanyName, aliasName, contact, address } = req.body;

  if (!mongoose.Types.ObjectId.isValid(clientId)) {
    return res.status(400).send("Object IDs are not valid");
  }

  const client = await Client.findById(clientId);

  if (!client) {
    return res.status(404).send("Invalid token for operation");
  }

  client.clientCompanyName = clientCompanyName;
  client.aliasName = aliasName;
  client.contact = contact;
  client.address = address;

  await client.save();

  res.send(client);
});

router.put("/addproject", auth, async (req, res) => {
  const client = await Client.findById(req.body.clientId);

  client.projects.push(req.body.project);

  await client.save();

  res.send(client.projects);
});

module.exports = router;
