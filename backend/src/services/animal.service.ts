/**
 * 动物服务
 */

import AnimalModel from '../models/animal.model';
import AnimalTypeModel from '../models/animal-type.model';
import AnimalPenModel from '../models/animal-pen.model';
import FarmModel from '../models/farm.model';
import UserModel from '../models/user.model';
import { AnimalState, BuyAnimalRequest, FeedAnimalRequest, CollectProductRequest, UpgradeAnimalPenRequest } from '../types/animal.types';
import { AppError } from '../utils/response';

class AnimalService {
  /**
   * 获取用户的动物栏列表
   */
  async getAnimalPens(userId: number) {
    const farm = await FarmModel.findByUserId(userId);
    if (!farm) {
      throw AppError.notFound('农场不存在');
    }

    const pens = await AnimalPenModel.findByFarmId(farm.id);
    const result = [];

    for (const pen of pens) {
      const detail = await AnimalPenModel.getDetail(pen.id);
      const animals = await AnimalModel.findPenAnimalsWithDetails(pen.id);
      const formattedAnimals = animals.map(animal => this.formatAnimalDetail(animal));

      result.push({
        ...detail,
        upgrade_cost: AnimalPenModel.calculateUpgradeCost(detail.level),
        animals: formattedAnimals,
        created_at: detail.created_at.toISOString(),
        updated_at: detail.updated_at.toISOString(),
      });
    }

    return result;
  }

  /**
   * 获取用户的动物列表
   */
  async getUserAnimals(userId: number) {
    const animals = await AnimalModel.findUserAnimalsWithDetails(userId);
    return animals.map(animal => this.formatAnimalDetail(animal));
  }

  /**
   * 获取可购买的动物类型
   */
  async getAvailableAnimalTypes(userId: number) {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw AppError.notFound('用户不存在');
    }

