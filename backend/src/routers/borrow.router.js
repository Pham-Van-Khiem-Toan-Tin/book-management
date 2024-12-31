const { search, createBorrow, createBorrowOffline, createBorrowOnline } = require('../controllers/borrow.controller');
const { isAuthenticated, isAuthorization } = require('../middlewares/auth.middleware');
const { post } = require('./bookshelf.router');

const router = require('express').Router();


router.route("/all").get(isAuthenticated, isAuthorization("LIST_BORROW"), search);
router.route("/create/offline").post(isAuthenticated, isAuthorization("CREATE_OFFLINE_BORROW"), createBorrowOffline)
router.route("/create/online").post(isAuthenticated, isAuthorization("CREATE_ONLINE_BORROW"), createBorrowOnline)

module.exports = router;