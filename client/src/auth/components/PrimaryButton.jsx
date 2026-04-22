import { Wand2 } from 'lucide-react';

const PrimaryButton = ({ children, onClick, loading, type = 'button' }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading}
      className={`primary-button relative overflow-hidden ${loading ? 'opacity-80 cursor-not-allowed' : ''}`}
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-bg-primary border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          <Wand2 size={18} />
          <span>{children}</span>
        </>
      )}
    </button>
  );
};

export default PrimaryButton;
