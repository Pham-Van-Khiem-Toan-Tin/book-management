const { addRole, addFunction, addSubFunction, addFunctionsListToRole, addSubFunctionsToFunction, commonAuthorities, allRoles, viewRole, allFunctions, allSubFunctions, viewFunction, editRole } = require("../controllers/authorities.controller");
const { isAuthenticated, isAuthorization } = require("../middlewares/auth.middleware");

const router = require("express").Router();

router.route("/authorities/common/all").get(isAuthenticated, isAuthorization("LIST_ROLE"), commonAuthorities)
router.route("/authorities/all").get(isAuthenticated, isAuthorization("LIST_ROLE"), allRoles);
router.route("/authorities/view/:id").get(viewRole);
router.route("/authorities/edit/:id").put(editRole);
router.route("/roles/create").post(addRole);

router.route("/functions/all").get(isAuthenticated, isAuthorization("LIST_ROLE"), allFunctions);
router.route("/functions/create").post(addFunction);
router.route("/functions/view/:id").get(viewFunction);
router.route("/functions/edit").put(addSubFunctionsToFunction);

router.route("/subfunctions/all").get(isAuthenticated, isAuthorization("LIST_ROLE"), allSubFunctions);
router.route("/subfunctions/create").post(addSubFunction);

module.exports = router;
