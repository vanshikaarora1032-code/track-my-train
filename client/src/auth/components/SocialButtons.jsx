const SocialButtons = () => {
  return (
    <div className="flex gap-4">
      <button className="social-button">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        <span className="text-sm font-medium text-white">Google</span>
      </button>
      <button className="social-button">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.05 20.28c-.96.95-2.22 1.6-3.76 1.7-1.54.1-2.9-.3-4.14-.95-1.24-.65-2.3-1.4-3.54-1.4-1.24 0-2.3.75-3.54 1.4-1.24.65-2.6 1.05-4.14.95-1.54-.1-2.8-.75-3.76-1.7-1.8-1.8-1.8-5.3 0-7.1 1.8-1.8 5.3-1.8 7.1 0 .9.9 1.6 2.1 1.6 3.5 0-1.4.7-2.6 1.6-3.5 1.8-1.8 5.3-1.8 7.1 0 1.8 1.8 1.8 5.3 0 7.1z"/>
          <path d="M12.062 12.996c-.77-.82-1.21-1.92-1.21-3.08s.44-2.26 1.21-3.08c1.55-1.65 4.31-.83 4.31-3.08 0-1.26-.89-2.26-2.15-2.26s-2.15 1-2.15 2.26" />
        </svg>
        <span className="text-sm font-medium text-white">Apple</span>
      </button>
    </div>
  );
};

export default SocialButtons;
