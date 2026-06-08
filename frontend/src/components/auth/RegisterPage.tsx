/**
 * 注册页面组件
 */
import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRegister } from '../../hooks/auth/useAuth';
import './RegisterPage.css';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { registerUser, error, clearError } = useRegister();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();

    if (!username.trim()) {
      alert('请输入用户名');
      return;
    }

    if (!email.trim()) {
      alert('请输入邮箱');
      return;
    }

    if (!password.trim()) {
      alert('请输入密码');
      return;
    }

    if (!confirmPassword.trim()) {
      alert('请确认密码');
      return;
    }

    if (password !== confirmPassword) {
      alert('两次输入的密码不一致');
      return;
    }

    if (username.length < 3 || username.length > 20) {
      alert('用户名长度必须在3-20个字符之间');
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      alert('用户名只能包含字母、数字和下划线');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert('邮箱格式不正确');
      return;
    }

    if (password.length < 6) {
      alert('密码长度至少6个字符');
      return;
    }

    setIsLoading(true);
    try {
      const success = await registerUser(username.trim(), email.trim(), password);
      if (success) {
        navigate('/');
      }
    } catch (error) {
      console.error('Register error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-header">
          <h1>QQ农场</h1>
          <p>创建账号，开始农场之旅</p>
        </div>

        <form className="register-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">用户名</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="请输入用户名（3-20个字符）"
              disabled={isLoading}
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">邮箱</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="请输入邮箱地址"
              disabled={isLoading}
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">密码</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入密码（至少6个字符）"
              disabled={isLoading}
              autoComplete="new-password"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">确认密码</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="请再次输入密码"
              disabled={isLoading}
              autoComplete="new-password"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="register-button" disabled={isLoading}>
            {isLoading ? '注册中...' : '注册'}
          </button>
        </form>

        <div className="register-footer">
          <p>
            已有账号？<Link to="/login">立即登录</Link>
          </p>
        </div>
      </div>
    </div>
  );
}