/**
 * 首页组件（农场主页）
 */
import { useAuth } from '../contexts/AuthContext';

export default function HomePage() {
  const { user, logout } = useAuth();

  return (
    <div className="home-page">
      <div className="home-header">
        <h1>欢迎来到QQ农场</h1>
        <p>用户：{user?.username}</p>
        <p>等级：{user?.level}</p>
        <p>金币：{user?.gold}</p>
      </div>
      <div className="home-content">
        <p>农场主页（待实现）</p>
        <button onClick={logout}>退出登录</button>
      </div>
    </div>
  );
}