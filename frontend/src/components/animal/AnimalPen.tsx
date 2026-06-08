/**
 * 动物栏组件
 */

import React, { useState, useEffect } from 'react';
import { Animal, AnimalState } from '../../types/animal.types';
import { feedAnimal, collectProduct } from '../../services/animalApi';
import './AnimalPen.css';

interface AnimalPenProps {
  animals: Animal[];
  onFeed?: (animal: Animal) => void;
  onCollect?: (animal: Animal) => void;
}

const AnimalCard: React.FC<{
  animal: Animal;
  onFeed?: () => void;
  onCollect?: () => void;
}> = ({ animal, onFeed, onCollect }) => {
  const [loading, setLoading] = useState(false);

  const handleFeed = async () => {
    if (loading || animal.hunger_level >= 100) return;

    setLoading(true);
    try {
      await feedAnimal({ animal_id: animal.id });
      if (onFeed) onFeed();
    } catch (error) {
      console.error('喂养失败:', error);
      alert('喂养失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleCollect = async () => {
    if (loading || !animal.is_ready) return;

    setLoading(true);
    try {
      await collectProduct({ animal_id: animal.id });
      if (onCollect) onCollect();
    } catch (error) {
      console.error('收集失败:', error);
      alert('收集失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const getStateText = (state: AnimalState): string => {
    switch (state) {
      case AnimalState.HUNGRY:
        return '饥饿';
      case AnimalState.PRODUCING:
        return '生产中';
      case AnimalState.READY:
        return '就绪';
      case AnimalState.STARVING:
        return '饥饿中';
      default:
        return '未知';
    }
  };

  const getStateColor = (state: AnimalState): string => {
    switch (state) {
      case AnimalState.HUNGRY:
        return '#ff9800';
      case AnimalState.PRODUCING:
        return '#2196f3';
      case AnimalState.READY:
        return '#4caf50';
      case AnimalState.STARVING:
        return '#f44336';
      default:
        return '#757575';
    }
  };

  return (
    <div className="animal-card">
      <div className="animal-header">
        <h3 className="animal-name">{animal.name || animal.animal_type_name}</h3>
        <span
          className="animal-state"
          style={{ backgroundColor: getStateColor(animal.state) }}
        >
          {getStateText(animal.state)}
        </span>
      </div>

      <div className="animal-info">
        <p className="animal-type">{animal.animal_type_name}</p>
        <p className="animal-description">{animal.animal_type_description}</p>
      </div>

      <div className="animal-stats">
        <div className="stat-item">
          <span className="stat-label">饥饿度</span>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${animal.hunger_level}%`,
                backgroundColor: animal.hunger_level < 30 ? '#f44336' : '#4caf50',
              }}
            />
          </div>
          <span className="stat-value">{animal.hunger_level}%</span>
        </div>

        {animal.state === AnimalState.PRODUCING && (
          <div className="stat-item">
            <span className="stat-label">产出进度</span>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${animal.product_progress}%`,
                  backgroundColor: '#2196f3',
                }}
              />
            </div>
            <span className="stat-value">{animal.product_progress}%</span>
          </div>
        )}

        {animal.state === AnimalState.PRODUCING && animal.remaining_time !== null && (
          <div className="stat-item">
            <span className="stat-label">剩余时间</span>
            <span className="stat-value">
              {Math.floor(animal.remaining_time / 60)}分{animal.remaining_time % 60}秒
            </span>
          </div>
        )}
      </div>

      <div className="animal-actions">
        {animal.state === AnimalState.HUNGRY && animal.hunger_level < 100 && (
          <button
            className="btn-feed"
            onClick={handleFeed}
            disabled={loading || animal.hunger_level >= 100}
          >
            {loading ? '喂养中...' : '喂养'}
          </button>
        )}

        {animal.state === AnimalState.READY && (
          <button
            className="btn-collect"
            onClick={handleCollect}
            disabled={loading || !animal.is_ready}
          >
            {loading ? '收集中...' : '收集产品'}
          </button>
        )}

        {animal.state === AnimalState.STARVING && (
          <button
            className="btn-feed"
            onClick={handleFeed}
            disabled={loading}
          >
            {loading ? '喂养中...' : '喂养'}
          </button>
        )}
      </div>
    </div>
  );
};

const AnimalPen: React.FC<AnimalPenProps> = ({
  animals,
  onFeed,
  onCollect,
}) => {
  if (animals.length === 0) {
    return (
      <div className="animal-pen empty">
        <div className="empty-state">
          <p>动物栏是空的</p>
          <p className="empty-hint">去商店购买动物吧！</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animal-pen">
      <div className="animal-pen-header">
        <h2>动物栏</h2>
        <span className="animal-count">{animals.length} 只动物</span>
      </div>

      <div className="animal-grid">
        {animals.map((animal) => (
          <AnimalCard
            key={animal.id}
            animal={animal}
            onFeed={onFeed}
            onCollect={onCollect}
          />
        ))}
      </div>
    </div>
  );
};

export default AnimalPen;