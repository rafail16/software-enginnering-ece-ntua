const express = require('express');
const router = express.Router();
const controlls = require('../controllers/DayAheadTotalLoadForeacast');
const auth = require('../auth/userAuth');

router.get('/:AreaName/:Resolution/date/:date_str', auth, controlls.getDate);
router.get('/:AreaName/:Resolution/month/:date_str', auth, controlls.getMonth);
router.get('/:AreaName/:Resolution/year/:date_str/', auth, controlls.getYear);

module.exports = router;