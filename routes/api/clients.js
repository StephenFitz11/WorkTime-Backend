const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const auth = require("../../middleware/auth");
const company = require("../../middleware/company");

const Client = require("../../models/Clients");
const User = require("../../models/Users");

// Get all clients of the user
router.get("/", auth, async (req, res) => {
  let empClients = req.query.empClients;

  if (empClients) {
    const employee = await User.findById(req.user._id)
      .select("clients")
      .populate("clients", ["clientCompanyName"]);

    return res.send(employee);
  }

  const clients = await Client.find({ parentCompany: req.user._id });
  res.send(clients);
});

// Get a client by ID
router.get("/:id", [auth, company], async (req, res) => {
  const client = await Client.findById(req.params.id);
  res.send(client);
});

router.post("/", [auth, company], async (req, res) => {
  const {
    clientCompanyName,
    email,
    street,
    city,
    state,
    zip,
    billRate,
    description
  } = req.body;

  const client = new Client({
    clientCompanyName,
    email,
    parentCompany: req.user._id,
    street,
    city,
    state,
    zip,
    billRate,
    description
  });

  await client.save();

  res.send(client);
});

router.put("/", [auth, company], async (req, res) => {
  const {
    clientId,
    clientCompanyName,
    email,
    billRate,
    street,
    state,
    city,
    zip,
    description
  } = req.body;

  if (!mongoose.Types.ObjectId.isValid(clientId)) {
    return res.status(400).send("Object IDs are not valid");
  }

  const client = await Client.findOneAndUpdate(
    { _id: clientId },
    {
      clientCompanyName,
      email,
      billRate,
      street,
      state,
      city,
      zip,
      description
    }
  );

  if (!client) {
    return res.status(404).send("Invalid client id for operation");
  }

  res.send(client);
});

router.put("/addproject", auth, async (req, res) => {
  const client = await Client.findById(req.body.clientId);

  client.projects.push(req.body.project);

  await client.save();

  res.send(client.projects);
});

router.delete("/:id", [auth, company], async (req, res) => {
  try {
    const client = await Client.findOneAndDelete({ _id: req.params.id });
    if (!client) {
      return res.status(400).send("No client found with that id");
    }
    res.send(client);
  } catch (ex) {
    res.send(ex.message);
  }
});
module.exports = router;
