import React, { useState, useContext } from 'react';
import './css/Login.css';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Vui lòng nhập đầy đủ email và mật khẩu');
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      
      const { user, token: _token  } = response.data;
      // Assuming response structure is { message: "...", user: {id, email, ...}, token: "..." }
      // The user object needs to have role
      
      if (authContext) {
        // If API doesn't return a token top-level but inside, adjust accordingly. 
        // Using response.data.token for now.
        authContext.login(user, response.data.token || response.data.access_token);
        toast.success(response.data.message || 'Đăng nhập thành công');
        
        console.log("authContext:", authContext);
        // Redirect based on role
        if (user.role === 'ADMIN') {
          navigate('/admin');
        } else if (user.role === 'STAFF') {
          navigate('/staff');
        } else {
          navigate('/');
        }
      }
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.message || 'Email hoặc mật khẩu không đúng');
      } else if (error.response && error.response.status === 401) {
        toast.error('Sai thông tin đăng nhập');
      } else {
        toast.error('Đã xảy ra lỗi, vui lòng thử lại sau');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="card-container w-full max-w-md">
        <h2 className="text-3xl font-bold text-white text-center mb-8">Đăng Nhập</h2>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="input-label">Email</label>
            <input
              type="email"
              className="input-field"
              placeholder="Nhập email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
          <div>
            <label className="input-label">Mật khẩu</label>
            <input
              type="password"
              className="input-field"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full"
          >
            {isLoading ? (
              <div className="spinner-small"></div>
            ) : (
              'Đăng Nhập'
            )}
          </button>
        </form>
        <p className="mt-6 text-center text-gray-400">
          Chưa có tài khoản?{' '}
          <Link to="/register" className="text-blue-500 hover:text-blue-400 font-medium transition-colors">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
