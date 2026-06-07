-- 初始化装饰物类型数据
USE qq_farm_game;

INSERT INTO decoration_types (name, description, price, category, size, experience_reward, level_requirement, image_url) VALUES
  -- 建筑（building）
  ('小木屋', '温馨的住所', 500, 'building', 'medium', 50, 1, '/decorations/cabin.png'),
  ('水井', '提供水源的设施', 300, 'building', 'small', 30, 1, '/decorations/well.png'),
  ('栅栏', '围合农场的设施', 200, 'building', 'small', 20, 1, '/decorations/fence.png'),
  ('风车', '自动灌溉设施', 1000, 'building', 'large', 100, 10, '/decorations/windmill.png'),
  ('谷仓', '存储农作物的建筑', 800, 'building', 'large', 80, 8, '/decorations/barn.png'),

  -- 植物（plant）
  ('小树苗', '刚刚种植的树', 100, 'plant', 'small', 10, 1, '/decorations/sapling.png'),
  ('大橡树', '提供阴凉的树木', 400, 'plant', 'medium', 40, 5, '/decorations/oak.png'),
  ('果树', '结果的果树', 600, 'plant', 'medium', 60, 8, '/decorations/fruit_tree.png'),
  ('花丛', '美丽的花朵', 150, 'plant', 'small', 15, 1, '/decorations/flowers.png'),
  ('竹子', '清幽的竹林', 250, 'plant', 'medium', 25, 3, '/decorations/bamboo.png'),

  -- 雕像（statue）
  ('石像', '古朴的石制雕像', 300, 'statue', 'small', 30, 3, '/decorations/stone_statue.png'),
  ('铜像', '华丽的铜制雕像', 800, 'statue', 'medium', 80, 10, '/decorations/bronze_statue.png'),
  ('金像', '珍贵的金制雕像', 2000, 'statue', 'large', 200, 20, '/decorations/gold_statue.png'),
  ('天使雕像', '神圣的天使雕像', 1500, 'statue', 'large', 150, 15, '/decorations/angel.png'),

  -- 家具（furniture）
  ('长椅', '休息用的椅子', 200, 'furniture', 'small', 20, 1, '/decorations/bench.png'),
  ('秋千', '娱乐设施', 350, 'furniture', 'medium', 35, 5, '/decorations/swing.png'),
  ('桌椅', '用餐的桌椅', 450, 'furniture', 'medium', 45, 6, '/decorations/table_chairs.png'),
  ('喷泉', '装饰性的水景', 700, 'furniture', 'medium', 70, 10, '/decorations/fountain.png'),
  ('花坛', '种植花卉的花坛', 250, 'furniture', 'small', 25, 3, '/decorations/flower_bed.png');