import { Link } from 'react-router-dom';
import { ROUTES } from '@/core/constants';

export const NotFoundPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 p-6 text-slate-100">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-indigo-500">404</h1>
        <h2 className="mt-4 text-3xl font-semibold">Page Not Found</h2>
        <p className="mt-2 text-slate-400">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="mt-6">
          <Link 
            to={ROUTES.WORKSPACE_LIST}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors inline-flex items-center gap-2"
          >
            Go to Workspaces
          </Link>
        </div>
      </div>
    </div>
  );
};
export default NotFoundPage;
