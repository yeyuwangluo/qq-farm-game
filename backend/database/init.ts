/**
 * 数据库初始化脚本
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { query } from '../src/config/mysql.js';
import { closeDatabase } from '../src/config/mysql.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigration(fileName: string): Promise<void> {
  const filePath = path.join(__dirname, 'migrations', fileName);
  
  if (!fs.existsSync(filePath)) {
    throw new Error(`迁移文件不存在: ${filePath}`);
  }

  const sql = fs.readFileSync(filePath, 'utf-8');
  const statements = sql
    .split(';')
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && !s.startsWith('--'));

  for (const statement of statements) {
    try {
      await query(statement);
      console.log(`✓ 执行成功: ${fileName}`);
    } catch (error: any) {
      console.error(`✗ 执行失败: ${fileName}`);
      console.error(`错误: ${error.message}`);
      throw error;
    }
  }
}

async function initializeDatabase(): Promise<void> {
  console.log('开始初始化数据库...\n');

  const migrations = [
    '001_create_schema.sql',
    '002_init_game_config.sql',
    '003_init_crop_types.sql',
    '004_init_animal_types.sql',
    '005_init_decoration_types.sql',
    '006_init_item_types.sql',
    '007_init_seasons.sql',
    '008_init_quest_types.sql',
    '009_init_achievement_types.sql',
  ];

  for (const migration of migrations) {
    try {
      await runMigration(migration);
    } catch (error) {
      console.error('\n数据库初始化失败！');
      await closeDatabase();
      process.exit(1);
    }
  }

  console.log('\n数据库初始化完成！');
  
  // 验证数据
  console.log('\n验证数据...');
  const cropCount = await query('SELECT COUNT(*) as count FROM crop_types');
  console.log(`作物类型数量: ${cropCount[0].count}`);

  const animalCount = await query('SELECT COUNT(*) as count FROM animal_types');
  console.log(`动物类型数量: ${animalCount[0].count}`);

  const itemCount = await query('SELECT COUNT(*) as count FROM item_types');
  console.log(`物品类型数量: ${itemCount[0].count}`);

  const configCount = await query('SELECT COUNT(*) as count FROM game_config');
  console.log(`游戏配置数量: ${configCount[0].count}`);

  await closeDatabase();
  process.exit(0);
}

initializeDatabase().catch((error) => {
  console.error('初始化过程出错:', error);
  process.exit(1);
});