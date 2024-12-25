const { search, viewBookshelf, addBookshelf, updateBookshelf, deleteBookshelf } = require('../controllers/bookshelf.controller');
const { isAuthenticated, isAuthorization } = require('../middlewares/auth.middleware');

const router = require('express').Router();


router.route("/all").get(isAuthenticated, isAuthorization("LIST_BOOKSHELF"), search);
router.route("/view/:id").get(isAuthenticated, isAuthorization("VIEW_BOOKSHELF"), viewBookshelf);
router.route("/create").post(isAuthenticated, isAuthorization("CREATE_BOOKSHELF"), addBookshelf);
router.route("/update/:id").put(isAuthenticated, isAuthorization("UPDATE_BOOKSHELF"), updateBookshelf);
router.route("/delete/:id").delete(isAuthenticated, isAuthorization("DELETE_BOOKSHELF"), deleteBookshelf);

module.exports = router;