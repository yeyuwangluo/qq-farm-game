-- 添加通知时间字段
USE qq_farm_game;

-- 为plots表添加notified_at字段
ALTER TABLE plots ADD COLUMN notified_at TIMESTAMP NULL AFTER updated_at;

-- 为animals表添加notified_at字段
ALTER TABLE animals ADD COLUMN notified_at TIMESTAMP NULL AFTER updated_at;

-- 添加索引以优化查询
CREATE INDEX idx_plots_notified_at ON plots(notified_at);
CREATE INDEX idx_animals_notified_at ON animals(notified_at);