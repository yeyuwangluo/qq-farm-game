-- 初始化任务类型数据
USE qq_farm_game;

-- 每日任务
INSERT INTO quest_types (name, description, quest_type, requirement_type, requirement_value, reward_gold, reward_experience, level_requirement, is_repeatable) VALUES
  ('收获专家', '收获10个作物', 'daily', 'harvest', 10, 100, 50, 1, TRUE),
  ('种植达人', '种植5个作物', 'daily', 'plant', 5, 80, 40, 1, TRUE),
  ('农场园丁', '帮助好友3次', 'daily', 'help', 3, 120, 60, 1, TRUE),
  ('社交达人', '访问5个好友农场', 'daily', 'visit', 5, 100, 50, 1, TRUE),
  ('勤劳农夫', '收获20个作物', 'daily', 'harvest', 20, 200, 100, 5, TRUE),
  ('动物爱好者', '喂养5个动物', 'daily', 'raise', 5, 150, 75, 5, TRUE),
  ('丰收之喜', '收获30个作物', 'daily', 'harvest', 30, 300, 150, 10, TRUE),
  ('农场主', '种植10个作物', 'daily', 'plant', 10, 200, 100, 10, TRUE);

-- 每周任务
INSERT INTO quest_types (name, description, quest_type, requirement_type, requirement_value, reward_gold, reward_experience, level_requirement, is_repeatable) VALUES
  ('周常收获', '本周收获100个作物', 'weekly', 'harvest', 100, 500, 250, 1, TRUE),
  ('周常种植', '本周种植50个作物', 'weekly', 'plant', 50, 400, 200, 1, TRUE),
  ('周常帮助', '本周帮助好友20次', 'weekly', 'help', 20, 600, 300, 1, TRUE),
  ('周常社交', '本周访问30个好友农场', 'weekly', 'visit', 30, 500, 250, 1, TRUE),
  ('周常养殖', '本周喂养30个动物', 'weekly', 'raise', 30, 600, 300, 5, TRUE),
  ('丰收之王', '本周收获200个作物', 'weekly', 'harvest', 200, 1000, 500, 10, TRUE);

-- 成就任务
INSERT INTO quest_types (name, description, quest_type, requirement_type, requirement_value, reward_gold, reward_experience, reward_vouchers, level_requirement, is_repeatable) VALUES
  ('初出茅庐', '达到等级5', 'achievement', 'level', 5, 200, 100, 0, 1, FALSE),
  ('小有成就', '达到等级10', 'achievement', 'level', 10, 500, 250, 5, 5, FALSE),
  ('农场大师', '达到等级20', 'achievement', 'level', 20, 2000, 1000, 20, 10, FALSE),
  ('农场传奇', '达到等级50', 'achievement', 'level', 50, 10000, 5000, 100, 20, FALSE),
  ('收获达人', '累计收获1000个作物', 'achievement', 'harvest', 1000, 1000, 500, 10, FALSE),
  ('种植达人', '累计种植500个作物', 'achievement', 'plant', 500, 800, 400, 5, FALSE),
  ('动物达人', '累计收获500个动物产品', 'achievement', 'raise', 500, 1200, 600, 15, FALSE),
  ('社交达人', '累计访问好友农场200次', 'achievement', 'visit', 200, 600, 300, 5, FALSE),
  ('帮助达人', '累计帮助好友100次', 'achievement', 'help', 100, 800, 400, 5, FALSE),
  ('财富达人', '累计获得10000金币', 'achievement', 'wealth', 10000, 2000, 1000, 10, FALSE);