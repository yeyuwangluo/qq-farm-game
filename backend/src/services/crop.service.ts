/**
 * 作物服务
 */

import PlotModel from '../models/plot.model';
import CropModel from '../models/crop.model';
import CropTypeModel from '../models/crop-type.model';
import ItemModel from '../models/item.model';
import UserModel from '../models/user.model';
import FarmModel from '../models/farm.model';
import { CropState, CropHarvestResult } from '../types/crop.types';
import { ItemType } from '../models/item.model';
import { AppError } from '../utils/response';

class CropService {
  /**
   * 获取农场的所有作物
   */
  async getFarmCrops(userId: number) {
    const farm = await FarmModel.findByUserId(userId);
    if (!farm) {
      throw AppError.notFound('农场不存在');
    }

    const crops = await CropModel.findCropDetailsByFarmId(farm.id);
    return crops.map(crop => this.formatCropDetail(crop));
  }

  /**
   * 获取可种植的作物类型
   */
  async getPlantableCropTypes(userId: number) {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw AppError.notFound('用户不存在');
    }

    const cropTypes = await CropTypeModel.findByLevel(user.level);
    return cropTypes;
  }

  /**
   * 种植作物
   */
  async plantCrop(userId: number, plotId: number, cropTypeId: number) {
    const farm = await FarmModel.findByUserId(userId);
    if (!farm) {
      throw AppError.notFound('农场不存在');
    }

    const plot = await PlotModel.findById(plotId);
    if (!plot) {
      throw AppError.notFound('土地不存在');
    }

    if (plot.farm_id !== farm.id) {
      throw AppError.forbidden('无权操作此土地');
    }

    if (plot.state !== 'idle') {
      throw AppError.badRequest('土地不空闲');
    }

    const cropType = await CropTypeModel.findById(cropTypeId);
    if (!cropType) {
      throw AppError.notFound('作物类型不存在');
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      throw AppError.notFound('用户不存在');
    }

    // 验证玩家等级
    if (user.level < cropType.required_level) {
      throw AppError.badRequest(`需要等级${cropType.required_level}才能种植此作物`);
    }

    // 检查种子数量
    const seedQuantity = await ItemModel.getQuantity(userId, cropTypeId);
    if (seedQuantity <= 0) {
      throw AppError.badRequest('种子不足');
    }

    // 消耗种子
    await ItemModel.reduce(userId, cropTypeId, 1);

    // 计算生长时间和收获时间
    const now = new Date();
    const plantedAt = now;
    const readyAt = new Date(now.getTime() + (cropType.growth_time + cropType.harvest_time) * 1000);

    // 更新土地状态
    await PlotModel.updateCrop(plotId, cropTypeId, plantedAt, readyAt);

    // 创建作物记录
    const cropId = await CropModel.create(plotId, cropTypeId, plantedAt, readyAt);

    return {
      crop_id: cropId,
      plot_id: plotId,
      crop_type_id: cropTypeId,
      planted_at: plantedAt.toISOString(),
      ready_at: readyAt.toISOString(),
      growth_time: cropType.growth_time,
      harvest_time: cropType.harvest_time,
    };
  }

  /**
   * 收获作物
   */
  async harvestCrop(userId: number, plotId: number) {
    const farm = await FarmModel.findByUserId(userId);
    if (!farm) {
      throw AppError.notFound('农场不存在');
    }

    const plot = await PlotModel.findById(plotId);
    if (!plot) {
      throw AppError.notFound('土地不存在');
    }

    if (plot.farm_id !== farm.id) {
      throw AppError.forbidden('无权操作此土地');
    }

    const crop = await CropModel.findByPlotId(plotId);
    if (!crop) {
      throw AppError.badRequest('土地没有作物');
    }

    if (crop.state !== CropState.READY) {
      throw AppError.badRequest('作物还未成熟');
    }

    const cropType = await CropTypeModel.findById(crop.crop_type_id);
    if (!cropType) {
      throw AppError.notFound('作物类型不存在');
    }

    // 计算产量（基础产量 + 随机波动）
    const yield = Math.floor(cropType.base_yield * (0.8 + Math.random() * 0.4));

    // 计算金币收益
    const goldGained = yield * cropType.sell_price;

    // 计算经验收益
    const experienceGained = cropType.experience;

    // 判断是否获得点券
    const vouchersGained = Math.random() < cropType.drop_voucher_prob ? 1 : 0;

    // 增加金币
    await UserModel.addGold(userId, goldGained);

    // 增加经验
    await UserModel.addExperience(userId, experienceGained);

    // 增加点券
    if (vouchersGained > 0) {
      await UserModel.addVouchers(userId, vouchersGained);
    }

    // 将作物产品存入背包
    await ItemModel.add(userId, cropType.id, yield);

    // 更新收获信息
    await CropModel.updateHarvest(crop.id, crop.harvest_count + 1);

    // 更新土地状态
    await PlotModel.updateHarvestedAt(plotId);

    return {
      crop_name: cropType.name,
      yield,
      gold_gained: goldGained,
      experience_gained: experienceGained,
      vouchers_gained: vouchersGained,
    } as CropHarvestResult;
  }

  /**
   * 使用化肥
   */
  async useFertilizer(userId: number, plotId: number, fertilizerId: number) {
    const farm = await FarmModel.findByUserId(userId);
    if (!farm) {
      throw AppError.notFound('农场不存在');
    }

    const plot = await PlotModel.findById(plotId);
    if (!plot) {
      throw AppError.notFound('土地不存在');
    }

    if (plot.farm_id !== farm.id) {
      throw AppError.forbidden('无权操作此土地');
    }

    const crop = await CropModel.findByPlotId(plotId);
    if (!crop) {
      throw AppError.badRequest('土地没有作物');
    }

    if (crop.state !== CropState.GROWING) {
      throw AppError.badRequest('作物不在生长中');
    }

    // 检查化肥数量
    const fertilizerQuantity = await ItemModel.getQuantity(userId, fertilizerId);
    if (fertilizerQuantity <= 0) {
      throw AppError.badRequest('化肥不足');
    }

    // 消耗化肥
    await ItemModel.reduce(userId, fertilizerId, 1);

    // 计算新的生长进度（增加30%）
    const newProgress = Math.min(100, crop.growth_progress + 30);
    await CropModel.updateGrowthProgress(crop.id, newProgress);

    // 如果达到100%，更新为成熟状态
    if (newProgress >= 100) {
      await CropModel.updateState(crop.id, CropState.READY);
      await PlotModel.updateState(plotId, 'ready');
    }

    return {
      plot_id: plotId,
      crop_id: crop.id,
      old_progress: crop.growth_progress,
      new_progress: newProgress,
      is_ready: newProgress >= 100,
    };
  }

  /**
   * 使用加速剂
   */
  async useAccelerator(userId: number, plotId: number, acceleratorId: number) {
    const farm = await FarmModel.findByUserId(userId);
    if (!farm) {
      throw AppError.notFound('农场不存在');
    }

    const plot = await PlotModel.findById(plotId);
    if (!plot) {
      throw AppError.notFound('土地不存在');
    }

    if (plot.farm_id !== farm.id) {
      throw AppError.forbidden('无权操作此土地');
    }

    const crop = await CropModel.findByPlotId(plotId);
    if (!crop) {
      throw AppError.badRequest('土地没有作物');
    }

    if (crop.state !== CropState.GROWING) {
      throw AppError.badRequest('作物不在生长中');
    }

    // 检查加速剂数量
    const acceleratorQuantity = await ItemModel.getQuantity(userId, acceleratorId);
    if (acceleratorQuantity <= 0) {
      throw AppError.badRequest('加速剂不足');
    }

    // 消耗加速剂
    await ItemModel.reduce(userId, acceleratorId, 1);

    // 立即设置为成熟状态
    await CropModel.updateState(crop.id, CropState.READY);
    await PlotModel.updateState(plotId, 'ready');

    return {
      plot_id: plotId,
      crop_id: crop.id,
      is_ready: true,
    };
  }

  /**
   * 清除枯萎作物
   */
  async clearWitheredCrop(userId: number, plotId: number) {
    const farm = await FarmModel.findByUserId(userId);
    if (!farm) {
      throw AppError.notFound('农场不存在');
    }

    const plot = await PlotModel.findById(plotId);
    if (!plot) {
      throw AppError.notFound('土地不存在');
    }

    if (plot.farm_id !== farm.id) {
      throw AppError.forbidden('无权操作此土地');
    }

    const crop = await CropModel.findByPlotId(plotId);
    if (!crop) {
      throw AppError.badRequest('土地没有作物');
    }

    if (crop.state !== CropState.WITHERED) {
      throw AppError.badRequest('作物未枯萎');
    }

    // 删除作物记录
    await CropModel.delete(crop.id);

    // 重置土地状态
    await PlotModel.updateState(plotId, 'idle');

    return {
      plot_id: plotId,
      crop_id: crop.id,
    };
  }

  /**
   * 检查并更新枯萎作物
   */
  async checkAndUpdateWitheredCrops(): Promise<number> {
    const cropsToCheck = await CropModel.findCropsToCheckWither();
    let witheredCount = 0;

    for (const crop of cropsToCheck) {
      await CropModel.updateWithered(crop.id);
      await PlotModel.updateState(crop.plot_id, 'withered');
      witheredCount++;
    }

    return witheredCount;
  }

  /**
   * 格式化作物详情
   */
  private formatCropDetail(crop: any): any {
    const now = new Date();
    const plantedAt = new Date(crop.planted_at);
    const readyAt = new Date(plantedAt.getTime() + (crop.growth_time + crop.harvest_time) * 1000);
    let remainingTime: number | null = null;
    let isReady = false;
    let isWithered = false;

    if (crop.state === CropState.GROWING) {
      remainingTime = Math.max(0, Math.floor((readyAt.getTime() - now.getTime()) / 1000));
      if (remainingTime <= 0) {
        isReady = true;
      }
    } else if (crop.state === CropState.READY) {
      isReady = true;
    } else if (crop.state === CropState.WITHERED) {
      isWithered = true;
    }

    return {
      id: crop.id,
      plot_id: crop.plot_id,
      plot_index: crop.plot_index,
      crop_type_id: crop.crop_type_id,
      crop_type_name: crop.crop_type_name,
      crop_type_description: crop.crop_type_description,
      state: crop.state,
      planted_at: crop.planted_at,
      ready_at: readyAt.toISOString(),
      growth_progress: crop.growth_progress,
      harvest_count: crop.harvest_count,
      last_harvested_at: crop.last_harvested_at,
      remaining_time: remainingTime,
      is_ready: isReady,
      is_withered: isWithered,
      created_at: crop.created_at,
      updated_at: crop.updated_at,
    };
  }
}

export default new CropService();