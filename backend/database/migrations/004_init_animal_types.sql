-- 初始化动物类型数据
USE qq_farm_game;

INSERT INTO animal_types (name, description, purchase_price, product_name, product_price, product_time, product_yield, experience_reward, level_requirement, image_url, food_type, food_consumption) VALUES
  -- 基础动物（等级1）
  ('鸡', '产蛋的家禽', 100, '鸡蛋', 5, 60, 2, 15, 1, '/animals/chicken.png', 'grain', 1),
  ('兔子', '可爱的毛茸茸小动物', 120, '兔毛', 8, 90, 1, 18, 1, '/animals/rabbit.png', 'carrot', 1),
  ('鸭子', '产蛋的水禽', 150, '鸭蛋', 10, 120, 2, 20, 1, '/animals/duck.png', 'fish', 1),

  -- 等级5动物
  ('羊', '产毛的家畜', 200, '羊毛', 15, 180, 2, 30, 5, '/animals/sheep.png', 'grass', 2),
  ('鹅', '体型较大的水禽', 250, '鹅蛋', 20, 200, 3, 35, 5, '/animals/goose.png', 'fish', 2),
  ('猪', '产肉的家畜', 300, '猪肉', 25, 240, 2, 40, 5, '/animals/pig.png', 'feed', 2),

  -- 等级10动物
  ('奶牛', '产奶的家畜', 400, '牛奶', 35, 300, 3, 50, 10, '/animals/cow.png', 'grass', 3),
  ('马', '忠诚的坐骑', 500, '马毛', 45, 360, 2, 60, 10, '/animals/horse.png', 'hay', 3),
  ('山羊', '产奶的山区动物', 450, '羊奶', 40, 330, 2, 55, 10, '/animals/goat.png', 'grass', 3),

  -- 等级15动物
  ('绵羊', '优质羊毛来源', 600, '优质羊毛', 60, 420, 3, 75, 15, '/animals/merino.png', 'grass', 4),
  ('火鸡', '节日特色动物', 700, '火鸡肉', 70, 480, 2, 85, 15, '/animals/turkey.png', 'feed', 4),

  -- 等级20动物
  ('孔雀', '美丽的观赏动物', 1000, '孔雀羽毛', 120, 600, 2, 120, 20, '/animals/peacock.png', 'fruit', 5),
  ('天鹅', '优雅的水禽', 1200, '天鹅绒毛', 150, 720, 2, 150, 20, '/animals/swan.png', 'fish', 5);