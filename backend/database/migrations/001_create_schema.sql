-- 创建数据库
CREATE DATABASE IF NOT EXISTS qq_farm_game CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE qq_farm_game;

-- 用户表
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  nickname VARCHAR(50),
  avatar_url VARCHAR(255),
  level INT DEFAULT 1,
  experience BIGINT DEFAULT 0,
  gold INT DEFAULT 1000,
  vouchers INT DEFAULT 0,
  farm_name VARCHAR(100),
  farm_description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  last_login_at TIMESTAMP NULL,
  is_active BOOLEAN DEFAULT TRUE,
  INDEX idx_username (username),
  INDEX idx_email (email),
  INDEX idx_level (level),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 农场表
CREATE TABLE farms (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  name VARCHAR(100) DEFAULT '我的农场',
  description TEXT,
  max_plots INT DEFAULT 6,
  max_animal_pens INT DEFAULT 3,
  decoration_slots INT DEFAULT 10,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 土地表
CREATE TABLE plots (
  id INT AUTO_INCREMENT PRIMARY KEY,
  farm_id INT NOT NULL,
  plot_index INT NOT NULL,
  level INT DEFAULT 1,
  crop_type_id INT NULL,
  planted_at TIMESTAMP NULL,
  harvest_at TIMESTAMP NULL,
  state ENUM('empty', 'growing', 'mature', 'withered') DEFAULT 'empty',
  fertilizer_used BOOLEAN DEFAULT FALSE,
  last_watered_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (farm_id) REFERENCES farms(id) ON DELETE CASCADE,
  UNIQUE KEY uk_farm_plot_index (farm_id, plot_index),
  INDEX idx_farm_id (farm_id),
  INDEX idx_state (state)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 作物类型表
CREATE TABLE crop_types (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  description TEXT,
  seed_price INT NOT NULL,
  sell_price INT NOT NULL,
  growth_time INT NOT NULL COMMENT '生长时间（分钟）',
  yield_base INT DEFAULT 1,
  experience_reward INT DEFAULT 10,
  level_requirement INT DEFAULT 1,
  image_url VARCHAR(255),
  is_seasonal BOOLEAN DEFAULT FALSE,
  season_id INT NULL,
  voucher_drop_chance DECIMAL(5,2) DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_level_requirement (level_requirement),
  INDEX idx_is_seasonal (is_seasonal)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 作物表（历史记录）
CREATE TABLE crops (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  crop_type_id INT NOT NULL,
  plot_id INT NOT NULL,
  yield INT DEFAULT 1,
  harvested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (crop_type_id) REFERENCES crop_types(id),
  FOREIGN KEY (plot_id) REFERENCES plots(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_crop_type_id (crop_type_id),
  INDEX idx_harvested_at (harvested_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 动物类型表
CREATE TABLE animal_types (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  description TEXT,
  purchase_price INT NOT NULL,
  product_name VARCHAR(50),
  product_price INT,
  product_time INT NOT NULL COMMENT '产出时间（分钟）',
  product_yield INT DEFAULT 1,
  experience_reward INT DEFAULT 15,
  level_requirement INT DEFAULT 1,
  image_url VARCHAR(255),
  food_type VARCHAR(50) DEFAULT 'feed',
  food_consumption INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_level_requirement (level_requirement)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 动物栏表
CREATE TABLE animal_pens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  farm_id INT NOT NULL,
  level INT DEFAULT 1,
  capacity INT DEFAULT 3,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (farm_id) REFERENCES farms(id) ON DELETE CASCADE,
  INDEX idx_farm_id (farm_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 动物表
CREATE TABLE animals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  animal_pen_id INT NOT NULL,
  animal_type_id INT NOT NULL,
  name VARCHAR(50),
  hunger_level INT DEFAULT 100,
  last_fed_at TIMESTAMP NULL,
  product_progress INT DEFAULT 0,
  last_product_at TIMESTAMP NULL,
  state ENUM('hungry', 'producing', 'ready', 'starving') DEFAULT 'hungry',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (animal_pen_id) REFERENCES animal_pens(id) ON DELETE CASCADE,
  FOREIGN KEY (animal_type_id) REFERENCES animal_types(id),
  INDEX idx_user_id (user_id),
  INDEX idx_animal_pen_id (animal_pen_id),
  INDEX idx_state (state)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 装饰物类型表
CREATE TABLE decoration_types (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  description TEXT,
  price INT NOT NULL,
  category ENUM('building', 'plant', 'statue', 'furniture') DEFAULT 'building',
  size ENUM('small', 'medium', 'large') DEFAULT 'medium',
  experience_reward INT DEFAULT 20,
  level_requirement INT DEFAULT 1,
  image_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category (category),
  INDEX idx_level_requirement (level_requirement)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 装饰物表
CREATE TABLE decorations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  decoration_type_id INT NOT NULL,
  farm_id INT NOT NULL,
  position_x INT NOT NULL,
  position_y INT NOT NULL,
  name VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (decoration_type_id) REFERENCES decoration_types(id),
  FOREIGN KEY (farm_id) REFERENCES farms(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_farm_id (farm_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 物品类型表
CREATE TABLE item_types (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  description TEXT,
  category ENUM('seed', 'fertilizer', 'accelerator', 'food', 'tool', 'special') DEFAULT 'seed',
  price INT DEFAULT 0,
  sellable BOOLEAN DEFAULT TRUE,
  stackable BOOLEAN DEFAULT TRUE,
  stack_limit INT DEFAULT 99,
  image_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 物品表
CREATE TABLE items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  item_type_id INT NOT NULL,
  related_id INT NULL COMMENT '关联的作物类型、动物类型等ID',
  quantity INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (item_type_id) REFERENCES item_types(id),
  INDEX idx_item_type_id (item_type_id),
  INDEX idx_related_id (related_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 背包表
CREATE TABLE inventory (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  item_id INT NOT NULL,
  quantity INT DEFAULT 1,
  obtained_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE,
  UNIQUE KEY uk_user_item (user_id, item_id),
  INDEX idx_user_id (user_id),
  INDEX idx_item_id (item_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 好友表
CREATE TABLE friendships (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  friend_id INT NOT NULL,
  status ENUM('pending', 'accepted', 'blocked') DEFAULT 'pending',
  requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  accepted_at TIMESTAMP NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (friend_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY uk_user_friend (user_id, friend_id),
  INDEX idx_user_id (user_id),
  INDEX idx_friend_id (friend_id),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 社交活动表
CREATE TABLE social_activities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  target_user_id INT NOT NULL,
  activity_type ENUM('visit', 'help', 'steal', 'gift') NOT NULL,
  target_type ENUM('plot', 'animal', 'farm') NOT NULL,
  target_id INT NOT NULL,
  result TEXT COMMENT '活动结果JSON',
  performed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (target_user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_target_user_id (target_user_id),
  INDEX idx_performed_at (performed_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 任务类型表
CREATE TABLE quest_types (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  quest_type ENUM('daily', 'weekly', 'achievement') DEFAULT 'daily',
  requirement_type ENUM('harvest', 'plant', 'raise', 'help', 'visit', 'level') NOT NULL,
  requirement_value INT NOT NULL,
  reward_gold INT DEFAULT 0,
  reward_experience INT DEFAULT 0,
  reward_vouchers INT DEFAULT 0,
  level_requirement INT DEFAULT 1,
  is_repeatable BOOLEAN DEFAULT TRUE,
  repeat_interval INT DEFAULT 86400 COMMENT '重复间隔（秒）',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_quest_type (quest_type),
  INDEX idx_level_requirement (level_requirement)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 用户任务表
CREATE TABLE user_quests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  quest_type_id INT NOT NULL,
  progress INT DEFAULT 0,
  target_value INT NOT NULL,
  status ENUM('in_progress', 'completed', 'claimed', 'expired') DEFAULT 'in_progress',
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP NULL,
  claimed_at TIMESTAMP NULL,
  expires_at TIMESTAMP NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (quest_type_id) REFERENCES quest_types(id),
  INDEX idx_user_id (user_id),
  INDEX idx_status (status),
  INDEX idx_expires_at (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 成就类型表
CREATE TABLE achievement_types (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  requirement_type ENUM('level', 'harvest', 'plant', 'raise', 'wealth', 'social') NOT NULL,
  requirement_value INT NOT NULL,
  reward_gold INT DEFAULT 0,
  reward_experience INT DEFAULT 0,
  reward_vouchers INT DEFAULT 0,
  reward_title VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_requirement_type (requirement_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 用户成就表
CREATE TABLE user_achievements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  achievement_type_id INT NOT NULL,
  progress INT DEFAULT 0,
  unlocked_at TIMESTAMP NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (achievement_type_id) REFERENCES achievement_types(id),
  UNIQUE KEY uk_user_achievement (user_id, achievement_type_id),
  INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 通知表
CREATE TABLE notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  type ENUM('system', 'social', 'quest', 'achievement', 'harvest', 'animal') NOT NULL,
  title VARCHAR(200) NOT NULL,
  message TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  action_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_is_read (is_read),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 季节表
CREATE TABLE seasons (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_active BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_is_active (is_active),
  INDEX idx_dates (start_date, end_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 游戏配置表
CREATE TABLE game_config (
  id INT AUTO_INCREMENT PRIMARY KEY,
  config_key VARCHAR(100) NOT NULL UNIQUE,
  config_value TEXT NOT NULL,
  description TEXT,
  category VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_config_key (config_key),
  INDEX idx_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;