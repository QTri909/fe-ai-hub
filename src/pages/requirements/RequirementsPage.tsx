import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, Wand2, ListChecks } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { requirementApi } from '@/features/requirements';
import type { Requirement } from '@/features/requirements';
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
        const data = await requirementApi.getByProjectId(projectId, 0, 100);
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
        const mapped = acList.map((ac) => ({
          id: String(ac.acId),
          content: ac.content,
          orderIndex: ac.orderIndex,
        }));
        setSelectedReq((prev) => (prev ? { ...prev, acceptanceCriteriaList: mapped } : prev));
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
    <div className="animate-fade-in flex h-full flex-col">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-headline-md text-on-surface text-2xl font-bold">Requirements</h1>
        <button className="bg-primary text-on-primary shadow-primary/20 flex items-center gap-2 rounded-lg px-4 py-2 font-bold shadow-md transition-all hover:brightness-110 active:scale-95">
          <Plus size={18} />
          New Requirement
        </button>
      </div>

      <div className="bg-surface-container-low border-outline-variant/30 flex flex-1 flex-col overflow-hidden rounded-xl border shadow-sm">
        {/* Toolbar */}
        <div className="border-outline-variant/30 bg-surface-container-lowest flex items-center gap-4 border-b p-4">
          <div className="relative max-w-md flex-1">
            <Search
              className="text-on-surface-variant absolute top-1/2 left-3 -translate-y-1/2"
              size={18}
            />
            <input
              type="text"
              placeholder="Search requirements..."
              className="bg-surface-container-high border-outline-variant/30 text-on-surface focus:ring-primary/50 w-full rounded-lg border py-2 pr-4 pl-10 transition-all focus:ring-2 focus:outline-none"
            />
          </div>

          <button className="bg-surface-container-high border-outline-variant/30 text-on-surface hover:bg-surface-container-highest flex items-center gap-2 rounded-lg border px-4 py-2 font-medium transition-colors">
            <Filter size={18} />
            Filter
          </button>
        </div>

        {/* Main Area */}
        <div className="bg-surface-container-lowest flex flex-1 overflow-hidden">
          {/* Table */}
          <div
            className={`flex-1 overflow-auto ${selectedReq ? 'border-outline-variant/30 border-r' : ''}`}
          >
            {isLoading ? (
              <div className="flex h-64 items-center justify-center">
                <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
              </div>
            ) : requirements.length === 0 ? (
              <div className="flex h-64 flex-col items-center justify-center text-center">
                <span className="material-symbols-outlined text-outline mb-4 text-[48px] opacity-50">
                  description
                </span>
                <p className="text-on-surface mb-2 text-lg font-bold">No Requirements Found</p>
                <p className="text-on-surface-variant max-w-sm text-sm">
                  There are no requirements synced for this project. Try syncing from Jira or create
                  a new one.
                </p>
              </div>
            ) : (
              <table className="w-full border-collapse text-left">
                <thead className="bg-surface-container-low border-outline-variant/30 sticky top-0 z-10 border-b shadow-sm">
                  <tr>
                    <th className="text-on-surface-variant p-4 text-xs font-bold tracking-wider uppercase">
                      Key
                    </th>
                    <th className="text-on-surface-variant p-4 text-xs font-bold tracking-wider uppercase">
                      Title
                    </th>
                    <th className="text-on-surface-variant p-4 text-xs font-bold tracking-wider uppercase">
                      Type
                    </th>
                    <th className="text-on-surface-variant p-4 text-xs font-bold tracking-wider uppercase">
                      Status
                    </th>
                    <th className="text-on-surface-variant p-4 text-xs font-bold tracking-wider uppercase">
                      Priority
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {requirements.map((req) => (
                    <tr
                      key={req.id}
                      onClick={() => setSelectedReq(req)}
                      className={`border-outline-variant/10 hover:bg-surface-container-high/50 cursor-pointer border-b transition-colors ${selectedReq?.id === req.id ? 'bg-primary/5' : ''}`}
                    >
                      <td className="text-primary p-4 text-sm font-medium">{req.requirementKey}</td>
                      <td className="text-on-surface max-w-xs truncate p-4 text-sm font-medium">
                        {req.title}
                      </td>
                      <td className="text-on-surface-variant p-4 text-sm">{req.type || 'N/A'}</td>
                      <td className="p-4">
                        <span className="bg-secondary/10 text-secondary border-secondary/20 rounded-full border px-2.5 py-1 text-[11px] font-bold tracking-wider uppercase">
                          {req.status || 'N/A'}
                        </span>
                      </td>
                      <td className="text-on-surface-variant p-4 text-sm">
                        {req.priority || 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Details Modal */}
          {selectedReq && (
            <div
              className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm sm:p-6"
              onClick={() => setSelectedReq(null)}
            >
              <div
                className="bg-surface-container-lowest flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="border-outline-variant/30 bg-surface-container-low/30 flex-shrink-0 border-b p-6">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-primary bg-primary/10 rounded-md px-3 py-1.5 text-sm font-bold">
                      {selectedReq.requirementKey}
                    </span>
                    <button
                      onClick={() => setSelectedReq(null)}
                      className="text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high cursor-pointer rounded-full p-2 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[20px]">close</span>
                    </button>
                  </div>
                  <h2 className="font-headline-md text-on-surface mb-4 text-2xl leading-tight font-bold">
                    {selectedReq.title}
                  </h2>
                  <div className="flex gap-3">
                    <span className="border-outline-variant bg-surface-container text-on-surface-variant rounded-md border px-3 py-1.5 text-xs font-semibold">
                      {selectedReq.type || 'N/A'}
                    </span>
                    <span className="bg-secondary/10 text-secondary border-secondary/20 rounded-md border px-3 py-1.5 text-xs font-bold tracking-wider uppercase">
                      {selectedReq.status || 'N/A'}
                    </span>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-6">
                  <h3 className="text-on-surface-variant mb-3 text-xs font-bold tracking-wider uppercase">
                    Description
                  </h3>
                  <div className="text-on-surface font-body-md bg-surface-container-lowest border-outline-variant/20 mb-8 rounded-lg border p-4 text-sm leading-relaxed shadow-sm">
                    {selectedReq.description ? (
                      parseDescription(selectedReq.description) ? (
                        <RequirementContent content={parseDescription(selectedReq.description)} />
                      ) : (
                        // Fallback: display plain text if JSON parse fails
                        <p className="whitespace-pre-wrap text-gray-300">
                          {getPlainTextDescription(selectedReq.description)}
                        </p>
                      )
                    ) : (
                      <span className="text-on-surface-variant italic opacity-70">
                        No description provided.
                      </span>
                    )}
                  </div>

                  <h3 className="text-on-surface-variant mb-3 text-xs font-bold tracking-wider uppercase">
                    Acceptance Criteria
                  </h3>
                  <div className="text-on-surface bg-surface-container-lowest border-outline-variant/20 mb-8 space-y-2 rounded-lg border p-4 text-sm shadow-sm">
                    {isAcLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="border-primary h-6 w-6 animate-spin rounded-full border-4 border-t-transparent"></div>
                      </div>
                    ) : selectedReq.acceptanceCriteriaList &&
                      selectedReq.acceptanceCriteriaList.length > 0 ? (
                      <ul className="list-decimal space-y-2 pl-5">
                        {selectedReq.acceptanceCriteriaList
                          .sort((a, b) => a.orderIndex - b.orderIndex)
                          .map((ac) => (
                            <li key={ac.id} className="text-on-surface leading-relaxed">
                              {ac.content}
                            </li>
                          ))}
                      </ul>
                    ) : (
                      <span className="text-on-surface-variant italic opacity-70">
                        No acceptance criteria provided.
                      </span>
                    )}
                  </div>

                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={() =>
                        navigate(`/projects/${projectId}/requirements/${selectedReq.id}/generate`)
                      }
                      className="from-primary to-tertiary text-on-primary shadow-primary/20 flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg bg-gradient-to-r px-4 py-3 font-bold shadow-md transition-all hover:brightness-110 active:scale-95"
                    >
                      <Wand2 size={18} />
                      Generate Test Cases (AI)
                    </button>
                    <button
                      onClick={() =>
                        navigate(`/projects/${projectId}/requirements/${selectedReq.id}/test-cases`)
                      }
                      className="bg-surface-variant hover:bg-surface-variant-hover text-on-surface-variant border-outline flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border px-4 py-3 font-bold transition-all active:scale-95"
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
