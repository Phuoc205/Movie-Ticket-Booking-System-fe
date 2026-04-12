import React, { useState } from 'react';
import './css/Register.css';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !fullName) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post('/auth/register', { 
        email, 
        password, 
        full_name: fullName 
      });
      
      if (response.status === 200 || response.status === 201) {
        toast.success('Đăng ký thành công! Vui lòng đăng nhập.');
        navigate('/login');
      }
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.message || 'Email đã tồn tại hoặc thông tin không hợp lệ');
      } else {
        toast.error('Đã xảy ra lỗi trong quá trình đăng ký');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="card-container w-full max-w-md">
        <h2 className="text-3xl font-bold text-white text-center mb-8">Đăng Ký Tài Khoản</h2>
        <form onSubmit={handleRegister} className="space-y-5" autoComplete="off">
          <div>
            <label className="input-label">Họ Tên</label>
            <input
              type="text"
              className="input-field"
              placeholder="Nhập họ và tên"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={isLoading}
              autoComplete="off"
              required
            />
          </div>
          <div>
            <label className="input-label">Email</label>
            <input
              type="email"
              className="input-field"
              placeholder="Nhập email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              autoComplete="off"
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
              autoComplete="new-password"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full mt-4"
          >
            {isLoading ? (
              <div className="spinner-small"></div>
            ) : (
              'Đăng Ký'
            )}
          </button>
        </form>
        <p className="mt-6 text-center text-gray-400">
          Đã có tài khoản?{' '}
          <Link to="/login" className="text-blue-500 hover:text-blue-400 font-medium transition-colors">
            Đăng nhập ngay
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
