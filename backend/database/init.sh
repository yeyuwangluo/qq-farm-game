#!/bin/bash

# 数据库初始化脚本

DB_HOST="localhost"
DB_PORT="3306"
DB_USER="root"
DB_PASSWORD=""
DB_NAME="qq_farm_game"

# 颜色输出
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}开始初始化数据库...${NC}"

# 检查MySQL连接
echo -e "${YELLOW}检查MySQL连接...${NC}"
mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -e "SELECT 1" > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo -e "${GREEN}MySQL连接成功${NC}"
else
    echo -e "${RED}MySQL连接失败，请检查连接配置${NC}"
    exit 1
fi

# 运行迁移脚本
MIGRATIONS_DIR="database/migrations"
MIGRATION_FILES=(
  "001_create_schema.sql"
  "002_init_game_config.sql"
  "003_init_crop_types.sql"
  "004_init_animal_types.sql"
  "005_init_decoration_types.sql"
  "006_init_item_types.sql"
  "007_init_seasons.sql"
  "008_init_quest_types.sql"
  "009_init_achievement_types.sql"
)

for migration_file in "${MIGRATION_FILES[@]}"; do
  migration_path="$MIGRATIONS_DIR/$migration_file"
  if [ -f "$migration_path" ]; then
    echo -e "${YELLOW}执行迁移: $migration_file${NC}"
    mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" "$DB_NAME" < "$migration_path" 2>&1
    if [ $? -eq 0 ]; then
      echo -e "${GREEN}迁移成功: $migration_file${NC}"
    else
      echo -e "${RED}迁移失败: $migration_file${NC}"
      exit 1
    fi
  else
    echo -e "${RED}迁移文件不存在: $migration_path${NC}"
    exit 1
  fi
done

echo -e "${GREEN}数据库初始化完成！${NC}"