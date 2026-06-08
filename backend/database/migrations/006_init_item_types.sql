-- 初始化物品类型数据
USE qq_farm_game;

INSERT INTO item_types (name, description, category, price, sellable, stackable, stack_limit, image_url) VALUES
  -- 种子（seed）
  ('小麦种子', '种植小麦的种子', 'seed', 10, FALSE, TRUE, 99, '/items/wheat_seed.png'),
  ('玉米种子', '种植玉米的种子', 'seed', 15, FALSE, TRUE, 99, '/items/corn_seed.png'),
  ('胡萝卜种子', '种植胡萝卜的种子', 'seed', 20, FALSE, TRUE, 99, '/items/carrot_seed.png'),
  ('土豆种子', '种植土豆的种子', 'seed', 25, FALSE, TRUE, 99, '/items/potato_seed.png'),
  ('番茄种子', '种植番茄的种子', 'seed', 30, FALSE, TRUE, 99, '/items/tomato_seed.png'),
  ('西瓜种子', '种植西瓜的种子', 'seed', 50, FALSE, TRUE, 99, '/items/watermelon_seed.png'),

  -- 化肥（fertilizer）
  ('普通化肥', '减少30%生长时间', 'fertilizer', 20, FALSE, TRUE, 50, '/items/fertilizer.png'),
  ('高级化肥', '减少50%生长时间', 'fertilizer', 50, FALSE, TRUE, 30, '/items/premium_fertilizer.png'),
  ('超级化肥', '减少70%生长时间', 'fertilizer', 100, FALSE, TRUE, 10, '/items/super_fertilizer.png'),

  -- 加速剂（accelerator）
  ('生长加速剂', '立即作物成熟', 'accelerator', 30, FALSE, TRUE, 20, '/items/growth_accelerator.png'),
  ('产出加速剂', '立即动物产出', 'accelerator', 40, FALSE, TRUE, 15, '/items/production_accelerator.png'),

  -- 饲料（food）
  ('谷物饲料', '喂养鸡等动物', 'food', 5, FALSE, TRUE, 100, '/items/grain_feed.png'),
  ('胡萝卜饲料', '喂养兔子等动物', 'food', 8, FALSE, TRUE, 100, '/items/carrot_feed.png'),
  ('鱼类饲料', '喂养鸭子等动物', 'food', 10, FALSE, TRUE, 100, '/items/fish_feed.png'),
  ('牧草', '喂养羊等动物', 'food', 12, FALSE, TRUE, 100, '/items/grass.png'),
  ('优质牧草', '喂养奶牛等动物', 'food', 20, FALSE, TRUE, 50, '/items/premium_grass.png'),

  -- 工具（tool）
  ('锄头', '种植工具', 'tool', 100, TRUE, TRUE, 1, '/items/hoe.png'),
  ('水桶', '浇水工具', 'tool', 80, TRUE, TRUE, 1, '/items/bucket.png'),
  ('篮子', '收获工具', 'tool', 60, TRUE, TRUE, 1, '/items/basket.png'),

  -- 特殊（special）
  ('神秘种子', '随机生长出稀有作物', 'special', 100, FALSE, TRUE, 5, '/items/mystery_seed.png'),
  ('祝福光环', '保护作物不被偷取', 'special', 200, FALSE, TRUE, 3, '/items/blessing_aura.png'),
  ('丰收礼盒', '包含多种作物种子', 'special', 150, FALSE, TRUE, 10, '/items/harvest_gift.png'),
  ('宠物饲料', '喂养宠物的好东西', 'special', 50, FALSE, TRUE, 20, '/items/pet_food.png'),
  ('友谊徽章', '增加好友好感度', 'special', 30, FALSE, TRUE, 20, '/items/friendship_badge.png');

-- 作物产品
INSERT INTO item_types (name, description, category, price, sellable, stackable, stack_limit, image_url) VALUES
  ('小麦', '收获的小麦', 'special', 20, TRUE, TRUE, 100, '/items/wheat.png'),
  ('玉米', '收获的玉米', 'special', 30, TRUE, TRUE, 100, '/items/corn.png'),
  ('胡萝卜', '收获的胡萝卜', 'special', 40, TRUE, TRUE, 100, '/items/carrot.png'),
  ('土豆', '收获的土豆', 'special', 50, TRUE, TRUE, 100, '/items/potato.png'),
  ('番茄', '收获的番茄', 'special', 60, TRUE, TRUE, 100, '/items/tomato.png'),
  ('西瓜', '收获的西瓜', 'special', 100, TRUE, TRUE, 50, '/items/watermelon.png'),
  ('鸡蛋', '鸡产下的蛋', 'special', 5, TRUE, TRUE, 100, '/items/egg.png'),
  ('兔毛', '兔子产出的毛', 'special', 8, TRUE, TRUE, 50, '/items/rabbit_fur.png'),
  ('鸭蛋', '鸭子产下的蛋', 'special', 10, TRUE, TRUE, 100, '/items/duck_egg.png'),
  ('羊毛', '羊产出的毛', 'special', 15, TRUE, TRUE, 50, '/items/wool.png'),
  ('鹅蛋', '鹅产下的蛋', 'special', 20, TRUE, TRUE, 100, '/items/goose_egg.png'),
  ('猪肉', '猪产出的肉', 'special', 25, TRUE, TRUE, 50, '/items/pork.png'),
  ('牛奶', '奶牛产出的奶', 'special', 35, TRUE, TRUE, 100, '/items/milk.png'),
  ('马毛', '马产出的毛', 'special', 45, TRUE, TRUE, 50, '/items/horse_fur.png'),
  ('羊奶', '山羊产出的奶', 'special', 40, TRUE, TRUE, 100, '/items/goat_milk.png');