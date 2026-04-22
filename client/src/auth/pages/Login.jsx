import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthCard from '../components/AuthCard';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import SocialButtons from '../components/SocialButtons';
import { useAuth } from '../../hooks/useAuth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    const trimmedEmail = email.trim().toLowerCase();
    
    if (!trimmedEmail) newErrors.email = 'Email address is required';
    else if (trimmedEmail !== 'guest' && trimmedEmail !== 'admin' && !/\S+@\S+\.\S+/.test(trimmedEmail)) {
      newErrors.email = 'Invalid email address';
    }
    
    if (!password && trimmedEmail !== 'guest' && trimmedEmail !== 'admin') {
      newErrors.password = 'Password is required';
    } else if (password && password.length < 8 && trimmedEmail !== 'guest' && trimmedEmail !== 'admin') {
      newErrors.password = 'Password must be at least 8 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await login(email, password);
      // Success toast would go here
      navigate('/');
    } catch (err) {
      setErrors({ form: err.message || 'Invalid credentials' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard 
      title="Welcome Back!" 
      subtitle="Sign in to access smart, personalized travel plans made for you."
    >
      <form onSubmit={handleSubmit}>
        <InputField
          label="Email address"
          placeholder="example@gmail.com (or type 'guest')"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          required
        />
        <InputField
          label="Password"
          type="password"
          placeholder="@Sn123hsn#"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          required
        />

        <div className="flex justify-between items-center mb-6 px-1">
          <label className="flex items-center gap-2 cursor-pointer group">
            <div className="relative w-4 h-4 border border-border-custom rounded-[4px] flex items-center justify-center group-hover:border-accent transition-colors overflow-hidden">
               <input type="checkbox" className="peer absolute inset-0 opacity-0 cursor-pointer" />
               <div className="w-2.5 h-2.5 bg-accent rounded-[2px] opacity-0 peer-checked:opacity-100 transition-opacity" />
            </div>
            <span className="text-xs text-text-muted group-hover:text-text-primary transition-colors">Remember me</span>
          </label>
          <Link to="/forgot-password" size={12} className="text-xs text-accent hover:underline">
            Forgot Password?
          </Link>
        </div>

        {errors.form && <p className="text-red-500 text-xs text-center mb-4">{errors.form}</p>}

        <PrimaryButton type="submit" loading={loading}>
          Sign in
        </PrimaryButton>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border-custom opacity-50"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-bg-card px-4 text-text-muted">Or continue with</span>
          </div>
        </div>

        <SocialButtons />

        <div className="text-center mt-8">
          <p className="text-sm text-text-muted">
            Don't have an account?{' '}
            <Link to="/register" className="text-white font-bold hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </form>
    </AuthCard>
  );
};

export default Login;
