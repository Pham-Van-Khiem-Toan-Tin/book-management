const { search, viewLibrary, addLibrary, editLibrary, deleteLibrary, allCommon } = require('../controllers/library.controller');
const { isAuthenticated, isAuthorization } = require('../middlewares/auth.middleware');

const router = require('express').Router();


router.route("/all").get(isAuthenticated, isAuthorization("LIST_LIBRARY"), search);
router.route("/common/all").get(isAuthenticated, isAuthorization("LIST_LIBRARY"), allCommon);   
router.route("/view/:id").get(isAuthenticated, isAuthorization("VIEW_LIBRARY"), viewLibrary);
router.route("/create").post(isAuthenticated, isAuthorization("CREATE_LIBRARY"), addLibrary);
router.route("/edit/:id").put(isAuthenticated, isAuthorization("EDIT_LIBRARY"), editLibrary);
router.route("/delete/:id").delete(isAuthenticated, isAuthorization("DELETE_LIBRARY"), deleteLibrary);

module.exports = router;