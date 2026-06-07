/**
 * 土地控制器
 */

import { Request, Response, NextFunction } from 'express';
import PlotService from '../services/plot.service';
import { successResponse } from '../utils/response';

class PlotController {
  /**
   * 获取农场的所有土地
   */
  getFarmPlots = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.auth) {
        throw new Error('未认证');
      }

      const plots = await PlotService.getFarmPlots(req.auth.userId);
      successResponse(res, '获取土地列表成功', plots);
    } catch (error) {
      next(error);
    }
  };

  /**
   * 获取土地详细信息
   */
  getPlotDetail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.auth) {
        throw new Error('未认证');
      }

      const { plotId } = req.params;
      const plot = await PlotService.getPlotDetail(req.auth.userId, parseInt(plotId));
      successResponse(res, '获取土地详情成功', plot);
    } catch (error) {
      next(error);
    }
  };

  /**
   * 升级土地
   */
  upgradePlot = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.auth) {
        throw new Error('未认证');
      }

      const { plotId } = req.params;
      const result = await PlotService.upgradePlot(req.auth.userId, parseInt(plotId));
      successResponse(res, '升级土地成功', result);
    } catch (error) {
      next(error);
    }
  };

  /**
   * 解锁土地
   */
  unlockPlot = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.auth) {
        throw new Error('未认证');
      }

      const { plot_index } = req.body;
      const result = await PlotService.unlockPlot(req.auth.userId, plot_index);
      successResponse(res, '解锁土地成功', result);
    } catch (error) {
      next(error);
    }
  };

  /**
   * 更新土地状态
   */
  updatePlotState = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.auth) {
        throw new Error('未认证');
      }

      const { plotId } = req.params;
      const { state } = req.body;
      const result = await PlotService.updatePlotState(req.auth.userId, parseInt(plotId), state);
      successResponse(res, '更新土地状态成功', result);
    } catch (error) {
      next(error);
    }
  };
}

export default new PlotController();