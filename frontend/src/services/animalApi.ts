/**
 * 动物API服务
 */

import apiClient from './api';
import {
  AnimalType,
  Animal,
  AnimalPen,
  BuyAnimalRequest,
  FeedAnimalRequest,
  CollectProductRequest,
  UpgradeAnimalPenRequest,
  BuyAnimalResult,
  FeedAnimalResult,
  CollectProductResult,
  UpgradeAnimalPenResult,
} from '../types/animal.types';

/**
 * 获取用户的动物栏列表
 */
export const getAnimalPens = async (): Promise<AnimalPen[]> => {
  const response = await apiClient.get('/animals/pens');
  return response.data;
};

/**
 * 获取用户的动物列表
 */
export const getUserAnimals = async (): Promise<Animal[]> => {
  const response = await apiClient.get('/animals');
  return response.data;
};

/**
 * 获取可购买的动物类型
 */
export const getAvailableAnimalTypes = async (): Promise<AnimalType[]> => {
  const response = await apiClient.get('/animals/types');
  return response.data;
};

/**
 * 购买动物
 */
export const buyAnimal = async (request: BuyAnimalRequest): Promise<BuyAnimalResult> => {
  const response = await apiClient.post('/animals/buy', request);
  return response.data;
};

/**
 * 喂养动物
 */
export const feedAnimal = async (request: FeedAnimalRequest): Promise<FeedAnimalResult> => {
  const response = await apiClient.post('/animals/feed', request);
  return response.data;
};

/**
 * 收集产品
 */
export const collectProduct = async (request: CollectProductRequest): Promise<CollectProductResult> => {
  const response = await apiClient.post('/animals/collect', request);
  return response.data;
};

/**
 * 升级动物栏
 */
export const upgradeAnimalPen = async (request: UpgradeAnimalPenRequest): Promise<UpgradeAnimalPenResult> => {
  const response = await apiClient.post('/animals/upgrade-pen', request);
  return response.data;
};

export default {
  getAnimalPens,
  getUserAnimals,
  getAvailableAnimalTypes,
  buyAnimal,
  feedAnimal,
  collectProduct,
  upgradeAnimalPen,
};