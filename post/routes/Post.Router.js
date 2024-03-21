const express = require('express');
const verifyAcessToken = require('../helpers/jwtVerify');
const PostController = require('../controllers/PostController');

const router = express.Router();

router.get('/recommended', PostController.recommended);
router.get('/recent', PostController.recent);
router.post('/create', PostController.create);

module.exports = router;
