/**
 * 作物路由
 */

import { Router } from 'express';

const router = Router();

router.get('/', (_req, res) => {
  res.json({ success: true, message: '作物API路由（待实现）' });
});

export default router;