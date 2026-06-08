/**
 * 季节服务单元测试
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import SeasonService from '../../src/services/season.service';
import SeasonModel from '../../src/models/season.model';
import { AppError } from '../../src/utils/response';

describe('SeasonService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getCurrentSeason', () => {
    it('应该成功获取当前季节', async () => {
      const mockSeason = {
        id: 1,
        name: 'Spring',
        description: '春季',
        start_date: new Date(),
        end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      };

      vi.spyOn(SeasonModel, 'getCurrentSeason').mockResolvedValue(mockSeason);
      vi.spyOn(SeasonModel, 'getRemainingDays').mockResolvedValue(7);

      const result = await SeasonService.getCurrentSeason();

      expect(result).toHaveProperty('id', 1);
      expect(result).toHaveProperty('name', 'Spring');
      expect(result).toHaveProperty('remaining_days', 7);
    });

    it('当没有当前季节时应该自动切换', async () => {
      vi.spyOn(SeasonModel, 'getCurrentSeason').mockResolvedValue(null);
      vi.spyOn(SeasonModel, 'switchToNextSeason').mockResolvedValue({
        id: 1,
        name: 'Spring',
      });
      vi.spyOn(SeasonModel, 'getCurrentSeason').mockResolvedValue({
        id: 1,
        name: 'Spring',
        description: '春季',
        start_date: new Date(),
        end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      });
      vi.spyOn(SeasonModel, 'getRemainingDays').mockResolvedValue(7);

      const result = await SeasonService.getCurrentSeason();

      expect(result).toHaveProperty('id', 1);
      expect(SeasonModel.switchToNextSeason).toHaveBeenCalled();
    });
  });

  describe('getSeasonActivities', () => {
    it('应该成功获取季节活动信息', async () => {
      const mockSeason = {
        id: 1,
        name: 'Spring',
        description: '春季',
        start_date: new Date(),
        end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      };

      vi.spyOn(SeasonModel, 'getCurrentSeason').mockResolvedValue(mockSeason);

      const result = await SeasonService.getSeasonActivities();

      expect(result).toHaveProperty('season', 'Spring');
      expect(result).toHaveProperty('activities');
      expect(result.activities).toBeInstanceOf(Array);
      expect(result.activities.length).toBeGreaterThan(0);
    });

    it('当没有活跃季节时应该抛出错误', async () => {
      vi.spyOn(SeasonModel, 'getCurrentSeason').mockResolvedValue(null);

      await expect(SeasonService.getSeasonActivities()).rejects.toThrow('当前没有活跃的季节');
    });
  });

  describe('switchSeason', () => {
    it('应该成功切换季节', async () => {
      const mockSeason = {
        id: 2,
        name: 'Summer',
        description: '夏季',
        start_date: new Date(),
        end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        is_active: false,
        created_at: new Date(),
        updated_at: new Date(),
      };

      vi.spyOn(SeasonModel, 'findById').mockResolvedValue(mockSeason);
      vi.spyOn(SeasonModel, 'activate').mockResolvedValue(true);

      const result = await SeasonService.switchSeason(2);

      expect(result).toHaveProperty('message', '季节已切换');
      expect(result).toHaveProperty('season_id', 2);
      expect(result).toHaveProperty('season_name', 'Summer');
    });

    it('当季节不存在时应该抛出错误', async () => {
      vi.spyOn(SeasonModel, 'findById').mockResolvedValue(null);

      await expect(SeasonService.switchSeason(999)).rejects.toThrow('季节不存在');
    });
  });

  describe('getAllSeasons', () => {
    it('应该成功获取所有季节', async () => {
      const mockSeasons = [
        {
          id: 1,
          name: 'Spring',
          description: '春季',
          start_date: new Date(),
          end_date: new Date(),
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 2,
          name: 'Summer',
          description: '夏季',
          start_date: new Date(),
          end_date: new Date(),
          is_active: false,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ];

      vi.spyOn(SeasonModel, 'findAll').mockResolvedValue(mockSeasons);
      vi.spyOn(SeasonModel, 'getRemainingDays')
        .mockResolvedValueOnce(7)
        .mockResolvedValueOnce(0);

      const result = await SeasonService.getAllSeasons();

      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty('name', 'Spring');
      expect(result[1]).toHaveProperty('name', 'Summer');
    });
  });
});