const { search, createBook, viewBook, updateBook, selectBook, allBookOfLibrary } = require('../controllers/book.controller');
const { isAuthenticated, isAuthorization } = require('../middlewares/auth.middleware');

const router = require('express').Router();

router.route("/all").get(isAuthenticated, isAuthorization("LIST_BOOK"), search);
router.route("/library").post(isAuthenticated, isAuthorization("LIST_BOOK"), allBookOfLibrary);
router.route("/select/all").get(isAuthenticated, isAuthorization("LIST_BOOK"), selectBook);
router.route("/create").post(isAuthenticated, isAuthorization("CREATE_BOOK"), createBook);
router.route("/view/:id").get(isAuthenticated, isAuthorization("VIEW_BOOK"), viewBook);
router.route("/edit/:id").put(isAuthenticated, isAuthorization("EDIT_BOOK"), updateBook);


module.exports = router;