const express = require('express');
const userRoutes = require('./user.route');
const adminRoutes = require('./admin.route');
const authRoutes = require('./auth.route');
const router = express.Router(); // eslint-disable-line new-cap
const authMiddleware = require("../middleware/authMiddleware");
const validateEnv = require("../middleware/validateEnv");
const prospectRoutes = require('./prospects.route');

//========================================
/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
  res.send('OK')
);

router.use('/auth', authRoutes);
router.use('/admin', authMiddleware,adminRoutes);
router.use('/user', validateEnv,  userRoutes);
router.use('/product', validateEnv, authMiddleware, prospectRoutes);

module.exports = router;
