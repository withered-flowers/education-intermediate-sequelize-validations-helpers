const express = require('express');
const router = express.Router();

const Controller = require('../controllers/controller.js')

router.get('/', Controller.getRootHandler);
router.get('/minings/add', Controller.getMiningsAddHandler);
router.post('/minings/add', Controller.postMiningsAddHandler);
router.get('/minings/del/:id', Controller.getMiningsDelHandler);

module.exports = router;