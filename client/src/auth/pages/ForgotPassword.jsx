import { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthCard from '../components/AuthCard';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import { useAuth } from '../../hooks/useAuth';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { forgotPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Email address is required');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Invalid email address');
      return;
    }

    setError('');
    setLoading(true);
    try {
      await forgotPassword(email);
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard 
      title="Forgot Password?" 
      subtitle="Enter your email and we'll send a 5-digit verification code instantly."
    >
      {!success ? (
        <form onSubmit={handleSubmit}>
          <InputField
            label="Email address"
            placeholder="example@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={error}
            required
          />

          <div className="mt-8">
            <PrimaryButton type="submit" loading={loading}>
              Send Code
            </PrimaryButton>
          </div>

          <div className="text-center mt-8">
            <p className="text-sm text-text-muted">
              Already have an account?{' '}
              <Link to="/login" className="text-white font-bold hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </form>
      ) : (
        <div className="text-center py-6">
          <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
             <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-bg-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
             </div>
          </div>
          <h2 className="text-white font-bold mb-2">Check your email</h2>
          <p className="text-text-muted text-sm mb-6">
            We've sent a password reset link to <span className="text-white">{email}</span>.
          </p>
          <Link to="/login">
            <PrimaryButton>Back to Sign In</PrimaryButton>
          </Link>
        </div>
      )}
    </AuthCard>
  );
};

export default ForgotPassword;
