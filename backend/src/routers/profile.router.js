const { viewProfile, updateProfile } = require('../controllers/profile.controller');
const { isAuthenticated, isAuthorization } = require('../middlewares/auth.middleware');

const router = require('express').Router();

router.route('/')
  .get(isAuthenticated, isAuthorization("VIEW_PROFILE"), viewProfile)
  .put(isAuthenticated, isAuthorization("EDIT_PROFILE"), updateProfile);

module.exports = router;