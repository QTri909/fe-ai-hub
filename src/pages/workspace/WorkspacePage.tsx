import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import httpClient from '@/infrastructure/http/client';
import { ROUTES } from '@/core/constants';
import { useAuthStore } from '@/core/store/auth.store';

export const WorkspacePage = () => {
  const navigate = useNavigate();
  const clearTokens = useAuthStore((state) => state.clearTokens);

  const [workspaceName, setWorkspaceName] = useState('');
  const [jiraSite, setJiraSite] = useState('');
  const [email, setEmail] = useState('');
  const [apiToken, setApiToken] = useState('');
  const [showToken, setShowToken] = useState(false);

  // Auth state
  const [userEmail, setUserEmail] = useState<string>('Loading...');
  const [userId, setUserId] = useState<string>('');

  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const { authApi } = await import('@/features/auth/api/auth.api');
        const user = await authApi.getMe();
        setUserEmail(user.email);
        setUserId(user.id);
      } catch (error) {
        console.error('Failed to fetch user:', error);
        setUserEmail('Guest');
      }
    };
    fetchUser();
  }, []);

  const [isTesting, setIsTesting] = useState(false);
  const [testSuccess, setTestSuccess] = useState<boolean | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const isFormValid = useMemo(() => {
    return workspaceName.trim() !== '' &&
      jiraSite.trim() !== '' &&
      email.trim() !== '' &&
      apiToken.trim() !== '';
  }, [workspaceName, jiraSite, email, apiToken]);

  const handleLogout = () => {
    clearTokens();
    navigate(ROUTES.LOGIN);
  };

  const handleCreateWorkspace = async () => {
    if (!isFormValid || !userId) return;
    setIsTesting(true);
    setErrorMsg('');
    setTestSuccess(null);

    const fullJiraUrl = `https://${jiraSite}.atlassian.net`;

    try {
      const { workspaceApi } = await import('@/features/workspace/api/workspace.api');
      const newWorkspace = await workspaceApi.createWorkspace({
        name: workspaceName,
        description: '',
        jiraUrl: fullJiraUrl,
        email,
        apiToken,
        ownerId: userId
      });

      setTestSuccess(true);
      
      const { useWorkspaceStore } = await import('@/core/store/workspace.store');
      useWorkspaceStore.getState().setActiveWorkspace(newWorkspace);

      // Navigate to dashboard
      setTimeout(() => {
        navigate(ROUTES.DASHBOARD);
      }, 1000);
    } catch (err: any) {
      console.error(err);
      setTestSuccess(false);
      setErrorMsg(err.response?.data?.message || err.message || 'Failed to create workspace or invalid credentials');
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="text-on-surface min-h-screen flex flex-col bg-[#0f172a]">
      {/* TopNavBar */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 py-4 backdrop-blur-md bg-surface/70 border-b border-outline-variant/30">
        <div className="flex items-center gap-4">
          <span className="font-headline-md text-headline-md font-bold text-primary">JAT</span>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <a className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors duration-200" href="#">Documentation</a>
          <a className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors duration-200" href="#">System Status</a>
          <a className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors duration-200" href="#">Security</a>
        </nav>
        <div className="flex items-center gap-4">
          <div className="relative group cursor-pointer">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-label-md ring-2 ring-primary/20 group-hover:ring-primary/50 transition-all">
                ME
              </div>
            </div>
            
            {/* Dropdown Menu */}
            <div className="absolute right-0 top-full mt-2 w-56 bg-surface-container-high border border-outline-variant/50 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden translate-y-2 group-hover:translate-y-0">
              <div className="px-4 py-3 border-b border-outline-variant/30 bg-surface/50">
                <div className="text-sm text-on-surface font-medium truncate">
                  {userEmail}
                </div>
              </div>
              <div 
                className="px-4 py-3 text-sm font-medium text-error hover:bg-error-container/20 transition-colors flex items-center gap-2 cursor-pointer"
                onClick={handleLogout}
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
                Sign out
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow pt-24 pb-12 px-6 md:px-16 flex items-center justify-center mt-12">
        <div className="max-w-[1440px] w-full mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Integration Form */}
          <div className="md:col-span-7 lg:col-span-6">
            <div className="bg-surface-container-low border border-outline-variant/50 rounded-xl p-6 md:p-8 shadow-2xl transition-all duration-300">
              <div className="mb-8">
                <h1 className="font-headline-md text-headline-md md:font-headline-lg md:text-headline-lg text-primary mb-1">Connect Your Jira Site</h1>
                <p className="font-body-md text-body-md text-on-surface-variant">Configure your credentials to sync automation tests with Jira Cloud.</p>
              </div>

              {errorMsg && (
                <div className="mb-6 p-4 bg-error-container text-on-error-container rounded-lg text-sm">
                  {errorMsg}
                </div>
              )}

              {testSuccess && (
                <div className="mb-6 p-4 bg-tertiary-container text-on-tertiary-container rounded-lg text-sm font-medium flex items-center gap-2">
                  <span className="material-symbols-outlined">check_circle</span>
                  Connection verified successfully!
                </div>
              )}

              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                {/* Workspace Name */}
                <div className="space-y-1">
                  <label className="font-label-md text-label-md text-on-surface-variant ml-1">Workspace Name</label>
                  <input 
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-2 text-on-surface placeholder:text-outline focus:outline-none focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all" 
                    placeholder="e.g., First workspace" 
                    type="text"
                    value={workspaceName}
                    onChange={(e) => setWorkspaceName(e.target.value)}
                  />
                </div>

                {/* Jira Site URL */}
                <div className="space-y-1">
                  <label className="font-label-md text-label-md text-on-surface-variant ml-1">Jira Site URL</label>
                  <div className="flex items-stretch border border-outline-variant rounded-lg bg-surface-container-lowest overflow-hidden focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
                    <span className="flex items-center px-4 border-r border-outline-variant text-outline font-code text-code bg-surface-container-low">https://</span>
                    <input 
                      className="flex-grow bg-transparent border-none px-4 py-2 text-on-surface focus:ring-0 placeholder:text-outline font-code text-code" 
                      placeholder="your-site" 
                      type="text"
                      value={jiraSite}
                      onChange={(e) => setJiraSite(e.target.value)}
                    />
                    <span className="flex items-center px-4 bg-surface-variant text-on-surface-variant font-code text-code">.atlassian.net</span>
                  </div>
                </div>

                {/* Email Address */}
                <div className="space-y-1">
                  <label className="font-label-md text-label-md text-on-surface-variant ml-1">Atlassian Email Address</label>
                  <input 
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-2 text-on-surface placeholder:text-outline focus:outline-none focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all" 
                    placeholder="name@company.com" 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                {/* API Token */}
                <div className="space-y-1 relative">
                  <label className="font-label-md text-label-md text-on-surface-variant ml-1">Jira API Token</label>
                  <div className="relative">
                    <input 
                      className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-2 text-on-surface placeholder:text-outline focus:outline-none focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all pr-12" 
                      placeholder="••••••••••••••••" 
                      type={showToken ? "text" : "password"}
                      value={apiToken}
                      onChange={(e) => setApiToken(e.target.value)}
                    />
                    <button 
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-outline-variant hover:text-on-surface transition-colors cursor-pointer flex items-center" 
                      onClick={() => setShowToken(!showToken)}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[20px]">{showToken ? 'visibility_off' : 'visibility'}</span>
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col pt-4">
                  <button 
                    onClick={handleCreateWorkspace}
                    disabled={!isFormValid || isTesting}
                    className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-[#a078ff] to-[#6d3bd7] text-on-primary font-bold font-body-md text-body-md transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:shadow-[0_0_15px_rgba(160,120,255,0.4)] disabled:hover:shadow-none flex items-center justify-center gap-2"
                    type="button"
                  >
                    {isTesting ? (
                      <span className="w-5 h-5 border-2 border-on-primary border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      <span className="material-symbols-outlined text-[20px]">add_circle</span>
                    )}
                    Create Workspace
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: Helper Guide */}
          <div className="md:col-span-5 lg:col-span-6 flex flex-col justify-center">
            <div className="border border-dashed border-outline-variant rounded-xl p-6 md:p-8 space-y-8 bg-surface/30">
              <div>
                <h2 className="font-title-lg text-title-lg text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">help_outline</span>
                  How to get your Jira API Token?
                </h2>
              </div>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <span className="w-6 h-6 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-label-md text-label-md shrink-0 mt-1">1</span>
                  <p className="font-body-md text-body-md text-on-surface-variant">Go to the <a className="text-primary font-bold hover:underline transition-colors" href="https://id.atlassian.com/manage-profile/security/api-tokens" target="_blank" rel="noreferrer">https://id.atlassian.com/manage-profile/security/api-tokens</a>.</p>
                </li>
                <li className="flex items-start gap-4">
                  <span className="w-6 h-6 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-label-md text-label-md shrink-0 mt-1">2</span>
                  <p className="font-body-md text-body-md text-on-surface-variant">Log in with your Atlassian account if prompted.</p>
                </li>
                <li className="flex items-start gap-4">
                  <span className="w-6 h-6 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-label-md text-label-md shrink-0 mt-1">3</span>
                  <p className="font-body-md text-body-md text-on-surface-variant">Click the blue 'Create API token' button.</p>
                </li>
                <li className="flex items-start gap-4">
                  <span className="w-6 h-6 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-label-md text-label-md shrink-0 mt-1">4</span>
                  <p className="font-body-md text-body-md text-on-surface-variant">Enter a label (e.g., 'JAT'), click Create, and copy the token to paste here.</p>
                </li>
              </ul>
              
              <div className="flex items-center gap-4 p-4 bg-tertiary-container/10 border border-tertiary/20 rounded-lg">
                <span className="material-symbols-outlined text-tertiary font-variation-settings: 'FILL' 1;">shield</span>
                <p className="font-label-md text-label-md text-tertiary-fixed">
                  Security Note: Your API Token is encrypted at rest using AES-256 and is never stored in plain text.
                </p>
              </div>

              {/* Decorative Element */}
              <div className="mt-8 hidden lg:flex items-center justify-between gap-4 py-6 w-full">
                {/* Node 1: Jira Token */}
                <div className="flex flex-col items-center gap-1 bg-surface-container-high p-4 rounded-xl border border-outline-variant shadow-[0_0_15px_rgba(160,120,255,0.1)] hover:shadow-[0_0_20px_rgba(160,120,255,0.2)] transition-shadow duration-300 shrink-0">
                  <span className="material-symbols-outlined text-primary">vpn_key</span>
                  <span className="text-label-md font-bold text-on-surface">Jira Token</span>
                </div>

                {/* Connector */}
                <div className="flex-grow flex flex-col items-center gap-1">
                  <span className="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold">Encrypted Sync</span>
                  <div className="w-full flex items-center gap-1">
                    <div className="flex-grow border-t border-dashed border-outline-variant/50"></div>
                    <span className="material-symbols-outlined text-primary animate-pulse text-base">arrow_forward</span>
                    <div className="flex-grow border-t border-dashed border-outline-variant/50"></div>
                  </div>
                </div>

                {/* Node 2: Workspace Connected */}
                <div className="flex flex-col items-center gap-1 bg-surface-container-high p-4 rounded-xl border border-primary/30 shadow-[0_0_15px_rgba(111,251,190,0.1)] hover:shadow-[0_0_20px_rgba(111,251,190,0.2)] transition-shadow duration-300 shrink-0">
                  <span className="material-symbols-outlined text-tertiary">verified_user</span>
                  <span className="text-label-md font-bold text-on-surface">Workspace Connected</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 px-12 flex flex-col md:flex-row justify-between items-center gap-4 bg-surface-container-lowest border-t border-outline-variant/30 mt-auto">
        <div className="flex items-center gap-4">
          <span className="font-title-lg text-title-lg text-on-surface">JAT</span>
        </div>
        <div className="flex gap-6">
          <a className="font-label-md text-label-md text-on-surface-variant hover:text-secondary transition-colors opacity-80 hover:opacity-100" href="#">Privacy Policy</a>
          <a className="font-label-md text-label-md text-on-surface-variant hover:text-secondary transition-colors opacity-80 hover:opacity-100" href="#">Terms of Service</a>
          <a className="font-label-md text-label-md text-on-surface-variant hover:text-secondary transition-colors opacity-80 hover:opacity-100" href="#">Cookie Settings</a>
        </div>
        <p className="font-label-md text-label-md text-on-surface-variant opacity-60">© 2024 JiraAutoTest Engine. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default WorkspacePage;
