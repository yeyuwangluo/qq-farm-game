/**
 * 土地服务
 */

import PlotModel from '../models/plot.model';
import FarmModel from '../models/farm.model';
import UserModel from '../models/user.model';
import { PlotState } from '../types/plot.types';
import { AppError } from '../utils/response';

class PlotService {
  /**
   * 获取农场的所有土地
   */
  async getFarmPlots(userId: number) {
    const farm = await FarmModel.findByUserId(userId);
    if (!farm) {
      throw AppError.notFound('农场不存在');
    }

    const plots = await PlotModel.findByFarmId(farm.id);
    return plots.map(plot => this.formatPlotDetail(plot));
  }

  /**
   * 获取土地详细信息
   */
  async getPlotDetail(userId: number, plotId: number) {
    const farm = await FarmModel.findByUserId(userId);
    if (!farm) {
      throw AppError.notFound('农场不存在');
    }

    const plot = await PlotModel.findById(plotId);
    if (!plot) {
      throw AppError.notFound('土地不存在');
    }

    if (plot.farm_id !== farm.id) {
      throw AppError.forbidden('无权访问此土地');
    }

    return this.formatPlotDetail(plot);
  }

  /**
   * 升级土地
   */
  async upgradePlot(userId: number, plotId: number) {
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

    const user = await UserModel.findById(userId);
    if (!user) {
      throw AppError.notFound('用户不存在');
    }

    // 计算升级费用
    const upgradeCost = this.calculateUpgradeCost(plot.plot_index + 1);

    if (user.gold < upgradeCost) {
      throw AppError.badRequest('金币不足');
    }

    // 扣除金币
    await UserModel.reduceGold(userId, upgradeCost);

    // 扩容土地数量
    const newMaxPlots = plot.plot_index + 1;
    await FarmModel.expandPlots(farm.id, newMaxPlots);

    // 如果土地不存在，创建新土地
    if (!plot) {
      await PlotModel.create(farm.id, plot.plot_index);
    }

    return {
      plot_id: plotId,
      plot_index: plot.plot_index,
      max_plots: newMaxPlots,
      upgrade_cost: upgradeCost,
    };
  }

  /**
   * 解锁土地
   */
  async unlockPlot(userId: number, plotIndex: number) {
    const farm = await FarmModel.findByUserId(userId);
    if (!farm) {
      throw AppError.notFound('农场不存在');
    }

    const existingPlot = await PlotModel.findByFarmIdAndIndex(farm.id, plotIndex);

    if (existingPlot) {
      throw AppError.badRequest('土地已解锁');
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      throw AppError.notFound('用户不存在');
    }

    // 计算解锁费用
    const unlockCost = this.calculateUnlockCost(plotIndex);

    if (user.gold < unlockCost) {
      throw AppError.badRequest('金币不足');
    }

    // 扣除金币
    await UserModel.reduceGold(userId, unlockCost);

    // 创建新土地
    const newPlotId = await PlotModel.create(farm.id, plotIndex);

    // 更新农场最大土地数量
    if (plotIndex >= farm.max_plots) {
      await FarmModel.expandPlots(farm.id, plotIndex + 1);
    }

    return {
      plot_id: newPlotId,
      plot_index: plotIndex,
      unlock_cost: unlockCost,
    };
  }

  /**
   * 更新土地状态
   */
  async updatePlotState(userId: number, plotId: number, state: PlotState) {
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

    await PlotModel.updateState(plotId, state);

    return {
      plot_id: plotId,
      state,
    };
  }

  /**
   * 检查并更新枯萎土地
   */
  async checkAndWitherPlots(): Promise<number> {
    const plotsToCheck = await PlotModel.findPlotsToCheckWither();
    let witheredCount = 0;

    for (const plot of plotsToCheck) {
      await PlotModel.updateState(plot.id, PlotState.WITHERED);
      witheredCount++;
    }

    return witheredCount;
  }

  /**
   * 计算土地升级费用
   */
  private calculateUpgradeCost(plotIndex: number): number {
    // 基础费用：100金币
    // 每增加一块土地，费用增加50%
    return Math.floor(100 * Math.pow(1.5, plotIndex - 1));
  }

  /**
   * 计算土地解锁费用
   */
  private calculateUnlockCost(plotIndex: number): number {
    // 基础费用：200金币
    // 每增加一块土地，费用增加60%
    return Math.floor(200 * Math.pow(1.6, plotIndex - 1));
  }

  /**
   * 格式化土地详情
   */
  private formatPlotDetail(plot: any): any {
    const now = new Date();
    let remainingTime: number | null = null;
    let isReady = false;
    let isWithered = false;

    if (plot.state === PlotState.PLANTED && plot.ready_at) {
      const readyTime = new Date(plot.ready_at);
      remainingTime = Math.max(0, Math.floor((readyTime.getTime() - now.getTime()) / 1000));

      if (remainingTime <= 0) {
        isReady = true;
      }

      // 检查是否枯萎（超过收获时间2小时）
      const twoHoursAfter = new Date(readyTime.getTime() + 2 * 60 * 60 * 1000);
      if (now > twoHoursAfter) {
        isWithered = true;
      }
    } else if (plot.state === PlotState.READY) {
      isReady = true;
    } else if (plot.state === PlotState.WITHERED) {
      isWithered = true;
    }

    return {
      id: plot.id,
      farm_id: plot.farm_id,
      plot_index: plot.plot_index,
      state: plot.state,
      crop_id: plot.crop_id,
      crop_name: plot.crop_name || null,
      planted_at: plot.planted_at ? plot.planted_at.toISOString() : null,
      ready_at: plot.ready_at ? plot.ready_at.toISOString() : null,
      harvested_at: plot.harvested_at ? plot.harvested_at.toISOString() : null,
      remaining_time: remainingTime,
      is_ready: isReady,
      is_withered: isWithered,
      created_at: plot.created_at.toISOString(),
      updated_at: plot.updated_at.toISOString(),
    };
  }
}

export default new PlotService();