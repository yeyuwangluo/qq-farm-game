/**
 * 季节控制器
 */

import { Request, Response, NextFunction } from 'express';
import SeasonService from '../services/season.service';
import { successResponse } from '../utils/response';

class SeasonController {
  /**
   * 获取当前季节
   */
  getCurrentSeason = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const season = await SeasonService.getCurrentSeason();
      successResponse(res, '获取当前季节成功', season);
    } catch (error) {
      next(error);
    }
  };

  /**
   * 获取季节活动信息
   */
  getSeasonActivities = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const activities = await SeasonService.getSeasonActivities();
      successResponse(res, '获取季节活动成功', activities);
    } catch (error) {
      next(error);
    }
  };

  /**
   * 获取所有季节（管理员）
   */
  getAllSeasons = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const seasons = await SeasonService.getAllSeasons();
      successResponse(res, '获取季节列表成功', seasons);
    } catch (error) {
      next(error);
    }
  };

  /**
   * 切换季节（管理员）
   */
  switchSeason = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { season_id } = req.body;
      const result = await SeasonService.switchSeason(season_id);
      successResponse(res, '季节切换成功', result);
    } catch (error) {
      next(error);
    }
  };
}

export default new SeasonController();