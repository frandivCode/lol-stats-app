import express from 'express';
import { getMatchHistory, createMatchStat, getFormOptions, createNewMatch } from '../controllers/matchControllers.js';

const router = express.Router();

router.get('/opciones', getFormOptions);
router.get('/', getMatchHistory);
router.post('/', createMatchStat);
router.post('/nueva', createNewMatch);

export default router;