const express = require("express");
const envelopesRouter = express.Router();

const envelopes = [];

// get all envelopes
envelopesRouter.get("/", (req, res) => {
  res.send(envelopes);
});

// get envelope by id
envelopesRouter.get("/:id", (req, res) => {
  const envelope = envelopes.filter((el) => el.id === req.params.id);
  if (envelope) {
    res.send(envelope);
  } else {
    res.status(404).send("envelope(s) not found");
  }
});

// create new envelope
envelopesRouter.post("/", (req, res, next) => {
  const envelope = req.query;
  //checks if id is unique
  if (envelopes.some((el) => el.id == envelope.id)) {
    const error = new Error("the id is already in use!");
    error.status = 400;
    next(error);
  } else {
    const id = Number(envelope.id);
    const budget = Number(envelope.budget);
    // validates id and budget
    if (id && budget) {
      envelopes.push(envelope);
      res.status(201).send(envelope);
    } else {
      let error = new Error('add envelope id and budget');
      error.status = 400;
      next(error);
    }
  }
});

// withdraws amount by envelope id
envelopesRouter.post('/:id/withdraw', (req, res, next) => {
    const amount = Number(req.query.amount);
    const envelopeId = envelopes.findIndex(el => el.id === req.params.id);
    // validates withdrawal 
    if (amount && envelopeId !== -1) {
        envelopes[envelopeId].budget -= amount;
        res.send({budget: envelopes[envelopeId].budget});
    } else {
        let error = new Error('withdrawal not valid');
        error.status = 400;
        next(error);
    }
})

module.exports = envelopesRouter;
