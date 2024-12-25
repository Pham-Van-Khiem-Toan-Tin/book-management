const { search, viewBookcase, addBookcase, editBookcase, deleteBookcase } = require('../controllers/bookcase.controller');
const { isAuthenticated, isAuthorization } = require('../middlewares/auth.middleware');

const router = require('express').Router();

router.route("/all").get(isAuthenticated, isAuthorization("LIST_BOOKCASE"), search);
router.route("/view/:id").get(isAuthenticated, isAuthorization("VIEW_BOOKCASE"), viewBookcase);
router.route("/create").post(isAuthenticated, isAuthorization("ADD_BOOKCASE"), addBookcase);
router.route("/edit/:id").put(isAuthenticated, isAuthorization("EDIT_BOOKCASE"), editBookcase);
router.route("/delete/:id").delete(isAuthenticated, isAuthorization("DELETE_BOOKCASE"), deleteBookcase);

module.exports = router;