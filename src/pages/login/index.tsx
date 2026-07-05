import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/core/store/auth.store';
import httpClient from '@/infrastructure/http/client';
import { ROUTES } from '@/core/constants';

export const LoginPage = () => {
  const navigate = useNavigate();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:8085/oauth2/authorization/google';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      if (isLoginMode) {
        // Login Flow
        const response = await httpClient.post<{ accessToken: string }>(
          '/auth-service/api/v1/auth/login',
          { email, password }
        );

        if (response.status === 200 && response.data.accessToken) {
          const { accessToken } = response.data;
          setAccessToken(accessToken);
          httpClient.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
          navigate(ROUTES.WORKSPACE_LIST, { replace: true });
        } else {
          setErrorMsg('Invalid login response');
        }
      } else {
        // Register Flow
        const response = await httpClient.post<{ message: string }>(
          '/auth-service/api/v1/auth/register',
          { email, fullName, password }
        );

        if (response.status === 200) {
          setSuccessMsg('Registration successful! You can now sign in.');
          setIsLoginMode(true);
          setPassword('');
        }
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLoginMode(!isLoginMode);
    setErrorMsg('');
    setSuccessMsg('');
    setPassword('');
  };

  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen bg-surface">
      {/* Left Side: Auth Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 relative z-10 bg-surface">
        <div className="w-full max-w-md space-y-8">
          {/* Branding */}
          <div className="flex items-center gap-2 mb-12">
            <span className="material-symbols-outlined text-primary font-variation-settings: 'FILL' 1; text-3xl">workflow</span>
            <span className="font-headline-md text-headline-md text-on-surface">JAT</span>
          </div>

          {/* Header */}
          <div className="space-y-2">
            <h1 className="font-headline-lg text-headline-lg md:font-display md:text-display text-on-surface">
              {isLoginMode ? 'Welcome Back' : 'Create an Account'}
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              {isLoginMode 
                ? 'Enter your details to access your automation dashboard.' 
                : 'Sign up to start automating your Jira tests today.'}
            </p>
          </div>

          {/* Messages */}
          {errorMsg && (
            <div className="p-3 bg-error-container text-on-error-container rounded-lg text-sm">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="p-3 bg-tertiary-container text-on-tertiary-container rounded-lg text-sm">
              {successMsg}
            </div>
          )}

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {!isLoginMode && (
              <div className="space-y-2">
                <label className="font-label-md text-label-md text-on-surface" htmlFor="fullName">Full Name</label>
                <input 
                  className="w-full bg-surface-container-highest border border-outline-variant rounded-lg px-4 py-2 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm placeholder:text-on-surface-variant/50" 
                  id="fullName" 
                  placeholder="John Doe" 
                  type="text" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required 
                />
              </div>
            )}
            <div className="space-y-2">
              <label className="font-label-md text-label-md text-on-surface" htmlFor="email">Email Address</label>
              <input 
                className="w-full bg-surface-container-highest border border-outline-variant rounded-lg px-4 py-2 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm placeholder:text-on-surface-variant/50" 
                id="email" 
                placeholder="name@company.com" 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="font-label-md text-label-md text-on-surface" htmlFor="password">Password</label>
              <div className="relative">
                <input 
                  className="w-full bg-surface-container-highest border border-outline-variant rounded-lg px-4 py-2 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm placeholder:text-on-surface-variant/50" 
                  id="password" 
                  placeholder="••••••••" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {isLoginMode && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input className="w-4 h-4 rounded bg-surface-container-highest border-outline-variant text-primary focus:ring-primary focus:ring-offset-surface" id="remember" type="checkbox" />
                  <label className="ml-2 font-label-md text-label-md text-on-surface-variant" htmlFor="remember">Remember me</label>
                </div>
                <a className="font-label-md text-label-md text-primary hover:text-primary-fixed-dim transition-colors" href="#">Forgot Password?</a>
              </div>
            )}

            <button 
              className="cursor-pointer w-full bg-gradient-to-r from-primary to-inverse-primary hover:from-primary-fixed-dim hover:to-primary text-on-primary font-title-lg text-title-lg py-2 rounded-lg transition-all shadow-md hover:shadow-lg hover:-translate-y-px flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed" 
              type="submit"
              disabled={loading}
            >
              {loading ? 'Processing...' : (isLoginMode ? 'Sign In' : 'Sign Up')}
              {!loading && <span className="material-symbols-outlined text-base">arrow_forward</span>}
            </button>
          </form>

          {/* Social Login */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-outline-variant"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-surface font-label-md text-label-md text-on-surface-variant">Or continue with</span>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-2 px-4 py-2 bg-surface-container-highest border border-outline-variant rounded-lg font-label-md text-label-md text-on-surface hover:bg-surface-container-high hover:border-primary/50 transition-colors shadow-sm cursor-not-allowed opacity-50" title="Coming soon">
                <svg aria-hidden="true" className="w-5 h-5 text-on-surface" fill="currentColor" viewBox="0 0 24 24">
                  <path clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" fillRule="evenodd"></path>
                </svg>
                GitHub
              </button>
              
              <button onClick={handleGoogleLogin} type="button" className="cursor-pointer flex items-center justify-center gap-2 px-4 py-2 bg-surface-container-highest border border-outline-variant rounded-lg font-label-md text-label-md text-on-surface hover:bg-surface-container-high hover:border-primary/50 transition-colors shadow-sm">
                <svg aria-hidden="true" className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                </svg>
                Google
              </button>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center font-label-md text-label-md text-on-surface-variant mt-8">
            {isLoginMode ? "Don't have an account? " : "Already have an account? "}
            <a 
              className="text-primary hover:text-primary-fixed-dim transition-colors ml-1 cursor-pointer" 
              onClick={toggleMode}
            >
              {isLoginMode ? 'Sign Up' : 'Sign In'}
            </a>
          </p>
        </div>
      </div>

      {/* Right Side: Visual */}
      <div className="hidden md:flex md:w-1/2 relative overflow-hidden bg-surface-container-lowest items-center justify-center border-l border-outline-variant/30">
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center opacity-80 mix-blend-screen" 
          style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAoVjl6c1vsDPjiCcVycuy9VjJ-ObU0cvEu_t3TE-4H4jjnzfGJMcoIKOs30noQGXB1t_cOE92SOYRTD-c_xbxbYIEpjozGcC4sry4OhVw0H3t-ZGTF29eunvKR4nrZJMTFbqUNrZ8yDR2yiVmQExRYe_XPLRqYCZWJsV_6TNYN8h0vFT8OyNL2p1GtdPlmOCRzhduPqRJRG2BZyNtziUhjdVTr3avKP-CgkqKFL8BL3zCU95HbxvT2jI1thCEKBjArB6PbxKFXwSs')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-surface/80 via-surface/60 to-surface-container-lowest/90 backdrop-blur-[2px]"></div>
        
        <div className="relative z-10 text-center px-12 max-w-lg">
          <h2 className="font-display text-display text-on-surface tracking-tight leading-tight drop-shadow-2xl">
            Connecting <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Automation</span> <br />
            to Quality
          </h2>
          <div className="mt-6 w-24 h-1 bg-gradient-to-r from-primary to-transparent mx-auto rounded-full"></div>
        </div>
        
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute top-0 left-0 w-64 h-64 bg-secondary/10 rounded-full blur-[80px] pointer-events-none"></div>
      </div>
    </div>
  );
};

export default LoginPage;
