const { allUsers, viewUser, updateUser, lockUser } = require('../controllers/user.controller');
const { isAuthenticated, isAuthorization } = require('../middlewares/auth.middleware');

const router = require('express').Router();

router.route("/all").get(isAuthenticated, isAuthorization("LIST_USER"), allUsers);
router.route("/view/:id").get(isAuthenticated, isAuthorization("VIEW_USER"), viewUser);
router.route("/update/:id").put(isAuthenticated, isAuthorization("EDIT_USER"), updateUser);
router.route("/lock/:id").put(isAuthenticated, isAuthorization("EDIT_USER"), lockUser);

module.exports = router;