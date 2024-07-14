import express from 'express';
import PostController from '../controllers/PostController';

const router = express.Router();

router.get('/recommended', PostController.recommended);
router.get('/recent', PostController.recent);
router.post('/create', PostController.create);

export default router;
