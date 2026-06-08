/**
 * 作物控制器
 */

import { Request, Response, NextFunction } from 'express';
import CropService from '../services/crop.service';
import { successResponse } from '../utils/response';

class CropController {
  /**
   * 获取农场的所有作物
   */
  getFarmCrops = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.auth) {
        throw new Error('未认证');
      }

      const crops = await CropService.getFarmCrops(req.auth.userId);
      successResponse(res, '获取作物列表成功', crops);
    } catch (error) {
      next(error);
    }
  };

  /**
   * 获取可种植的作物类型
   */
  getPlantableCropTypes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.auth) {
        throw new Error('未认证');
      }

      const cropTypes = await CropService.getPlantableCropTypes(req.auth.userId);
      successResponse(res, '获取可种植作物类型成功', cropTypes);
    } catch (error) {
      next(error);
    }
  };

  /**
   * 种植作物
   */
  plantCrop = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.auth) {
        throw new Error('未认证');
      }

      const { plot_id, crop_type_id } = req.body;
      const result = await CropService.plantCrop(req.auth.userId, plot_id, crop_type_id);
      successResponse(res, '种植作物成功', result);
    } catch (error) {
      next(error);
    }
  };

  /**
   * 收获作物
   */
  harvestCrop = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.auth) {
        throw new Error('未认证');
      }

      const { plot_id } = req.body;
      const result = await CropService.harvestCrop(req.auth.userId, plot_id);
      successResponse(res, '收获作物成功', result);
    } catch (error) {
      next(error);
    }
  };

  /**
   * 使用化肥
   */
  useFertilizer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.auth) {
        throw new Error('未认证');
      }

      const { plot_id, fertilizer_id } = req.body;
      const result = await CropService.useFertilizer(req.auth.userId, plot_id, fertilizer_id);
      successResponse(res, '使用化肥成功', result);
    } catch (error) {
      next(error);
    }
  };

  /**
   * 使用加速剂
   */
  useAccelerator = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.auth) {
        throw new Error('未认证');
      }

      const { plot_id, accelerator_id } = req.body;
      const result = await CropService.useAccelerator(req.auth.userId, plot_id, accelerator_id);
      successResponse(res, '使用加速剂成功', result);
    } catch (error) {
      next(error);
    }
  };

  /**
   * 清除枯萎作物
   */
  clearWitheredCrop = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.auth) {
        throw new Error('未认证');
      }

      const { plot_id } = req.params;
      const result = await CropService.clearWitheredCrop(req.auth.userId, parseInt(plot_id));
      successResponse(res, '清除枯萎作物成功', result);
    } catch (error) {
      next(error);
    }
  };
}

export default new CropController();