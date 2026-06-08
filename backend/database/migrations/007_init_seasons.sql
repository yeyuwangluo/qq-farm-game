-- 初始化季节数据
USE qq_farm_game;

INSERT INTO seasons (name, description, start_date, end_date, is_active) VALUES
  ('春季', '万物复苏的季节，樱花盛开', '2024-03-01', '2024-05-31', FALSE),
  ('夏季', '炎热多雨的季节，西瓜成熟', '2024-06-01', '2024-08-31', FALSE),
  ('秋季', '收获的季节，枫叶飘红', '2024-09-01', '2024-11-30', FALSE),
  ('冬季', '寒冷的季节，梅花傲雪', '2024-12-01', '2025-02-28', FALSE);