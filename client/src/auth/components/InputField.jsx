import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const InputField = ({ label, type = 'text', placeholder, value, onChange, error, required }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';

  return (
    <div className="mb-4">
      {label && (
        <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 ml-1">
          {label}{required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          type={isPassword ? (showPassword ? 'text' : 'password') : type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`input-field w-full pr-12 ${error ? 'border-red-500' : ''}`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-white transition-colors"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && <p className="text-red-500 text-[11px] mt-1 ml-1">{error}</p>}
    </div>
  );
};

export default InputField;
