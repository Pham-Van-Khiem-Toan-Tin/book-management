const { addRole, addFunction, addSubFunction, addFunctionsListToRole, addSubFunctionsToFunction, commonAuthorities } = require("../controllers/authorities.controller");
const { isAuthenticated, isAuthorization } = require("../middlewares/auth.middleware");

const router = require("express").Router();

router.route("/authorities/common/all").get(isAuthenticated, isAuthorization("LIST_ROLE"), commonAuthorities)
router.route("/roles/create").post(addRole);
router.route("/roles/edit").put(addFunctionsListToRole);

router.route("/functions/create").post(addFunction);
router.route("/functions/edit").put(addSubFunctionsToFunction);

router.route("/subfunctions/create").post(addSubFunction);

module.exports = router;
