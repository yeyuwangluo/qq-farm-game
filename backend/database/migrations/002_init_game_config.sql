-- 初始化游戏配置数据
USE qq_farm_game;

-- 经济参数
INSERT INTO game_config (config_key, config_value, description, category) VALUES
  ('initial_gold', '1000', '初始金币数量', 'economy'),
  ('initial_experience', '0', '初始经验值', 'economy'),
  ('initial_vouchers', '0', '初始点券数量', 'economy'),
  ('harvest_gold_multiplier', '1.0', '收获金币倍率', 'economy'),
  ('harvest_experience_multiplier', '1.0', '收获经验倍率', 'economy'),
  ('voucher_drop_rate', '0.05', '点券掉落基础概率', 'economy'),
  ('level_experience_multiplier', '1.2', '等级经验增长倍率', 'economy'),
  ('plot_upgrade_cost_base', '500', '土地升级基础成本（金币）', 'economy'),
  ('plot_upgrade_cost_multiplier', '2.0', '土地升级成本倍率', 'economy'),
  ('animal_pen_upgrade_cost_base', '1000', '动物栏升级基础成本（金币）', 'economy');

-- 游戏参数
INSERT INTO game_config (config_key, config_value, description, category) VALUES
  ('max_level', '100', '最大等级', 'game'),
  ('initial_plots', '6', '初始土地数量', 'game'),
  ('initial_animal_pens', '1', '初始动物栏数量', 'game'),
  ('initial_decoration_slots', '10', '初始装饰物位数量', 'game'),
  ('max_plots', '15', '最大土地数量', 'game'),
  ('max_animal_pens', '5', '最大动物栏数量', 'game'),
  ('crop_wither_time', '120', '作物枯萎时间（分钟）', 'game'),
  ('animal_starve_time', '240', '动物饥饿时间（分钟）', 'game'),
  ('fertilizer_growth_reduction', '0.3', '化肥生长时间减少比例', 'game'),
  ('max_friends', '100', '最大好友数量', 'game'),
  ('daily_help_limit', '10', '每日帮助好友次数限制', 'game'),
  ('daily_steal_limit', '5', '每日偷菜次数限制', 'game'),
  ('notification_expire_days', '7', '通知保留天数', 'game'),
  ('daily_reset_time', '00:00', '每日重置时间', 'game');

-- 作物等级解锁参数
INSERT INTO game_config (config_key, config_value, description, category) VALUES
  ('crop_level_requirement_base', '1', '作物等级要求基础值', 'crop'),
  ('crop_level_requirement_step', '5', '作物等级要求递增步长', 'crop'),
  ('crop_growth_time_base', '60', '作物生长时间基础值（分钟）', 'crop'),
  ('crop_growth_time_multiplier', '1.1', '作物生长时间倍率', 'crop');

-- 动物等级解锁参数
INSERT INTO game_config (config_key, config_value, description, category) VALUES
  ('animal_level_requirement_base', '1', '动物等级要求基础值', 'animal'),
  ('animal_level_requirement_step', '8', '动物等级要求递增步长', 'animal'),
  ('animal_product_time_base', '120', '动物产出时间基础值（分钟）', 'animal'),
  ('animal_product_time_multiplier', '1.15', '动物产出时间倍率', 'animal');

-- 任务参数
INSERT INTO game_config (config_key, config_value, description, category) VALUES
  ('daily_quest_limit', '5', '每日任务数量限制', 'quest'),
  ('weekly_quest_limit', '3', '每周任务数量限制', 'quest'),
  ('daily_quest_reward_gold', '100', '每日任务金币奖励', 'quest'),
  ('daily_quest_reward_experience', '50', '每日任务经验奖励', 'quest'),
  ('weekly_quest_reward_gold', '300', '每周任务金币奖励', 'quest'),
  ('weekly_quest_reward_experience', '150', '每周任务经验奖励', 'quest');

-- 升级参数
INSERT INTO game_config (config_key, config_value, description, category) VALUES
  ('level_1_experience', '0', '等级1所需经验', 'upgrade'),
  ('level_2_experience', '100', '等级2所需经验', 'upgrade'),
  ('level_3_experience', '220', '等级3所需经验', 'upgrade'),
  ('level_experience_growth_rate', '1.2', '等级经验增长率', 'upgrade'),
  ('upgrade_reward_base', '10', '升级奖励基础值（金币）', 'upgrade'),
  ('upgrade_reward_multiplier', '1.5', '升级奖励倍率', 'upgrade');

-- 季节参数
INSERT INTO game_config (config_key, config_value, description, category) VALUES
  ('season_duration_days', '30', '季节持续天数', 'season'),
  ('season_crop_bonus_multiplier', '1.2', '季节作物加成倍率', 'season'),
  ('season_voucher_bonus_rate', '0.1', '季节点券加成概率', 'season');

-- 社交参数
INSERT INTO game_config (config_key, config_value, description, category) VALUES
  ('visit_experience_reward', '5', '访问好友经验奖励', 'social'),
  ('help_experience_reward', '10', '帮助好友经验奖励', 'social'),
  ('steal_experience_penalty', '5', '偷菜经验惩罚', 'social'),
  ('steal_gold_gain', '20', '偷菜金币获得', 'social'),
  ('gift_cost', '50', '送礼金币成本', 'social'),
  ('friend_request_expire_days', '7', '好友请求过期天数', 'social');