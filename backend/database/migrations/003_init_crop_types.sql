-- 初始化作物类型数据
USE qq_farm_game;

INSERT INTO crop_types (name, description, seed_price, sell_price, growth_time, yield_base, experience_reward, level_requirement, image_url, is_seasonal) VALUES
  -- 基础作物（等级1）
  ('小麦', '最基础的作物，生长周期短', 10, 20, 30, 2, 10, 1, '/crops/wheat.png', FALSE),
  ('玉米', '常见的谷物作物', 15, 30, 45, 3, 15, 1, '/crops/corn.png', FALSE),
  ('胡萝卜', '营养丰富的蔬菜', 20, 40, 60, 3, 20, 1, '/crops/carrot.png', FALSE),
  ('土豆', '产量高的主食作物', 25, 50, 75, 4, 25, 1, '/crops/potato.png', FALSE),

  -- 等级5作物
  ('番茄', '酸甜可口的蔬菜', 30, 60, 90, 4, 30, 5, '/crops/tomato.png', FALSE),
  ('黄瓜', '清脆爽口的蔬菜', 35, 70, 105, 5, 35, 5, '/crops/cucumber.png', FALSE),
  ('茄子', '紫色的蔬菜', 40, 80, 120, 5, 40, 5, '/crops/eggplant.png', FALSE),
  ('辣椒', '辛辣的调料作物', 45, 90, 135, 6, 45, 5, '/crops/chili.png', FALSE),

  -- 等级10作物
  ('西瓜', '夏季消暑水果', 50, 100, 150, 6, 50, 10, '/crops/watermelon.png', FALSE),
  ('草莓', '香甜的水果', 55, 110, 165, 7, 55, 10, '/crops/strawberry.png', FALSE),
  ('葡萄', '酿酒的原料', 60, 120, 180, 7, 60, 10, '/crops/grape.png', FALSE),
  ('桃子', '香甜多汁的水果', 65, 130, 195, 8, 65, 10, '/crops/peach.png', FALSE),

  -- 等级15作物
  ('南瓜', '万圣节特色作物', 70, 140, 210, 8, 70, 15, '/crops/pumpkin.png', FALSE),
  ('荔枝', '南方热带水果', 75, 150, 225, 9, 75, 15, '/crops/lychee.png', FALSE),
  ('芒果', '热带水果之王', 80, 160, 240, 9, 80, 15, '/crops/mango.png', FALSE),
  ('火龙果', '外观独特的热带水果', 85, 170, 255, 10, 85, 15, '/crops/dragonfruit.png', FALSE),

  -- 等级20作物
  ('金瓜', '稀有珍贵的金色作物', 100, 200, 300, 10, 100, 20, '/crops/goldmelon.png', FALSE),
  ('彩虹花', '美丽多彩的花朵', 110, 220, 330, 11, 110, 20, '/crops/rainbowflower.png', FALSE);

-- 季节性作物（春季）
INSERT INTO crop_types (name, description, seed_price, sell_price, growth_time, yield_base, experience_reward, level_requirement, image_url, is_seasonal, season_id, voucher_drop_chance) VALUES
  ('樱花', '春季限定的美丽花朵', 60, 150, 180, 5, 80, 10, '/crops/cherryblossom.png', TRUE, 1, 0.10),
  ('春笋', '春季特有的嫩芽', 70, 175, 200, 6, 90, 15, '/crops/bambooshoot.png', TRUE, 1, 0.15);

-- 季节性作物（夏季）
INSERT INTO crop_types (name, description, seed_price, sell_price, growth_time, yield_base, experience_reward, level_requirement, image_url, is_seasonal, season_id, voucher_drop_chance) VALUES
  ('荷花', '夏季清雅的水生植物', 65, 160, 190, 5, 85, 12, '/crops/lotus.png', TRUE, 2, 0.10),
  ('西瓜冰', '夏季消暑特供作物', 80, 200, 250, 7, 100, 18, '/crops/icedwatermelon.png', TRUE, 2, 0.20);

-- 季节性作物（秋季）
INSERT INTO crop_types (name, description, seed_price, sell_price, growth_time, yield_base, experience_reward, level_requirement, image_url, is_seasonal, season_id, voucher_drop_chance) VALUES
  ('枫叶', '秋季红叶飘零', 55, 140, 170, 5, 75, 8, '/crops/mapleleaf.png', TRUE, 3, 0.10),
  ('桂花', '秋季香气扑鼻', 75, 185, 210, 6, 95, 16, '/crops/osmanthus.png', TRUE, 3, 0.15);

-- 季节性作物（冬季）
INSERT INTO crop_types (name, description, seed_price, sell_price, growth_time, yield_base, experience_reward, level_requirement, image_url, is_seasonal, season_id, voucher_drop_chance) VALUES
  ('梅花', '冬季傲雪凌霜', 70, 175, 200, 6, 90, 14, '/crops/plumblossom.png', TRUE, 4, 0.10),
  ('雪莲', '高山雪地珍品', 120, 300, 360, 10, 150, 25, '/crops/snowlotus.png', TRUE, 4, 0.30);