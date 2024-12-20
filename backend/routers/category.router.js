const { addCategory, editCategory, search, viewCategory } = require("../controllers/category.controller");
const { isAuthenticated, isAuthorization } = require("../middlewares/auth.middleware");

const router = require("express").Router();

router.route("/all").get(isAuthenticated, isAuthorization("LIST_CATEGORY"), search);
router.route("/view/:id").get(isAuthenticated, isAuthorization("VIEW_CATEGORY"), viewCategory);
router.route("/create").post(isAuthenticated, isAuthorization("CREATE_CATEGORY"), addCategory);
router.route("/edit/:id").put(isAuthenticated, isAuthorization("EDIT_CATEGORY"), editCategory);
router.route("/delete/:id").delete(isAuthenticated, isAuthorization("DELETE_CATEGORY"), editCategory);

module.exports = router;