# 数据库初始化说明

## 概述

本目录包含QQ农场游戏数据库的所有初始化脚本。

## 文件说明

### 迁移脚本

1. **001_create_schema.sql** - 创建数据库表结构
   - users - 用户表
   - farms - 农场表
   - plots - 土地表
   - crop_types - 作物类型表
   - crops - 作物表
   - animal_types - 动物类型表
   - animal_pens - 动物栏表
   - animals - 动物表
   - decoration_types - 装饰物类型表
   - decorations - 装饰物表
   - item_types - 物品类型表
   - items - 物品表
   - inventory - 背包表
   - friendships - 好友表
   - social_activities - 社交活动表
   - quest_types - 任务类型表
   - user_quests - 用户任务表
   - achievement_types - 成就类型表
   - user_achievements - 用户成就表
   - notifications - 通知表
   - seasons - 季节表
   - game_config - 游戏配置表

2. **002_init_game_config.sql** - 初始化游戏配置数据
   - 经济参数（初始金币、经验、点券）
   - 游戏参数（最大等级、初始土地等）
   - 作物等级解锁参数
   - 动物等级解锁参数
   - 任务参数
   - 升级参数
   - 季节参数
   - 社交参数

3. **003_init_crop_types.sql** - 初始化作物类型数据
   - 基础作物（等级1-20）
   - 季节性作物（春、夏、秋、冬）

4. **004_init_animal_types.sql** - 初始化动物类型数据
   - 基础动物（等级1-20）
   - 不同类型的动物（鸡、牛、羊等）

5. **005_init_decoration_types.sql** - 初始化装饰物类型数据
   - 建筑类（小木屋、水井等）
   - 植物类（树木、花草）
   - 雕像类（石像、铜像等）
   - 家具类（长椅、秋千等）

6. **006_init_item_types.sql** - 初始化物品类型数据
   - 种子类（各种作物种子）
   - 化肥类（普通、高级、超级）
   - 加速剂类（生长、产出）
   - 饲料类（谷物、胡萝卜等）
   - 工具类（锄头、水桶等）
   - 特殊类（神秘种子、祝福光环等）
   - 作物产品类（收获的作物）
   - 动物产品类（动物产出的产品）

7. **007_init_seasons.sql** - 初始化季节数据
   - 春季（3-5月）
   - 夏季（6-8月）
   - 秋季（9-11月）
   - 冬季（12-2月）

8. **008_init_quest_types.sql** - 初始化任务类型数据
   - 每日任务（收获、种植、帮助、访问）
   - 每周任务（更高要求的收获、种植、帮助）
   - 成就任务（等级、收获、种植、养殖等）

9. **009_init_achievement_types.sql** - 初始化成就类型数据
   - 等级成就（农场新手到传奇）
   - 收获成就（收获达人到王者）
   - 种植成就（种植小能手到专家）
   - 养殖成就（养殖小能手到专家）
   - 财富成就（小有财富到千万富翁）
   - 社交成就（社交新手到人气之王）

## 使用方法

### 自动初始化

使用提供的初始化脚本：

```bash
cd backend
./database/init.sh
```

### 手动初始化

如果需要手动执行迁移：

```bash
# 连接到MySQL
mysql -u root -p

# 创建数据库并导入Schema
mysql -u root -p < database/migrations/001_create_schema.sql

# 导入初始化数据
mysql -u root -p qq_farm_game < database/migrations/002_init_game_config.sql
mysql -u root -p qq_farm_game < database/migrations/003_init_crop_types.sql
mysql -u root -p qq_farm_game < database/migrations/004_init_animal_types.sql
mysql -u root -p qq_farm_game < database/migrations/005_init_decoration_types.sql
mysql -u root -p qq_farm_game < database/migrations/006_init_item_types.sql
mysql -u root -p qq_farm_game < database/migrations/007_init_seasons.sql
mysql -u root -p qq_farm_game < database/migrations/008_init_quest_types.sql
mysql -u root -p qq_farm_game < database/migrations/009_init_achievement_types.sql
```

### 环境配置

确保`.env`文件中配置了正确的数据库连接信息：

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=qq_farm_game
```

## 验证初始化

初始化完成后，可以验证数据是否正确导入：

```bash
mysql -u root -p qq_farm_game -e "SHOW TABLES;"
```

应该看到以下表：

- users
- farms
- plots
- crop_types
- crops
- animal_types
- animal_pens
- animals
- decoration_types
- decorations
- item_types
- items
- inventory
- friendships
- social_activities
- quest_types
- user_quests
- achievement_types
- user_achievements
- notifications
- seasons
- game_config

验证初始数据：

```bash
# 检查作物类型数量
mysql -u root -p qq_farm_game -e "SELECT COUNT(*) as count FROM crop_types;"

# 检查动物类型数量
mysql -u root -p qq_farm_game -e "SELECT COUNT(*) as count FROM animal_types;"

# 检查游戏配置数量
mysql -u root -p qq_farm_game -e "SELECT COUNT(*) as count FROM game_config;"
```

## 注意事项

1. **数据库字符集**：所有表使用utf8mb4字符集，支持emoji等特殊字符
2. **外键约束**：相关表之间设置了外键约束，确保数据一致性
3. **索引优化**：为常用查询字段创建了索引，提高查询性能
4. **时间戳**：使用TIMESTAMP字段记录创建和更新时间
5. **软删除**：用户表使用is_active字段实现软删除
6. **数据完整性**：使用NOT NULL、UNIQUE等约束保证数据完整性

## 迁移管理

如需添加新的迁移脚本：

1. 创建新的迁移文件（如010_new_feature.sql）
2. 在init.sh中添加文件到MIGRATION_FILES数组
3. 更新本README文档

## 备份与恢复

### 备份数据库

```bash
mysqldump -u root -p qq_farm_game > backup.sql
```

### 恢复数据库

```bash
mysql -u root -p qq_farm_game < backup.sql
```

## 故障排除

### 连接失败

检查MySQL服务是否运行：

```bash
sudo systemctl status mysql
```

### 权限错误

确保MySQL用户有足够的权限：

```sql
GRANT ALL PRIVILEGES ON qq_farm_game.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
```

### 字符集问题

确保MySQL配置使用utf8mb4：

```sql
ALTER DATABASE qq_farm_game CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```