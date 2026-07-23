import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/core/constants';
import { useAuthStore } from '@/core/store/auth.store';

export const WorkspacePage = () => {
  const navigate = useNavigate();
  const clearTokensAndUser = useAuthStore((state) => state.clearTokensAndUser);
  const setUser = useAuthStore((state) => state.setUser);

  const [workspaceName, setWorkspaceName] = useState('');
  const [jiraSite, setJiraSite] = useState('');
  const [email, setEmail] = useState('');
  const [apiToken, setApiToken] = useState('');
  const [showToken, setShowToken] = useState(false);

  const [userId, setUserId] = useState<string>('');

  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const { authApi } = await import('@/features/auth/api/auth.api');
        const user = await authApi.getMe();
        setUserId(user.id);
        setUser(user);
      } catch (error) {
        console.error('Failed to fetch user:', error);
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
    clearTokensAndUser();
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
    <div className="flex h-full flex-col animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-on-surface mb-2">Connect Your Jira Site</h1>
        <p className="text-on-surface-variant">Configure your credentials to sync automation tests with Jira Cloud.</p>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-xl p-6 md:p-8 shadow-lg max-w-3xl w-full mx-auto transition-all duration-300">
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

        <form className="space-y-6" onSubmit={(e) => e.preventDefault()} autoComplete="off">
          {/* Dummy hidden inputs to prevent browser password manager autofill */}
          <input type="text" style={{ display: 'none' }} tabIndex={-1} readOnly />
          <input type="password" style={{ display: 'none' }} tabIndex={-1} readOnly />

          {/* Workspace Name */}
          <div className="space-y-1">
            <label className="font-label-md text-label-md text-on-surface-variant ml-1">Workspace Name</label>
            <input 
              className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2 text-on-surface focus:outline-none focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all" 
              type="text"
              name="ws_name_no_autofill"
              autoComplete="off"
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
            />
          </div>

          {/* Jira Site URL */}
          <div className="space-y-1">
            <label className="font-label-md text-label-md text-on-surface-variant ml-1">Jira Site URL</label>
            <div className="flex items-stretch border border-outline-variant rounded-lg bg-surface-container-low overflow-hidden focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
              <span className="flex items-center px-4 border-r border-outline-variant text-outline font-code text-code bg-surface-container">https://</span>
              <input 
                className="flex-grow bg-transparent border-none px-4 py-2 text-on-surface focus:ring-0 font-code text-code" 
                type="text"
                name="ws_jira_site_no_autofill"
                autoComplete="off"
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
              className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2 text-on-surface focus:outline-none focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all" 
              type="email"
              name="ws_email_no_autofill"
              autoComplete="off"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* API Token */}
          <div className="space-y-1 relative">
            <label className="font-label-md text-label-md text-on-surface-variant ml-1">Jira API Token</label>
            <div className="relative">
              <input 
                className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2 text-on-surface focus:outline-none focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all pr-12" 
                type={showToken ? "text" : "password"}
                name="ws_token_no_autofill"
                autoComplete="new-password"
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
              className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-primary to-tertiary text-on-primary font-bold font-body-md text-body-md transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:shadow-md flex items-center justify-center gap-2"
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

        {/* How to get API Token Guide */}
        <div className="mt-8 pt-6 border-t border-outline-variant/30">
          <h2 className="font-title-lg text-title-lg text-on-surface flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-primary">help_outline</span>
            How to get your Jira API Token?
          </h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-label-md text-label-md shrink-0 mt-1">1</span>
              <p className="font-body-md text-body-md text-on-surface-variant">Go to the <a className="text-primary font-bold hover:underline transition-colors" href="https://id.atlassian.com/manage-profile/security/api-tokens" target="_blank" rel="noreferrer">API tokens page</a>.</p>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-label-md text-label-md shrink-0 mt-1">2</span>
              <p className="font-body-md text-body-md text-on-surface-variant">Log in with your Atlassian account if prompted.</p>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-label-md text-label-md shrink-0 mt-1">3</span>
              <p className="font-body-md text-body-md text-on-surface-variant">Click the blue 'Create API token' button.</p>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-label-md text-label-md shrink-0 mt-1">4</span>
              <p className="font-body-md text-body-md text-on-surface-variant">Enter a label (e.g., 'JAT'), click Create, and copy the token to paste here.</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default WorkspacePage;