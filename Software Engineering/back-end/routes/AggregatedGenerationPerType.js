const express = require('express');
const router = express.Router();
const controlls = require('../controllers/AggregatedGenerationPerType');
const auth = require('../auth/userAuth');

//router.get('/:AreaName/:ResolutionCode/:ProductionType/date/:date_str', auth, controlls.getDate);
router.get('/:AreaName/:ProductionType/:Resolution/date/:date_str', auth, controlls.getDate);
//router.get('/:AreaName/:Resolution/:ProductionType/month/:date_str', auth, controlls.getMonth);
router.get('/:AreaName/:ProductionType/:Resolution/month/:date_str', auth, controlls.getMonth);
//router.get('/:AreaName/:Resolution/:ProductionType/year/:date_str', auth, controlls.getYear);
router.get('/:AreaName/:ProductionType/:Resolution/year/:date_str', auth, controlls.getYear);

module.exports = router;