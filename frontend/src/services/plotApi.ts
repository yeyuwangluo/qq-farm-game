/**
 * 土地API服务
 */

import apiClient from './api';
import {
  Plot,
  CropType,
  PlantCropRequest,
  HarvestCropRequest,
  UseFertilizerRequest,
  UseAcceleratorRequest,
  UpgradePlotRequest,
  UnlockPlotRequest,
  PlantCropResult,
  HarvestCropResult,
  UpgradePlotResult,
  UnlockPlotResult,
} from '../types/plot.types';

/**
 * 获取农场的所有土地
 */
export const getPlots = async (): Promise<Plot[]> => {
  const response = await apiClient.get('/plots');
  return response.data;
};

/**
 * 获取可种植的作物类型
 */
export const getCropTypes = async (): Promise<CropType[]> => {
  const response = await apiClient.get('/crops/types');
  return response.data;
};

/**
 * 种植作物
 */
export const plantCrop = async (request: PlantCropRequest): Promise<PlantCropResult> => {
  const response = await apiClient.post('/crops/plant', request);
  return response.data;
};

/**
 * 收获作物
 */
export const harvestCrop = async (request: HarvestCropRequest): Promise<HarvestCropResult> => {
  const response = await apiClient.post('/crops/harvest', request);
  return response.data;
};

/**
 * 使用化肥
 */
export const useFertilizer = async (request: UseFertilizerRequest): Promise<any> => {
  const response = await apiClient.post('/crops/fertilizer', request);
  return response.data;
};

/**
 * 使用加速剂
 */
export const useAccelerator = async (request: UseAcceleratorRequest): Promise<any> => {
  const response = await apiClient.post('/crops/accelerator', request);
  return response.data;
};

/**
 * 清除枯萎作物
 */
export const clearWitheredCrop = async (plotId: number): Promise<any> => {
  const response = await apiClient.delete(`/crops/withered/${plotId}`);
  return response.data;
};

/**
 * 升级土地
 */
export const upgradePlot = async (request: UpgradePlotRequest): Promise<UpgradePlotResult> => {
  const response = await apiClient.post('/plots/upgrade', request);
  return response.data;
};

/**
 * 解锁土地
 */
export const unlockPlot = async (request: UnlockPlotRequest): Promise<UnlockPlotResult> => {
  const response = await apiClient.post('/plots/unlock', request);
  return response.data;
};

export default {
  getPlots,
  getCropTypes,
  plantCrop,
  harvestCrop,
  useFertilizer,
  useAccelerator,
  clearWitheredCrop,
  upgradePlot,
  unlockPlot,
};