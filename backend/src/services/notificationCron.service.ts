/**
 * WebSocket通知定时任务
 */

import { scheduleJob } from 'node-schedule';
import PlotModel from '../models/plot.model';
import AnimalModel from '../models/animal.model';
import CropModel from '../models/crop.model';
import {
  notifyCropReady,
  notifyAnimalProductReady,
  isUserOnline,
} from '../config/socket';

/**
 * 检查作物成熟状态并发送通知
 */
const checkCropReadiness = async () => {
  try {
    console.log('[Cron] Checking crop readiness...');

    // 查找所有已经成熟但未通知的作物
    const readyCrops = await PlotModel.findReadyPlotsWithoutNotification();

    for (const crop of readyCrops) {
      try {
        // 获取作物详情
        const cropDetail = await CropModel.findById(crop.id);
        if (!cropDetail) continue;

        const cropType = await CropModel.getCropTypeById(crop.crop_type_id);
        if (!cropType) continue;

        // 发送通知
        notifyCropReady(crop.user_id, {
          crop_id: crop.id,
          crop_name: cropType.name,
          plot_id: crop.plot_id,
        });

        // 标记为已通知
        await PlotModel.markCropAsNotified(crop.id);

        console.log(`[Cron] Crop ready notification sent for crop ${crop.id}`);
      } catch (error) {
        console.error(`[Cron] Error processing crop ${crop.id}:`, error);
      }
    }

    console.log(`[Cron] Checked ${readyCrops.length} ready crops`);
  } catch (error) {
    console.error('[Cron] Error checking crop readiness:', error);
  }
};

/**
 * 检查动物产品就绪状态并发送通知
 */
const checkAnimalProductReadiness = async () => {
  try {
    console.log('[Cron] Checking animal product readiness...');

    // 查找所有产品就绪但未通知的动物
    const readyAnimals = await AnimalModel.findReadyAnimalsWithoutNotification();

    for (const animal of readyAnimals) {
      try {
        // 获取动物详情
        const animalType = await AnimalModel.getAnimalTypeById(animal.animal_type_id);
        if (!animalType) continue;

        // 发送通知
        notifyAnimalProductReady(animal.user_id, {
          animal_id: animal.id,
          animal_name: animal.name || animalType.name,
          product_name: animalType.product_name,
          pen_id: animal.animal_pen_id,
        });

        // 标记为已通知
        await AnimalModel.markAnimalAsNotified(animal.id);

        console.log(`[Cron] Animal product ready notification sent for animal ${animal.id}`);
      } catch (error) {
        console.error(`[Cron] Error processing animal ${animal.id}:`, error);
      }
    }

    console.log(`[Cron] Checked ${readyAnimals.length} ready animals`);
  } catch (error) {
    console.error('[Cron] Error checking animal product readiness:', error);
  }
};

/**
 * 检查并更新作物枯萎状态
 */
const checkCropWither = async () => {
  try {
    console.log('[Cron] Checking crop wither status...');

    const witheredCount = await CropModel.checkAndWitherCrops();
    console.log(`[Cron] Withered ${witheredCount} crops`);
  } catch (error) {
    console.error('[Cron] Error checking crop wither:', error);
  }
};

/**
 * 检查并更新动物饥饿状态
 */
const checkAnimalHunger = async () => {
  try {
    console.log('[Cron] Checking animal hunger status...');

    const updatedCount = await AnimalModel.checkAndUpdateHunger();
    console.log(`[Cron] Updated hunger status for ${updatedCount} animals`);
  } catch (error) {
    console.error('[Cron] Error checking animal hunger:', error);
  }
};

/**
 * 检查并更新动物产出进度
 */
const checkAnimalProgress = async () => {
  try {
    console.log('[Cron] Checking animal production progress...');

    const updatedCount = await AnimalModel.checkAndUpdateProductProgress();
    console.log(`[Cron] Updated progress for ${updatedCount} animals`);
  } catch (error) {
    console.error('[Cron] Error checking animal progress:', error);
  }
};

/**
 * 启动所有定时任务
 */
export const startNotificationCronJobs = () => {
  console.log('[Cron] Starting notification cron jobs...');

  // 每分钟检查一次作物成熟状态
  scheduleJob('*/1 * * * *', checkCropReadiness);

  // 每分钟检查一次动物产品就绪状态
  scheduleJob('*/1 * * * *', checkAnimalProductReadiness);

  // 每10分钟检查一次作物枯萎状态
  scheduleJob('*/10 * * * *', checkCropWither);

  // 每10分钟检查一次动物饥饿状态
  scheduleJob('*/10 * * * *', checkAnimalHunger);

  // 每分钟检查一次动物产出进度
  scheduleJob('*/1 * * * *', checkAnimalProgress);

  console.log('[Cron] Notification cron jobs started');
};

/**
 * 停止所有定时任务
 */
export const stopNotificationCronJobs = () => {
  // node-schedule会自动处理停止，这里主要用于日志记录
  console.log('[Cron] Notification cron jobs stopped');
};

/**
 * 立即执行一次检查（用于测试）
 */
export const runImmediateChecks = async () => {
  console.log('[Cron] Running immediate checks...');

  await Promise.all([
    checkCropReadiness(),
    checkAnimalProductReadiness(),
    checkCropWither(),
    checkAnimalHunger(),
    checkAnimalProgress(),
  ]);

  console.log('[Cron] Immediate checks completed');
};

export default {
  startNotificationCronJobs,
  stopNotificationCronJobs,
  runImmediateChecks,
};