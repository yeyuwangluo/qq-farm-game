/**
 * 作物选择弹窗组件
 */

import React, { useState, useEffect } from 'react';
import { AnimalType } from '../../types/animal.types';
import { getAvailableAnimalTypes, buyAnimal } from '../../services/animalApi';
import './CropSelectionModal.css';

interface CropSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBuySuccess?: () => void;
  userLevel: number;
  userGold: number;
}

const CropSelectionModal: React.FC<CropSelectionModalProps> = ({
  isOpen,
  onClose,
  onBuySuccess,
  userLevel,
  userGold,
}) => {
  const [animalTypes, setAnimalTypes] = useState<AnimalType[]>([]);
  const [loading, setLoading] = useState(false);
  const [buyingId, setBuyingId] = useState<number | null>(null);
  const [nameInput, setNameInput] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      loadAnimalTypes();
    }
  }, [isOpen]);

  const loadAnimalTypes = async () => {
    try {
      const data = await getAvailableAnimalTypes();
      setAnimalTypes(data);
    } catch (error) {
      console.error('加载动物类型失败:', error);
      alert('加载动物类型失败，请重试');
    }
  };

  const handleBuy = async (animalType: AnimalType) => {
    if (buyingId !== null) return;

    if (userGold < animalType.purchase_price) {
      alert('金币不足');
      return;
    }

    setBuyingId(animalType.id);

    try {
      await buyAnimal({
        animal_type_id: animalType.id,
        name: nameInput || undefined,
      });

      alert(`成功购买 ${animalType.name}！`);

      if (onBuySuccess) {
        onBuySuccess();
      }

      onClose();
      setNameInput('');
    } catch (error: any) {
      console.error('购买失败:', error);
      alert(error.message || '购买失败，请重试');
    } finally {
      setBuyingId(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>选择动物</h2>
          <button className="btn-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          <div className="animal-types-grid">
            {animalTypes.map((animalType) => (
              <div
                key={animalType.id}
                className={`animal-type-card ${
                  !animalType.can_buy ? 'disabled' : ''
                }`}
              >
                <div className="animal-type-image">
                  {animalType.image_url ? (
                    <img src={animalType.image_url} alt={animalType.name} />
                  ) : (
                    <div className="animal-type-placeholder">
                      {animalType.name.charAt(0)}
                    </div>
                  )}
                </div>

                <div className="animal-type-info">
                  <h3 className="animal-type-name">{animalType.name}</h3>
                  <p className="animal-type-description">
                    {animalType.description}
                  </p>

                  <div className="animal-type-stats">
                    <div className="stat-row">
                      <span className="stat-label">价格:</span>
                      <span className="stat-value gold">
                        {animalType.purchase_price} 金币
                      </span>
                    </div>

                    <div className="stat-row">
                      <span className="stat-label">产出:</span>
                      <span className="stat-value">
                        {animalType.product_name}
                      </span>
                    </div>

                    <div className="stat-row">
                      <span className="stat-label">产出时间:</span>
                      <span className="stat-value">
                        {animalType.product_time} 分钟
                      </span>
                    </div>

                    <div className="stat-row">
                      <span className="stat-label">产量:</span>
                      <span className="stat-value">
                        {animalType.product_yield}
                      </span>
                    </div>

                    <div className="stat-row">
                      <span className="stat-label">等级要求:</span>
                      <span
                        className={`stat-value ${
                          userLevel >= animalType.level_requirement
                            ? 'valid'
                            : 'invalid'
                        }`}
                      >
                        Lv.{animalType.level_requirement}
                      </span>
                    </div>
                  </div>

                  {userLevel >= animalType.level_requirement && (
                    <input
                      type="text"
                      className="animal-name-input"
                      placeholder="给动物起个名字（可选）"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      maxLength={50}
                    />
                  )}

                  <button
                    className={`btn-buy ${
                      !animalType.can_buy ||
                      userGold < animalType.purchase_price
                        ? 'disabled'
                        : ''
                    }`}
                    onClick={() => handleBuy(animalType)}
                    disabled={
                      !animalType.can_buy ||
                      userGold < animalType.purchase_price ||
                      buyingId === animalType.id
                    }
                  >
                    {buyingId === animalType.id
                      ? '购买中...'
                      : userGold < animalType.purchase_price
                      ? '金币不足'
                      : '购买'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {animalTypes.length === 0 && (
            <div className="empty-state">
              <p>没有可购买的动物</p>
              <p className="empty-hint">提升等级以解锁更多动物</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CropSelectionModal;