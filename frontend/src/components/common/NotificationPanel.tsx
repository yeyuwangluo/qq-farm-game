/**
 * 通知组件
 */

import React, { useState, useEffect } from 'react';
import { useWebSocket } from '../hooks/useWebSocket';
import './NotificationPanel.css';

export interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  data?: any;
  is_read: boolean;
  created_at: string;
}

interface NotificationPanelProps {
  userId: string | number;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ userId }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  useWebSocket({
    userId,
    enabled: true,
    onNotification: (data) => {
      setNotifications((prev) => [data, ...prev].slice(0, 50));
    },
    onCropReady: (data) => {
      const notification: Notification = {
        id: Date.now(),
        type: 'crop_ready',
        title: '作物成熟',
        message: `${data.crop_name} 已经成熟，快去收获吧！`,
        data,
        is_read: false,
        created_at: new Date().toISOString(),
      };
      setNotifications((prev) => [notification, ...prev].slice(0, 50));
    },
    onAnimalProductReady: (data) => {
      const notification: Notification = {
        id: Date.now(),
        type: 'animal_product_ready',
        title: '产品就绪',
        message: `${data.animal_name} 的 ${data.product_name} 已经准备好收集了！`,
        data,
        is_read: false,
        created_at: new Date().toISOString(),
      };
      setNotifications((prev) => [notification, ...prev].slice(0, 50));
    },
    onFriendVisit: (data) => {
      const notification: Notification = {
        id: Date.now(),
        type: 'friend_visit',
        title: '好友来访',
        message: `${data.friend_name} 来访问你的农场了`,
        data,
        is_read: false,
        created_at: new Date().toISOString(),
      };
      setNotifications((prev) => [notification, ...prev].slice(0, 50));
    },
    onCropStolen: (data) => {
      const notification: Notification = {
        id: Date.now(),
        type: 'crop_stolen',
        title: '作物被偷',
        message: `${data.thief_name} 偷走了你的 ${data.crop_name}`,
        data,
        is_read: false,
        created_at: new Date().toISOString(),
      };
      setNotifications((prev) => [notification, ...prev].slice(0, 50));
    },
  });

  const getNotificationIcon = (type: string): string => {
    switch (type) {
      case 'crop_ready':
        return '🌾';
      case 'animal_product_ready':
        return '🥚';
      case 'friend_visit':
        return '👋';
      case 'crop_stolen':
        return '🦊';
      case 'system':
        return '📢';
      case 'quest':
        return '📋';
      case 'achievement':
        return '🏆';
      default:
        return '📌';
    }
  };

  const getNotificationColor = (type: string): string => {
    switch (type) {
      case 'crop_ready':
        return '#4caf50';
      case 'animal_product_ready':
        return '#ff9800';
      case 'friend_visit':
        return '#2196f3';
      case 'crop_stolen':
        return '#f44336';
      case 'system':
        return '#9c27b0';
      case 'quest':
        return '#00bcd4';
      case 'achievement':
        return '#ffeb3b';
      default:
        return '#757575';
    }
  };

  const formatTime = (isoString: string): string => {
    const date = new Date(isoString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 7) return `${days}天前`;
    return date.toLocaleDateString('zh-CN');
  };

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <div className="notification-panel">
      <button
        className="notification-button"
        onClick={() => setIsOpen(!isOpen)}
        title="通知"
      >
        <span className="notification-icon">🔔</span>
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h3>通知</h3>
            <div className="notification-actions">
              {unreadCount > 0 && (
                <button
                  className="btn-mark-read"
                  onClick={markAllAsRead}
                  title="全部标为已读"
                >
                  全部已读
                </button>
              )}
              <button
                className="btn-clear"
                onClick={clearNotifications}
                title="清空通知"
              >
                清空
              </button>
            </div>
          </div>

          <div className="notification-list">
            {notifications.length === 0 ? (
              <div className="empty-notifications">
                <p>暂无通知</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`notification-item ${
                    !notification.is_read ? 'unread' : ''
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div
                    className="notification-item-icon"
                    style={{ backgroundColor: getNotificationColor(notification.type) }}
                  >
                    {getNotificationIcon(notification.type)}
                  </div>

                  <div className="notification-item-content">
                    <div className="notification-item-header">
                      <h4 className="notification-item-title">
                        {notification.title}
                      </h4>
                      <span className="notification-item-time">
                        {formatTime(notification.created_at)}
                      </span>
                    </div>
                    <p className="notification-item-message">
                      {notification.message}
                    </p>
                  </div>

                  {!notification.is_read && (
                    <div className="notification-item-unread-dot" />
                  )}
                </div>
              ))
            )}
          </div>

          <div className="notification-footer">
            <button
              className="btn-close"
              onClick={() => setIsOpen(false)}
            >
              关闭
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;