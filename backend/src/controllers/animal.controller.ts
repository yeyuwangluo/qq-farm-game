/**
 * 动物控制器
 */

import { Request, Response, NextFunction } from 'express';
import AnimalService from '../services/animal.service';
import { successResponse } from '../utils/response';

class AnimalController {
  /**
   * 获取用户的动物栏列表
   */
  getAnimalPens = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.auth) {
        throw new Error('未认证');
      }

      const pens = await AnimalService.getAnimalPens(req.auth.userId);
      successResponse(res, '获取动物栏列表成功', pens);
    } catch (error) {
      next(error);
    }
  };

  /**
   * 获取用户的动物列表
   */
  getUserAnimals = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.auth) {
        throw new Error('未认证');
      }

      const animals = await AnimalService.getUserAnimals(req.auth.userId);
      successResponse(res, '获取动物列表成功', animals);
    } catch (error) {
      next(error);
    }
  };

  /**
   * 获取可购买的动物类型
   */
  getAvailableAnimalTypes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.auth) {
        throw new Error('未认证');
      }

      const types = await AnimalService.getAvailableAnimalTypes(req.auth.userId);
      successResponse(res, '获取可购买动物类型成功', types);
    } catch (error) {
      next(error);
    }
  };

  /**
   * 购买动物
   */
  buyAnimal = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.auth) {
        throw new Error('未认证');
      }

      const { animal_type_id, name } = req.body;
      const result = await AnimalService.buyAnimal(req.auth.userId, { animal_type_id, name });
      successResponse(res, '购买动物成功', result);
    } catch (error) {
      next(error);
    }
  };

  /**
   * 喂养动物
   */
  feedAnimal = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.auth) {
        throw new Error('未认证');
      }

      const { animal_id } = req.body;
      const result = await AnimalService.feedAnimal(req.auth.userId, { animal_id });
      successResponse(res, '喂养动物成功', result);
    } catch (error) {
      next(error);
    }
  };

  /**
   * 收集产品
   */
  collectProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.auth) {
        throw new Error('未认证');
      }

      const { animal_id } = req.body;
      const result = await AnimalService.collectProduct(req.auth.userId, { animal_id });
      successResponse(res, '收集产品成功', result);
    } catch (error) {
      next(error);
    }
  };

  /**
   * 升级动物栏
   */
  upgradeAnimalPen = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.auth) {
        throw new Error('未认证');
      }

      const { pen_id } = req.body;
      const result = await AnimalService.upgradeAnimalPen(req.auth.userId, { pen_id });
      successResponse(res, '升级动物栏成功', result);
    } catch (error) {
      next(error);
    }
  };

  /**
   * 检查并更新动物饥饿状态（定时任务）
   */
  checkAndUpdateHunger = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const updatedCount = await AnimalService.checkAndUpdateHunger();
      successResponse(res, `更新了${updatedCount}只动物的饥饿状态`, { updatedCount });
    } catch (error) {
      next(error);
    }
  };

  /**
   * 检查并更新动物产出进度（定时任务）
   */
  checkAndUpdateProductProgress = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const updatedCount = await AnimalService.checkAndUpdateProductProgress();
      successResponse(res, `更新了${updatedCount}只动物的产出进度`, { updatedCount });
    } catch (error) {
      next(error);
    }
  };

  /**
   * 检查并处理饥饿动物（定时任务）
   */
  checkAndHandleStarvingAnimals = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const updatedCount = await AnimalService.checkAndHandleStarvingAnimals();
      successResponse(res, `处理了${updatedCount}只饥饿动物`, { updatedCount });
    } catch (error) {
      next(error);
    }
  };
}

export default new AnimalController();