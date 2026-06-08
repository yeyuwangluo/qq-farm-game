/**
 * 农场主视图组件
 */

import React, { useState, useEffect } from 'react';
import { Animal, AnimalPen as AnimalPenData } from '../../types/animal.types';
import { getAnimalPens } from '../../services/animalApi';
import AnimalPen from '../animal/AnimalPen';
import CropSelectionModal from './CropSelectionModal';
import './FarmView.css';

interface FarmViewProps {
  userId: number;
  userLevel: number;
  userGold: number;
}

const FarmView: React.FC<FarmViewProps> = ({
  userId,
  userLevel,
  userGold,
}) => {
  const [pens, setPens] = useState<AnimalPenData[]>([]);
  const [allAnimals, setAllAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    loadFarmData();
  }, [refreshTrigger]);

  const loadFarmData = async () => {
    setLoading(true);
    try {
      const pensData = await getAnimalPens();
      setPens(pensData);

      const allAnimalsList: Animal[] = [];
      pensData.forEach((pen) => {
        allAnimalsList.push(...pen.animals);
      });
      setAllAnimals(allAnimalsList);
    } catch (error) {
      console.error('加载农场数据失败:', error);
      alert('加载农场数据失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleBuySuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleAnimalAction = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const hungryAnimals = allAnimals.filter(
    (a) => a.state === 'hungry' || a.state === 'starving'
  );
  const readyAnimals = allAnimals.filter((a) => a.state === 'ready');
  const producingAnimals = allAnimals.filter((a) => a.state === 'producing');

  return (
    <div className="farm-view">
      <div className="farm-header">
        <div className="farm-info">
          <h1>我的农场</h1>
          <div className="farm-stats">
            <div className="stat-item">
              <span className="stat-icon">🐔</span>
              <span className="stat-value">{allAnimals.length}</span>
              <span className="stat-label">动物总数</span>
            </div>

            <div className="stat-item warning">
              <span className="stat-icon">⚠️</span>
              <span className="stat-value">{hungryAnimals.length}</span>
              <span className="stat-label">饥饿动物</span>
            </div>

            <div className="stat-item success">
              <span className="stat-icon">✅</span>
              <span className="stat-value">{readyAnimals.length}</span>
              <span className="stat-label">产品就绪</span>
            </div>

            <div className="stat-item info">
              <span className="stat-icon">🔄</span>
              <span className="stat-value">{producingAnimals.length}</span>
              <span className="stat-label">生产中</span>
            </div>
          </div>
        </div>

        <button className="btn-add-animal" onClick={() => setIsModalOpen(true)}>
          <span className="btn-icon">➕</span>
          购买动物
        </button>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner" />
          <p>加载中...</p>
        </div>
      ) : (
        <div className="farm-content">
          {pens.length === 0 ? (
            <div className="empty-farm">
              <div className="empty-farm-icon">🏚️</div>
              <h2>农场是空的</h2>
              <p>你还没有动物栏，请先升级农场</p>
              <button
                className="btn-primary"
                onClick={() => setIsModalOpen(true)}
              >
                购买动物
              </button>
            </div>
          ) : (
            <>
              {pens.map((pen) => (
                <AnimalPen
                  key={pen.id}
                  animals={pen.animals}
                  onFeed={handleAnimalAction}
                  onCollect={handleAnimalAction}
                />
              ))}
            </>
          )}
        </div>
      )}

      <CropSelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onBuySuccess={handleBuySuccess}
        userLevel={userLevel}
        userGold={userGold}
      />
    </div>
  );
};

export default FarmView;