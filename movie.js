const express = require("express");
const router = express.Router();

const auth = require("../helpers/auth");
const movie = require("../helpers/movie");

router.get("/", auth.verifyToken, movie.getMovies);
router.post("/", auth.verifyToken, movie.addMovie);
router.put("/:id", auth.verifyToken, movie.updateMovie);
router.delete("/:id", auth.verifyToken, movie.deleteMovie);

module.exports = router;