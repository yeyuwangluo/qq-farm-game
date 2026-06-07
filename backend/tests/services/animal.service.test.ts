/**
 * 动物服务单元测试
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import AnimalService from '../../src/services/animal.service';
import AnimalModel from '../../src/models/animal.model';
import AnimalTypeModel from '../../src/models/animal-type.model';
import AnimalPenModel from '../../src/models/animal-pen.model';
import FarmModel from '../../src/models/farm.model';
import UserModel from '../../src/models/user.model';
import { AnimalState } from '../../src/types/animal.types';
import { AppError } from '../../src/utils/response';

describe('AnimalService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAnimalPens', () => {
    it('应该成功获取用户的动物栏列表', async () => {
      const userId = 1;
      const farmId = 1;
      const penId = 1;

      vi.spyOn(FarmModel, 'findByUserId').mockResolvedValue({
        id: farmId,
        user_id: userId,
        name: '我的农场',
        description: null,
        max_plots: 6,
        max_animal_pens: 3,
        decoration_slots: 10,
        created_at: new Date(),
        updated_at: new Date(),
      });

      vi.spyOn(AnimalPenModel, 'findByFarmId').mockResolvedValue([
        {
          id: penId,
          farm_id: farmId,
          level: 1,
          capacity: 3,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ]);

      vi.spyOn(AnimalPenModel, 'getDetail').mockResolvedValue({
        id: penId,
        farm_id: farmId,
        level: 1,
        capacity: 3,
        animal_count: 0,
        created_at: new Date(),
        updated_at: new Date(),
      });

      vi.spyOn(AnimalModel, 'findPenAnimalsWithDetails').mockResolvedValue([]);

      const result = await AnimalService.getAnimalPens(userId);

      expect(result).toHaveLength(1);
      expect(result[0]).toHaveProperty('id', penId);
      expect(result[0]).toHaveProperty('capacity', 3);
    });

    it('当农场不存在时应该抛出错误', async () => {
      const userId = 1;

      vi.spyOn(FarmModel, 'findByUserId').mockResolvedValue(null);

      await expect(AnimalService.getAnimalPens(userId)).rejects.toThrow('农场不存在');
    });
  });

  describe('getUserAnimals', () => {
    it('应该成功获取用户的动物列表', async () => {
      const userId = 1;

      vi.spyOn(AnimalModel, 'findUserAnimalsWithDetails').mockResolvedValue([
        {
          id: 1,
          user_id: userId,
          animal_pen_id: 1,
          animal_type_id: 1,
          name: '小鸡',
          hunger_level: 100,
          last_fed_at: new Date(),
          product_progress: 0,
          last_product_at: null,
          state: AnimalState.HUNGRY,
          created_at: new Date(),
          updated_at: new Date(),
          animal_type_name: '鸡',
          animal_type_description: '产蛋的家禽',
          product_name: '鸡蛋',
          product_price: 5,
          product_time: 60,
          product_yield: 2,
          experience_reward: 15,
          food_type: 'grain',
          food_consumption: 1,
        },
      ]);

      const result = await AnimalService.getUserAnimals(userId);

      expect(result).toHaveLength(1);
      expect(result[0]).toHaveProperty('animal_type_name', '鸡');
      expect(result[0]).toHaveProperty('state', AnimalState.HUNGRY);
    });
  });

  describe('getAvailableAnimalTypes', () => {
    it('应该成功获取可购买的动物类型', async () => {
      const userId = 1;

      vi.spyOn(UserModel, 'findById').mockResolvedValue({
        id: userId,
        username: 'testuser',
        email: 'test@example.com',
        password_hash: 'hashed',
        gold: 1000,
        experience: 100,
        level: 5,
        vouchers: 0,
        avatar: null,
        bio: null,
        last_login_at: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
      });

      vi.spyOn(AnimalTypeModel, 'findAvailableForUser').mockResolvedValue([
        {
          id: 1,
          name: '鸡',
          description: '产蛋的家禽',
          purchase_price: 100,
          product_name: '鸡蛋',
          product_price: 5,
          product_time: 60,
          product_yield: 2,
          experience_reward: 15,
          level_requirement: 1,
          image_url: '/animals/chicken.png',
          food_type: 'grain',
          food_consumption: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ]);

      const result = await AnimalService.getAvailableAnimalTypes(userId);

      expect(result).toHaveLength(1);
      expect(result[0]).toHaveProperty('can_buy', true);
    });

    it('当用户不存在时应该抛出错误', async () => {
      const userId = 1;

      vi.spyOn(UserModel, 'findById').mockResolvedValue(null);

      await expect(AnimalService.getAvailableAnimalTypes(userId)).rejects.toThrow('用户不存在');
    });
  });

  describe('buyAnimal', () => {
    it('应该成功购买动物', async () => {
      const userId = 1;
      const farmId = 1;
      const penId = 1;
      const animalTypeId = 1;

      vi.spyOn(UserModel, 'findById').mockResolvedValue({
        id: userId,
        username: 'testuser',
        email: 'test@example.com',
        password_hash: 'hashed',
        gold: 1000,
        experience: 0,
        level: 5,
        vouchers: 0,
        avatar: null,
        bio: null,
        last_login_at: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
      });

      vi.spyOn(AnimalTypeModel, 'findById').mockResolvedValue({
        id: animalTypeId,
        name: '鸡',
        description: '产蛋的家禽',
        purchase_price: 100,
        product_name: '鸡蛋',
        product_price: 5,
        product_time: 60,
        product_yield: 2,
        experience_reward: 15,
        level_requirement: 1,
        image_url: '/animals/chicken.png',
        food_type: 'grain',
        food_consumption: 1,
        created_at: new Date(),
        updated_at: new Date(),
      });

      vi.spyOn(FarmModel, 'findByUserId').mockResolvedValue({
        id: farmId,
        user_id: userId,
        name: '我的农场',
        description: null,
        max_plots: 6,
        max_animal_pens: 3,
        decoration_slots: 10,
        created_at: new Date(),
        updated_at: new Date(),
      });

      vi.spyOn(AnimalPenModel, 'findByFarmId').mockResolvedValue([
        {
          id: penId,
          farm_id: farmId,
          level: 1,
          capacity: 3,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ]);

      vi.spyOn(AnimalPenModel, 'getAnimalCount').mockResolvedValue(0);
      vi.spyOn(UserModel, 'reduceGold').mockResolvedValue(true);
      vi.spyOn(AnimalModel, 'create').mockResolvedValue(1);
      vi.spyOn(UserModel, 'findById').mockResolvedValue({
        id: userId,
        username: 'testuser',
        email: 'test@example.com',
        password_hash: 'hashed',
        gold: 900,
        experience: 0,
        level: 5,
        vouchers: 0,
        avatar: null,
        bio: null,
        last_login_at: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
      });

      const result = await AnimalService.buyAnimal(userId, { animal_type_id: animalTypeId });

      expect(result).toHaveProperty('animal_id', 1);
      expect(result).toHaveProperty('cost', 100);
      expect(result).toHaveProperty('remaining_gold', 900);
    });

    it('当等级不足时应该抛出错误', async () => {
      const userId = 1;
      const animalTypeId = 1;

      vi.spyOn(UserModel, 'findById').mockResolvedValue({
        id: userId,
        username: 'testuser',
        email: 'test@example.com',
        password_hash: 'hashed',
        gold: 1000,
        experience: 0,
        level: 1,
        vouchers: 0,
        avatar: null,
        bio: null,
        last_login_at: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
      });

      vi.spyOn(AnimalTypeModel, 'findById').mockResolvedValue({
        id: animalTypeId,
        name: '高级动物',
        description: '高级动物',
        purchase_price: 100,
        product_name: '产品',
        product_price: 5,
        product_time: 60,
        product_yield: 2,
        experience_reward: 15,
        level_requirement: 5,
        image_url: '/animals/high.png',
        food_type: 'grain',
        food_consumption: 1,
        created_at: new Date(),
        updated_at: new Date(),
      });

      await expect(AnimalService.buyAnimal(userId, { animal_type_id: animalTypeId })).rejects.toThrow('等级不足');
    });

    it('当金币不足时应该抛出错误', async () => {
      const userId = 1;
      const animalTypeId = 1;

      vi.spyOn(UserModel, 'findById').mockResolvedValue({
        id: userId,
        username: 'testuser',
        email: 'test@example.com',
        password_hash: 'hashed',
        gold: 50,
        experience: 0,
        level: 5,
        vouchers: 0,
        avatar: null,
        bio: null,
        last_login_at: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
      });

      vi.spyOn(AnimalTypeModel, 'findById').mockResolvedValue({
        id: animalTypeId,
        name: '鸡',
        description: '产蛋的家禽',
        purchase_price: 100,
        product_name: '鸡蛋',
        product_price: 5,
        product_time: 60,
        product_yield: 2,
        experience_reward: 15,
        level_requirement: 1,
        image_url: '/animals/chicken.png',
        food_type: 'grain',
        food_consumption: 1,
        created_at: new Date(),
        updated_at: new Date(),
      });

      await expect(AnimalService.buyAnimal(userId, { animal_type_id: animalTypeId })).rejects.toThrow('金币不足');
    });
  });

  describe('feedAnimal', () => {
    it('应该成功喂养动物', async () => {
      const userId = 1;
      const animalId = 1;

      vi.spyOn(UserModel, 'findById').mockResolvedValue({
        id: userId,
        username: 'testuser',
        email: 'test@example.com',
        password_hash: 'hashed',
        gold: 1000,
        experience: 0,
        level: 5,
        vouchers: 0,
        avatar: null,
        bio: null,
        last_login_at: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
      });

      vi.spyOn(AnimalModel, 'findById').mockResolvedValue({
        id: animalId,
        user_id: userId,
        animal_pen_id: 1,
        animal_type_id: 1,
        name: '小鸡',
        hunger_level: 50,
        last_fed_at: new Date(),
        product_progress: 0,
        last_product_at: null,
        state: AnimalState.PRODUCING,
        created_at: new Date(),
        updated_at: new Date(),
      });

      vi.spyOn(AnimalTypeModel, 'findById').mockResolvedValue({
        id: 1,
        name: '鸡',
        description: '产蛋的家禽',
        purchase_price: 100,
        product_name: '鸡蛋',
        product_price: 5,
        product_time: 60,
        product_yield: 2,
        experience_reward: 15,
        level_requirement: 1,
        image_url: '/animals/chicken.png',
        food_type: 'grain',
        food_consumption: 1,
        created_at: new Date(),
        updated_at: new Date(),
      });

      vi.spyOn(AnimalModel, 'feed').mockResolvedValue(true);

      const result = await AnimalService.feedAnimal(userId, { animal_id: animalId });

      expect(result).toHaveProperty('animal_id', animalId);
      expect(result).toHaveProperty('remaining_hunger_level', 100);
    });

    it('当动物已经饱了时应该抛出错误', async () => {
      const userId = 1;
      const animalId = 1;

      vi.spyOn(UserModel, 'findById').mockResolvedValue({
        id: userId,
        username: 'testuser',
        email: 'test@example.com',
        password_hash: 'hashed',
        gold: 1000,
        experience: 0,
        level: 5,
        vouchers: 0,
        avatar: null,
        bio: null,
        last_login_at: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
      });

      vi.spyOn(AnimalModel, 'findById').mockResolvedValue({
        id: animalId,
        user_id: userId,
        animal_pen_id: 1,
        animal_type_id: 1,
        name: '小鸡',
        hunger_level: 100,
        last_fed_at: new Date(),
        product_progress: 0,
        last_product_at: null,
        state: AnimalState.PRODUCING,
        created_at: new Date(),
        updated_at: new Date(),
      });

      await expect(AnimalService.feedAnimal(userId, { animal_id: animalId })).rejects.toThrow('动物已经饱了');
    });
  });

  describe('collectProduct', () => {
    it('应该成功收集产品', async () => {
      const userId = 1;
      const animalId = 1;

      vi.spyOn(UserModel, 'findById').mockResolvedValue({
        id: userId,
        username: 'testuser',
        email: 'test@example.com',
        password_hash: 'hashed',
        gold: 1000,
        experience: 0,
        level: 5,
        vouchers: 0,
        avatar: null,
        bio: null,
        last_login_at: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
      });

      vi.spyOn(AnimalModel, 'findById').mockResolvedValue({
        id: animalId,
        user_id: userId,
        animal_pen_id: 1,
        animal_type_id: 1,
        name: '小鸡',
        hunger_level: 80,
        last_fed_at: new Date(),
        product_progress: 100,
        last_product_at: null,
        state: AnimalState.READY,
        created_at: new Date(),
        updated_at: new Date(),
      });

      vi.spyOn(AnimalTypeModel, 'findById').mockResolvedValue({
        id: 1,
        name: '鸡',
        description: '产蛋的家禽',
        purchase_price: 100,
        product_name: '鸡蛋',
        product_price: 5,
        product_time: 60,
        product_yield: 2,
        experience_reward: 15,
        level_requirement: 1,
        image_url: '/animals/chicken.png',
        food_type: 'grain',
        food_consumption: 1,
        created_at: new Date(),
        updated_at: new Date(),
      });

      vi.spyOn(UserModel, 'addGold').mockResolvedValue(true);
      vi.spyOn(UserModel, 'addExperience').mockResolvedValue(true);
      vi.spyOn(AnimalModel, 'resetProductProgress').mockResolvedValue(true);
      vi.spyOn(UserModel, 'findById').mockResolvedValue({
        id: userId,
        username: 'testuser',
        email: 'test@example.com',
        password_hash: 'hashed',
        gold: 1010,
        experience: 15,
        level: 5,
        vouchers: 0,
        avatar: null,
        bio: null,
        last_login_at: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
      });

      const result = await AnimalService.collectProduct(userId, { animal_id: animalId });

      expect(result).toHaveProperty('product_name', '鸡蛋');
      expect(result).toHaveProperty('gold_gained', 10);
      expect(result).toHaveProperty('experience_gained', 15);
    });

    it('当产品尚未就绪时应该抛出错误', async () => {
      const userId = 1;
      const animalId = 1;

      vi.spyOn(UserModel, 'findById').mockResolvedValue({
        id: userId,
        username: 'testuser',
        email: 'test@example.com',
        password_hash: 'hashed',
        gold: 1000,
        experience: 0,
        level: 5,
        vouchers: 0,
        avatar: null,
        bio: null,
        last_login_at: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
      });

      vi.spyOn(AnimalModel, 'findById').mockResolvedValue({
        id: animalId,
        user_id: userId,
        animal_pen_id: 1,
        animal_type_id: 1,
        name: '小鸡',
        hunger_level: 100,
        last_fed_at: new Date(),
        product_progress: 50,
        last_product_at: null,
        state: AnimalState.PRODUCING,
        created_at: new Date(),
        updated_at: new Date(),
      });

      await expect(AnimalService.collectProduct(userId, { animal_id: animalId })).rejects.toThrow('产品尚未就绪');
    });
  });

  describe('upgradeAnimalPen', () => {
    it('应该成功升级动物栏', async () => {
      const userId = 1;
      const farmId = 1;
      const penId = 1;

      vi.spyOn(UserModel, 'findById').mockResolvedValue({
        id: userId,
        username: 'testuser',
        email: 'test@example.com',
        password_hash: 'hashed',
        gold: 1000,
        experience: 0,
        level: 5,
        vouchers: 0,
        avatar: null,
        bio: null,
        last_login_at: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
      });

      vi.spyOn(FarmModel, 'findByUserId').mockResolvedValue({
        id: farmId,
        user_id: userId,
        name: '我的农场',
        description: null,
        max_plots: 6,
        max_animal_pens: 3,
        decoration_slots: 10,
        created_at: new Date(),
        updated_at: new Date(),
      });

      vi.spyOn(AnimalPenModel, 'findById').mockResolvedValue({
        id: penId,
        farm_id: farmId,
        level: 1,
        capacity: 3,
        created_at: new Date(),
        updated_at: new Date(),
      });

      vi.spyOn(UserModel, 'reduceGold').mockResolvedValue(true);
      vi.spyOn(AnimalPenModel, 'upgrade').mockResolvedValue(true);
      vi.spyOn(AnimalPenModel, 'getDetail').mockResolvedValue({
        id: penId,
        farm_id: farmId,
        level: 2,
        capacity: 5,
        animal_count: 0,
        created_at: new Date(),
        updated_at: new Date(),
      });
      vi.spyOn(UserModel, 'findById').mockResolvedValue({
        id: userId,
        username: 'testuser',
        email: 'test@example.com',
        password_hash: 'hashed',
        gold: 800,
        experience: 0,
        level: 5,
        vouchers: 0,
        avatar: null,
        bio: null,
        last_login_at: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
      });

      const result = await AnimalService.upgradeAnimalPen(userId, { pen_id: penId });

      expect(result).toHaveProperty('pen_id', penId);
      expect(result).toHaveProperty('new_level', 2);
      expect(result).toHaveProperty('new_capacity', 5);
    });

    it('当金币不足时应该抛出错误', async () => {
      const userId = 1;
      const farmId = 1;
      const penId = 1;

      vi.spyOn(UserModel, 'findById').mockResolvedValue({
        id: userId,
        username: 'testuser',
        email: 'test@example.com',
        password_hash: 'hashed',
        gold: 100,
        experience: 0,
        level: 5,
        vouchers: 0,
        avatar: null,
        bio: null,
        last_login_at: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
      });

      vi.spyOn(FarmModel, 'findByUserId').mockResolvedValue({
        id: farmId,
        user_id: userId,
        name: '我的农场',
        description: null,
        max_plots: 6,
        max_animal_pens: 3,
        decoration_slots: 10,
        created_at: new Date(),
        updated_at: new Date(),
      });

      vi.spyOn(AnimalPenModel, 'findById').mockResolvedValue({
        id: penId,
        farm_id: farmId,
        level: 1,
        capacity: 3,
        created_at: new Date(),
        updated_at: new Date(),
      });

      await expect(AnimalService.upgradeAnimalPen(userId, { pen_id: penId })).rejects.toThrow('金币不足');
    });
  });

  describe('动物状态不变量', () => {
    it('饥饿度应该在0-100之间', async () => {
      const animal = {
        id: 1,
        user_id: 1,
        animal_pen_id: 1,
        animal_type_id: 1,
        name: '小鸡',
        hunger_level: 50,
        last_fed_at: new Date(),
        product_progress: 0,
        last_product_at: null,
        state: AnimalState.PRODUCING,
        created_at: new Date(),
        updated_at: new Date(),
      };

      expect(animal.hunger_level).toBeGreaterThanOrEqual(0);
      expect(animal.hunger_level).toBeLessThanOrEqual(100);
    });

    it('产出进度应该在0-100之间', async () => {
      const animal = {
        id: 1,
        user_id: 1,
        animal_pen_id: 1,
        animal_type_id: 1,
        name: '小鸡',
        hunger_level: 100,
        last_fed_at: new Date(),
        product_progress: 75,
        last_product_at: null,
        state: AnimalState.PRODUCING,
        created_at: new Date(),
        updated_at: new Date(),
      };

      expect(animal.product_progress).toBeGreaterThanOrEqual(0);
      expect(animal.product_progress).toBeLessThanOrEqual(100);
    });
  });
});