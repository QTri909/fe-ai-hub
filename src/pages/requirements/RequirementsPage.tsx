import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, Wand2, ListChecks } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { requirementApi, type Requirement } from '@/features/project/api/requirements.api';
import { RequirementContent } from '@/components/common/RequirementContent';

export const RequirementsPage = () => {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const [selectedReq, setSelectedReq] = useState<Requirement | null>(null);
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAcLoading, setIsAcLoading] = useState(false);

  useEffect(() => {
    const fetchRequirements = async () => {
      if (!projectId) return;
      try {
        setIsLoading(true);
        const data = await requirementApi.getRequirementsByProjectId(projectId, 0, 100);
        setRequirements(data.content || []);
      } catch (error) {
        console.error('Failed to fetch requirements', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRequirements();
  }, [projectId]);

  // Fetch acceptance criteria when a requirement is selected
  useEffect(() => {
    const fetchAcceptanceCriteria = async () => {
      if (!selectedReq) return;
      try {
        setIsAcLoading(true);
        const acList = await requirementApi.getAcceptanceCriteriaByRequirement(selectedReq.id);
        // Map backend shape to UI shape
        const mapped = acList.map(ac => ({ id: String(ac.acId), content: ac.content, orderIndex: ac.orderIndex }));
        setSelectedReq(prev => prev ? { ...prev, acceptanceCriteriaList: mapped } : prev);
      } catch (error) {
        console.error('Failed to fetch acceptance criteria', error);
      } finally {
        setIsAcLoading(false);
      }
    };

    fetchAcceptanceCriteria();
  }, [selectedReq?.id]);

  // Parse JSON description from Jira
  const parseDescription = (description: string | undefined) => {
    if (!description) return null;
    try {
      const parsed = JSON.parse(description);
      // Ensure parsed content has valid structure
      if (parsed && typeof parsed === 'object' && parsed.content) {
        return parsed;
      }
      return null;
    } catch {
      return null;
    }
  };

  // Get plain text fallback for description
  const getPlainTextDescription = (description: string | undefined) => {
    if (!description) return null;
    // If not valid JSON, return as plain text
    try {
      JSON.parse(description);
      return null; // Valid JSON, will use RequirementContent instead
    } catch {
      return description;
    }
  };

  return (
    <div className="flex h-full flex-col animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold font-headline-md text-on-surface">Requirements</h1>
        <button className="flex items-center gap-2 bg-primary hover:brightness-110 active:scale-95 text-on-primary px-4 py-2 rounded-lg font-bold transition-all shadow-md shadow-primary/20">
          <Plus size={18} />
          New Requirement
        </button>
      </div>

      <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl flex-1 flex flex-col overflow-hidden shadow-sm">
        {/* Toolbar */}
        <div className="p-4 border-b border-outline-variant/30 flex items-center gap-4 bg-surface-container-lowest">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" size={18} />
            <input 
              type="text" 
              placeholder="Search requirements..." 
              className="w-full bg-surface-container-high border border-outline-variant/30 text-on-surface rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>

          <button className="flex items-center gap-2 bg-surface-container-high border border-outline-variant/30 text-on-surface px-4 py-2 rounded-lg hover:bg-surface-container-highest transition-colors font-medium">
            <Filter size={18} />
            Filter
          </button>
        </div>

        {/* Main Area */}
        <div className="flex flex-1 overflow-hidden bg-surface-container-lowest">
          {/* Table */}
          <div className={`flex-1 overflow-auto ${selectedReq ? 'border-r border-outline-variant/30' : ''}`}>
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : requirements.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <span className="material-symbols-outlined text-[48px] text-outline mb-4 opacity-50">description</span>
                <p className="text-on-surface font-bold text-lg mb-2">No Requirements Found</p>
                <p className="text-on-surface-variant text-sm max-w-sm">There are no requirements synced for this project. Try syncing from Jira or create a new one.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead className="bg-surface-container-low sticky top-0 border-b border-outline-variant/30 shadow-sm z-10">
                  <tr>
                    <th className="p-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Key</th>
                    <th className="p-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Title</th>
                    <th className="p-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Type</th>
                    <th className="p-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Status</th>
                    <th className="p-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Priority</th>
                  </tr>
                </thead>
                <tbody>
                  {requirements.map(req => (
                    <tr 
                      key={req.id} 
                      onClick={() => setSelectedReq(req)}
                      className={`border-b border-outline-variant/10 cursor-pointer hover:bg-surface-container-high/50 transition-colors ${selectedReq?.id === req.id ? 'bg-primary/5' : ''}`}
                    >
                      <td className="p-4 text-primary font-medium text-sm">{req.requirementKey}</td>
                      <td className="p-4 text-on-surface font-medium text-sm max-w-xs truncate">{req.title}</td>
                      <td className="p-4 text-on-surface-variant text-sm">{req.type || 'N/A'}</td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-secondary/10 text-secondary border border-secondary/20 uppercase tracking-wider">
                          {req.status || 'N/A'}
                        </span>
                      </td>
                      <td className="p-4 text-on-surface-variant text-sm">{req.priority || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Details Modal */}
          {selectedReq && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedReq(null)}>
              <div 
                className="w-full max-w-3xl max-h-[90vh] bg-surface-container-lowest rounded-2xl flex flex-col shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6 border-b border-outline-variant/30 bg-surface-container-low/30 flex-shrink-0">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-primary font-bold text-sm bg-primary/10 px-3 py-1.5 rounded-md">{selectedReq.requirementKey}</span>
                    <button onClick={() => setSelectedReq(null)} className="text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high p-2 rounded-full transition-colors cursor-pointer">
                      <span className="material-symbols-outlined text-[20px]">close</span>
                    </button>
                  </div>
                  <h2 className="text-2xl font-bold font-headline-md text-on-surface mb-4 leading-tight">{selectedReq.title}</h2>
                  <div className="flex gap-3">
                    <span className="px-3 py-1.5 rounded-md border border-outline-variant text-xs font-semibold bg-surface-container text-on-surface-variant">{selectedReq.type || 'N/A'}</span>
                    <span className="px-3 py-1.5 rounded-md text-xs font-bold bg-secondary/10 text-secondary border border-secondary/20 uppercase tracking-wider">{selectedReq.status || 'N/A'}</span>
                  </div>
                </div>
                <div className="p-6 overflow-y-auto flex-1">
                  <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-3">Description</h3>
                  <div className="text-on-surface font-body-md text-sm mb-8 leading-relaxed bg-surface-container-lowest border border-outline-variant/20 p-4 rounded-lg shadow-sm">
                    {selectedReq.description ? (
                      parseDescription(selectedReq.description) ? (
                        <RequirementContent content={parseDescription(selectedReq.description)} />
                      ) : (
                        // Fallback: display plain text if JSON parse fails
                        <p className="text-gray-300 whitespace-pre-wrap">{getPlainTextDescription(selectedReq.description)}</p>
                      )
                    ) : (
                      <span className="italic text-on-surface-variant opacity-70">No description provided.</span>
                    )}
                  </div>
                  
                  <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-3">Acceptance Criteria</h3>
                  <div className="text-on-surface text-sm space-y-2 mb-8 bg-surface-container-lowest border border-outline-variant/20 p-4 rounded-lg shadow-sm">
                    {isAcLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    ) : selectedReq.acceptanceCriteriaList && selectedReq.acceptanceCriteriaList.length > 0 ? (
                      <ul className="list-decimal pl-5 space-y-2">
                        {selectedReq.acceptanceCriteriaList.sort((a, b) => a.orderIndex - b.orderIndex).map(ac => (
                          <li key={ac.id} className="text-on-surface leading-relaxed">{ac.content}</li>
                        ))}
                      </ul>
                    ) : (
                      <span className="italic text-on-surface-variant opacity-70">No acceptance criteria provided.</span>
                    )}
                  </div>

                  <div className="flex gap-3 mt-4">
                    <button 
                      onClick={() => navigate(`/projects/${projectId}/requirements/${selectedReq.id}/generate`)}
                      className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-tertiary hover:brightness-110 text-on-primary px-4 py-3 rounded-lg font-bold transition-all shadow-md shadow-primary/20 active:scale-95 cursor-pointer"
                    >
                      <Wand2 size={18} />
                      Generate Test Cases (AI)
                    </button>
                    <button 
                      onClick={() => navigate(`/projects/${projectId}/requirements/${selectedReq.id}/test-cases`)}
                      className="flex-1 flex items-center justify-center gap-2 bg-surface-variant hover:bg-surface-variant-hover text-on-surface-variant px-4 py-3 rounded-lg font-bold transition-all border border-outline active:scale-95 cursor-pointer"
                    >
                      <ListChecks size={18} />
                      View Test Cases
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};