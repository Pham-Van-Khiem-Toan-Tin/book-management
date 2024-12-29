const { search, createBook } = require('../controllers/book.controller');
const { isAuthenticated, isAuthorization } = require('../middlewares/auth.middleware');

const router = require('express').Router();

router.route("/all").get(isAuthenticated, isAuthorization("LIST_BOOK"), search);
router.route("/create").post(isAuthenticated, isAuthorization("CREATE_BOOK"), createBook);

module.exports = router;