    const types = await AnimalTypeModel.findAvailableForUser(user.level);
    return types.map(type => ({
      id: type.id,
      name: type.name,
      description: type.description,
      purchase_price: type.purchase_price,
      product_name: type.product_name,
      product_price: type.product_price,
      product_time: type.product_time,
      product_yield: type.product_yield,
      experience_reward: type.experience_reward,
      level_requirement: type.level_requirement,
      image_url: type.image_url,
      food_type: type.food_type,
      food_consumption: type.food_consumption,
      can_buy: user.level >= type.level_requirement,
      created_at: type.created_at.toISOString(),
      updated_at: type.updated_at.toISOString(),
    }));
  }

  /**
   * 购买动物
   */
  async buyAnimal(userId: number, request: BuyAnimalRequest) {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw AppError.notFound('用户不存在');
    }

    const animalType = await AnimalTypeModel.findById(request.animal_type_id);
    if (!animalType) {
      throw AppError.notFound('动物类型不存在');
    }

    if (user.level < animalType.level_requirement) {
      throw AppError.badRequest('等级不足，无法购买此动物');
    }

    if (user.gold < animalType.purchase_price) {
      throw AppError.badRequest('金币不足');
    }

    const farm = await FarmModel.findByUserId(userId);
    if (!farm) {
      throw AppError.notFound('农场不存在');
    }

    const pens = await AnimalPenModel.findByFarmId(farm.id);
    if (pens.length === 0) {
      throw AppError.badRequest('请先升级农场以解锁动物栏');
    }

    let penId: number | null = null;
    for (const pen of pens) {
      const animalCount = await AnimalPenModel.getAnimalCount(pen.id);
      if (animalCount < pen.capacity) {
        penId = pen.id;
        break;
      }
    }

    if (!penId) {
      throw AppError.badRequest('动物栏已满，请先升级动物栏');
    }

    await UserModel.reduceGold(userId, animalType.purchase_price);

    const animalId = await AnimalModel.create({
      user_id: userId,
      animal_pen_id: penId,
      animal_type_id: animalType.id,
      name: request.name || animalType.name,
    });

    const updatedUser = await UserModel.findById(userId);
    return {
      animal_id: animalId,
      animal_name: request.name || animalType.name,
      cost: animalType.purchase_price,
      remaining_gold: updatedUser?.gold || 0,
    };
  }

  /**
   * 喂养动物
   */
  async feedAnimal(userId: number, request: FeedAnimalRequest) {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw AppError.notFound('用户不存在');
    }

    const animal = await AnimalModel.findById(request.animal_id);
    if (!animal) {
      throw AppError.notFound('动物不存在');
    }

    if (animal.user_id !== userId) {
      throw AppError.forbidden('无权操作此动物');
    }

    const animalType = await AnimalTypeModel.findById(animal.animal_type_id);
    if (!animalType) {
      throw AppError.notFound('动物类型不存在');
    }

    if (animal.hunger_level >= 100) {
      throw AppError.badRequest('动物已经饱了');
    }

    await AnimalModel.feed(request.animal_id, animalType.food_consumption);

    return {
      animal_id: request.animal_id,
      animal_name: animal.name || animalType.name,
      food_consumed: animalType.food_consumption,
      remaining_hunger_level: 100,
    };
  }

  /**
   * 收集产品
   */
  async collectProduct(userId: number, request: CollectProductRequest) {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw AppError.notFound('用户不存在');
    }

    const animal = await AnimalModel.findById(request.animal_id);
    if (!animal) {
      throw AppError.notFound('动物不存在');
    }

    if (animal.user_id !== userId) {
      throw AppError.forbidden('无权操作此动物');
    }

    if (animal.state !== AnimalState.READY) {
      throw AppError.badRequest('产品尚未就绪');
    }

    const animalType = await AnimalTypeModel.findById(animal.animal_type_id);
    if (!animalType) {
      throw AppError.notFound('动物类型不存在');
    }

    const goldGained = animalType.product_price * animalType.product_yield;
    const experienceGained = animalType.experience_reward;

    await UserModel.addGold(userId, goldGained);
    await UserModel.addExperience(userId, experienceGained);

    await AnimalModel.resetProductProgress(request.animal_id);

    const updatedUser = await UserModel.findById(userId);
    return {
      animal_id: request.animal_id,
      animal_name: animal.name || animalType.name,
      product_name: animalType.product_name,
      product_yield: animalType.product_yield,
      gold_gained: goldGained,
      experience_gained: experienceGained,
      remaining_gold: updatedUser?.gold || 0,
      remaining_experience: updatedUser?.experience || 0,
    };
  }

  /**
   * 升级动物栏
   */
  async upgradeAnimalPen(userId: number, request: UpgradeAnimalPenRequest) {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw AppError.notFound('用户不存在');
    }

    const farm = await FarmModel.findByUserId(userId);
    if (!farm) {
      throw AppError.notFound('农场不存在');
    }

    const pen = await AnimalPenModel.findById(request.pen_id);
    if (!pen) {
      throw AppError.notFound('动物栏不存在');
    }

    if (pen.farm_id !== farm.id) {
      throw AppError.forbidden('无权操作此动物栏');
    }

    const upgradeCost = AnimalPenModel.calculateUpgradeCost(pen.level);

    if (user.gold < upgradeCost) {
      throw AppError.badRequest('金币不足');
    }

    await UserModel.reduceGold(userId, upgradeCost);
    await AnimalPenModel.upgrade(request.pen_id);

    const updatedPen = await AnimalPenModel.getDetail(request.pen_id);
    const updatedUser = await UserModel.findById(userId);

    return {
      pen_id: request.pen_id,
      new_level: updatedPen?.level || 0,
      new_capacity: updatedPen?.capacity || 0,
      cost: upgradeCost,
      remaining_gold: updatedUser?.gold || 0,
    };
  }

  /**
   * 检查并更新动物饥饿状态
   */
  async checkAndUpdateHunger(): Promise<number> {
    const animalsToCheck = await AnimalModel.findAnimalsToCheckHunger();
    let updatedCount = 0;

    for (const animal of animalsToCheck) {
      const animalType = await AnimalTypeModel.findById(animal.animal_type_id);
      if (!animalType) continue;

      if (!animal.last_fed_at) continue;

      const now = new Date();
      const hoursSinceFed = (now.getTime() - animal.last_fed_at.getTime()) / (1000 * 60 * 60);

      let newHungerLevel = Math.max(0, 100 - Math.floor(hoursSinceFed * 10));

      if (newHungerLevel === 0 && animal.state === AnimalState.PRODUCING) {
        await AnimalModel.updateState(animal.id, AnimalState.STARVING);
        updatedCount++;
      } else if (newHungerLevel < 30 && animal.state === AnimalState.PRODUCING) {
        await AnimalModel.update(animal.id, { hunger_level: newHungerLevel });
        updatedCount++;
      }
    }

    return updatedCount;
  }

  /**
   * 检查并更新动物产出进度
   */
  async checkAndUpdateProductProgress(): Promise<number> {
    const producingAnimals = await AnimalModel.findProducingAnimals();
    let updatedCount = 0;

    for (const animal of producingAnimals) {
      const now = new Date();
      const lastFed = new Date(animal.last_fed_at);
      const productTime = animal.product_time * 60 * 1000;

      const elapsedTime = now.getTime() - lastFed.getTime();
      const progress = Math.min(100, Math.floor((elapsedTime / productTime) * 100));

      if (progress >= 100 && animal.state !== AnimalState.READY) {
        await AnimalModel.setProductReady(animal.id);
        updatedCount++;
      } else if (progress !== animal.product_progress) {
        await AnimalModel.updateProductProgress(animal.id, progress);
        updatedCount++;
      }
    }

    return updatedCount;
  }

  /**
   * 检查并处理饥饿动物
   */
  async checkAndHandleStarvingAnimals(): Promise<number> {
    const starvingAnimals = await AnimalModel.findStarvingAnimals();
    let updatedCount = 0;

    for (const animal of starvingAnimals) {
      await AnimalModel.updateState(animal.id, AnimalState.STARVING);
      updatedCount++;
    }

    return updatedCount;
  }

  /**
   * 格式化动物详情
   */
  private formatAnimalDetail(animal: any): any {
    const now = new Date();
    let remainingTime: number | null = null;
    let isReady = false;

    if (animal.state === AnimalState.PRODUCING && animal.last_fed_at) {
      const productTime = animal.product_time * 60 * 1000;
      const lastFed = new Date(animal.last_fed_at);
      const elapsedTime = now.getTime() - lastFed.getTime();
      remainingTime = Math.max(0, Math.floor((productTime - elapsedTime) / 1000));

      if (remainingTime <= 0) {
        isReady = true;
      }
    } else if (animal.state === AnimalState.READY) {
      isReady = true;
    }

    return {
      id: animal.id,
      user_id: animal.user_id,
      animal_pen_id: animal.animal_pen_id,
      animal_type_id: animal.animal_type_id,
      animal_type_name: animal.animal_type_name,
      animal_type_description: animal.animal_type_description,
      name: animal.name,
      hunger_level: animal.hunger_level,
      last_fed_at: animal.last_fed_at ? animal.last_fed_at.toISOString() : null,
      product_progress: animal.product_progress,
      last_product_at: animal.last_product_at ? animal.last_product_at.toISOString() : null,
      product_time: animal.product_time,
      state: animal.state,
      remaining_time: remainingTime,
      is_ready: isReady,
      created_at: animal.created_at.toISOString(),
      updated_at: animal.updated_at.toISOString(),
    };
  }
}

export default new AnimalService();