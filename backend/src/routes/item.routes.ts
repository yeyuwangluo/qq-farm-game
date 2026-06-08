/**
 * 物品路由
 */

import { Router } from 'express';

const router = Router();

router.get('/', (_req, res) => {
  res.json({ success: true, message: '物品API路由（待实现）' });
});

export default router;