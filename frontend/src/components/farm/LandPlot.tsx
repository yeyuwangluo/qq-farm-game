/**
 * 土地组件
 */

import React from 'react';
import { PlotState } from '../../types/plot.types';
import './LandPlot.css';

interface LandPlotProps {
  id: number;
  index: number;
  state: PlotState;
  cropName?: string | null;
  cropIcon?: string | null;
  growthProgress?: number;
  plantedAt?: string | null;
  harvestAt?: string | null;
  isReady?: boolean;
  isWithered?: boolean;
  remainingTime?: number | null;
  level: number;
  onPlant?: () => void;
  onHarvest?: () => void;
  onUpgrade?: () => void;
  onClear?: () => void;
}

const LandPlot: React.FC<LandPlotProps> = ({
  id,
  index,
  state,
  cropName,
  cropIcon,
  growthProgress = 0,
  plantedAt,
  harvestAt,
  isReady = false,
  isWithered = false,
  remainingTime,
  level,
  onPlant,
  onHarvest,
  onUpgrade,
  onClear,
}) => {
  const getStateText = (plotState: PlotState): string => {
    switch (plotState) {
      case PlotState.EMPTY:
        return '空闲';
      case PlotState.SEED:
      case PlotState.GROWING:
        return '生长中';
      case PlotState.READY:
        return '成熟';
      case PlotState.WITHERED:
        return '枯萎';
      default:
        return '未知';
    }
  };

  const getStateColor = (plotState: PlotState): string => {
    switch (plotState) {
      case PlotState.EMPTY:
        return '#8bc34a';
      case PlotState.SEED:
      case PlotState.GROWING:
        return '#4caf50';
      case PlotState.READY:
        return '#ff9800';
      case PlotState.WITHERED:
        return '#795548';
      default:
        return '#9e9e9e';
    }
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}分${secs}秒`;
  };

  const getLevelIcon = (lvl: number): string => {
    if (lvl <= 5) return '⭐';
    if (lvl <= 10) return '⭐⭐';
    if (lvl <= 15) return '⭐⭐⭐';
    return '👑';
  };

  return (
    <div
      className={`land-plot plot-state-${state} ${isReady ? 'ready' : ''} ${isWithered ? 'withered' : ''}`}
      onClick={() => {
        if (state === PlotState.EMPTY && onPlant) {
          onPlant();
        } else if (isReady && onHarvest) {
          onHarvest();
        } else if (isWithered && onClear) {
          onClear();
        }
      }}
    >
      <div className="plot-header">
        <span className="plot-index">土地 {index + 1}</span>
        <span className="plot-level" title={`等级 ${level}`}>
          {getLevelIcon(level)} Lv.{level}
        </span>
      </div>

      {state === PlotState.EMPTY && (
        <div className="plot-content empty">
          <div className="empty-icon">🌱</div>
          <p className="empty-text">点击种植</p>
        </div>
      )}

      {(state === PlotState.SEED || state === PlotState.GROWING) && (
        <div className="plot-content growing">
          {cropIcon ? (
            <img src={cropIcon} alt={cropName || ''} className="crop-icon" />
          ) : (
            <div className="crop-placeholder">🌾</div>
          )}
          <p className="crop-name">{cropName || '未知作物'}</p>

          <div className="growth-progress">
            <div className="progress-label">生长进度</div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${growthProgress}%`,
                  backgroundColor: getStateColor(state),
                }}
              />
            </div>
            <span className="progress-text">{growthProgress}%</span>
          </div>

          {remainingTime !== null && remainingTime > 0 && (
            <div className="time-remaining">
              <span className="time-icon">⏱️</span>
              <span className="time-text">{formatTime(remainingTime)}</span>
            </div>
          )}
        </div>
      )}

      {isReady && (
        <div className="plot-content ready">
          {cropIcon ? (
            <img src={cropIcon} alt={cropName || ''} className="crop-icon ready-icon" />
          ) : (
            <div className="crop-placeholder ready-icon">🌾</div>
          )}
          <p className="crop-name">{cropName || '未知作物'}</p>

          <div className="ready-badge">
            <span className="ready-icon">✨</span>
            <span className="ready-text">可以收获</span>
          </div>

          <button className="btn-harvest" onClick={(e) => { e.stopPropagation(); onHarvest?.(); }}>
            收获
          </button>
        </div>
      )}

      {isWithered && (
        <div className="plot-content withered">
          <div className="withered-icon">🥀</div>
          <p className="withered-text">作物已枯萎</p>
          <button className="btn-clear" onClick={(e) => { e.stopPropagation(); onClear?.(); }}>
            清理
          </button>
        </div>
      )}

      <div className="plot-footer">
        <span
          className="plot-state-badge"
          style={{ backgroundColor: getStateColor(state) }}
        >
          {getStateText(state)}
        </span>

        {state === PlotState.EMPTY && onUpgrade && (
          <button
            className="btn-upgrade"
            onClick={(e) => { e.stopPropagation(); onUpgrade(); }}
            title="升级土地"
          >
            ⬆️
          </button>
        )}
      </div>
    </div>
  );
};

export default LandPlot;