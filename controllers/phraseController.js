const Phrase = require("../models").Phrase;
const Tag = require("../models").Tag;
const asyncHandler = require("express-async-handler");

const addPhrase = asyncHandler(async (req, res) => {
  const { phrase, definition, frequency } = req.body;
  const userId = req.user.id;
  if (!phrase) {
    res.status(400);
    throw new Error("Phrase cannot be blank");
  }
  try {
    const newPhrase = await Phrase.create({
      userId,
      phrase,
      definition,
      frequency,
    });

    return res.status(201).json({
      message: "Phrase created successfully",
      phrase: newPhrase,
    });
  } catch (error) {
    return res.status(400).json({ error });
  }
});

const updatePhrase = asyncHandler(async (req, res) => {
  const { phrase, definition, frequency } = req.body;
  const id = req.params.id;

  try {
    const foundPhrase = await Phrase.findOne({ where: { id: id } });

    if (!foundPhrase) {
      return res.status(206).json({ message: "Phrase not found" });
    }

    const updatedPhrase = await foundPhrase.update({
      phrase,
      definition,
      frequency,
    });

    return res.status(202).json({
      message: "Phrase updated successfully",
      updatedPhrase,
    });
  } catch (error) {
    return res.status(400).json({ error: error });
  }
});

const getPhrases = asyncHandler(async (req, res) => {
  const phrases = await Phrase.findAll({
    where: {
      userId: req.user.id,
    },
  });
  res.status(200).json(phrases);
});

const addTagToPhrase = asyncHandler(async (req, res) => {
  const { phraseId, tagId } = req.params; // Retrieving from route parameters

  try {
    const phrase = await Phrase.findByPk(phraseId);
    if (!phrase) {
      return res.status(404).json({ message: "Phrase not found" });
    }

    const tag = await Tag.findByPk(tagId);
    if (!tag) {
      return res.status(404).json({ message: "Tag not found" });
    }

    await phrase.addTag(tag);

    return res
      .status(200)
      .json({ message: "Tag added to phrase successfully" });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

module.exports = {
  addPhrase,
  getPhrases,
  updatePhrase,
  addTagToPhrase,
};
