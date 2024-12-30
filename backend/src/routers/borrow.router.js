const { search, createBorrow } = require('../controllers/borrow.controller');
const { isAuthenticated, isAuthorization } = require('../middlewares/auth.middleware');

const router = require('express').Router();


router.route("/all").get(isAuthenticated, isAuthorization("LIST_BORROW"), search);
router.route("/create").post(isAuthenticated, isAuthorization("CREATE_BORROW"), createBorrow);

module.exports = router;