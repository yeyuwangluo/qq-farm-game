/**
 * 主路由
 */

import { Router } from 'express';
import authRoutes from './auth.routes';
import plotRoutes from './plot.routes';
import farmRoutes from './farm.routes';
import cropRoutes from './crop.routes';
import animalRoutes from './animal.routes';
import decorationRoutes from './decoration.routes';
import itemRoutes from './item.routes';
import socialRoutes from './social.routes';
import questRoutes from './quest.routes';
import achievementRoutes from './achievement.routes';
import seasonRoutes from './season.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/plots', plotRoutes);
router.use('/farms', farmRoutes);
router.use('/crops', cropRoutes);
router.use('/animals', animalRoutes);
router.use('/decorations', decorationRoutes);
router.use('/items', itemRoutes);
router.use('/social', socialRoutes);
router.use('/quests', questRoutes);
router.use('/achievements', achievementRoutes);
router.use('/game/season', seasonRoutes);
router.use('/seasons', seasonRoutes);

export default router;