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
      const error = new Error("add envelope id and budget");
      error.status = 400;
      next(error);
    }
  }
});

// withdraws amount by envelope id
envelopesRouter.post("/:id/withdraw", (req, res, next) => {
  const amount = req.query.amount;
  const envelopeId = envelopes.findIndex((el) => el.id === req.params.id);
  // validates withdrawal
  if (amount && envelopeId > -1) {
    envelopes[envelopeId].budget -= amount;
    res.send({ id: req.params.id, budget: envelopes[envelopeId].budget });
  } else {
    const error = new Error("withdrawal not valid");
    error.status = 400;
    next(error);
  }
});

// transfers money from one envelope to another
envelopesRouter.post('/:id1/transfer-to/:id2', (req, res, next) => {
    const envelopeId1 = envelopes.findIndex((el) => el.id === req.params.id1);
    const envelopeId2 = envelopes.findIndex((el) => el.id === req.params.id2);
    const amount = Number(req.query.amount);
    if (envelopeId1 > -1 && envelopeId2 > -1 && amount) {
        envelopes[envelopeId1].budget = Number(envelopes[envelopeId1].budget) - amount;
        envelopes[envelopeId2].budget = Number(envelopes[envelopeId2].budget) + amount;
        res.send({ id: req.params.id1, budget: envelopes[envelopeId1].budget,
            id: req.params.id2, budget: envelopes[envelopeId2].budget });
    } else {
        const error = new Error('transfer not valid');
        error.status = 400;
        next(error);
    }
})

// deletes envelope by id
envelopesRouter.delete('/:id', (req, res, next) => {
    const envelopeId = envelopes.findIndex((el) => el.id === req.params.id);
    if (envelopeId !== -1) {
        envelopes.splice(envelopeId, 1);
        res.send(envelopes);
    } else {
        const error = new Error("deletion not completed! Invalid id.");
        error.status = 400;
        next(error);
    }
});

module.exports = envelopesRouter;
