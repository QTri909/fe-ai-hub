import React, { useEffect, useState } from 'react';
import { mappingApi } from '@/features/project/api/mapping.api';
import type { IssueTypeMapping } from '@/features/project/api/mapping.api';
import { useWorkspaceStore } from '@/core/store/workspace.store';

interface Props {
  projectId: string;
  projectName: string;
  onClose: () => void;
}

const SYSTEM_TYPES = ['USER_STORY', 'TEST_CASE', 'BUG', 'IGNORED'];

export const DataMappingDialog: React.FC<Props> = ({ projectId, projectName, onClose }) => {
  const activeWorkspace = useWorkspaceStore(state => state.activeWorkspace);
  const [mappings, setMappings] = useState<IssueTypeMapping[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState<string | null>(null);

  useEffect(() => {
    const fetchMappings = async () => {
      if (!activeWorkspace) return;
      try {
        const data = await mappingApi.getMappings(activeWorkspace.id, projectId);
        setMappings(data);
      } catch (error) {
        console.error('Failed to fetch mappings', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMappings();
  }, [activeWorkspace, projectId]);

  const handleUpdate = async (mappingId: string, newType: string) => {
    if (!activeWorkspace) return;
    try {
      setIsSaving(mappingId);
      await mappingApi.updateMapping(activeWorkspace.id, projectId, mappingId, newType);
      setMappings(prev => prev.map(m => m.id === mappingId ? { ...m, systemType: newType } : m));
    } catch (error) {
      console.error('Failed to update mapping', error);
      alert('Failed to update mapping.');
    } finally {
      setIsSaving(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#1e293b] border border-outline-variant/50 rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-outline-variant/30 flex items-center justify-between bg-surface-container-high/50">
          <div>
            <h2 className="font-headline-md text-lg text-on-surface">Data Mappings</h2>
            <p className="font-body-md text-xs text-on-surface-variant">Review AI-generated mappings for <span className="font-bold">{projectName}</span></p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/50 rounded-full transition-colors"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : mappings.length === 0 ? (
            <div className="text-center py-8 text-on-surface-variant">
              No issue types found for this project. They may still be syncing.
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-12 gap-4 px-4 font-label-md text-xs text-on-surface-variant uppercase tracking-wider mb-2">
                <div className="col-span-5">Jira Issue Type</div>
                <div className="col-span-2"></div>
                <div className="col-span-5">Mapped System Type</div>
              </div>
              
              {mappings.map(mapping => (
                <div key={mapping.id} className="grid grid-cols-12 gap-4 items-center bg-surface-container-low border border-outline-variant/30 rounded-lg p-4">
                  <div className="col-span-5 flex items-center gap-2">
                    <span className="material-symbols-outlined text-tertiary">label</span>
                    <span className="font-title-lg text-sm text-on-surface">{mapping.jiraIssueTypeName}</span>
                  </div>
                  
                  <div className="col-span-2 flex justify-center text-outline-variant">
                    <span className="material-symbols-outlined">arrow_right_alt</span>
                  </div>
                  
                  <div className="col-span-5">
                    <select
                      className={`w-full bg-surface-container-high border ${mapping.systemType === 'IGNORED' ? 'border-error/50 text-error' : 'border-outline-variant/50 text-primary'} rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-colors disabled:opacity-50`}
                      value={mapping.systemType}
                      disabled={isSaving === mapping.id}
                      onChange={(e) => handleUpdate(mapping.id, e.target.value)}
                    >
                      {SYSTEM_TYPES.map(type => (
                        <option key={type} value={type} className="text-on-surface bg-surface-container-high">
                          {type.replace('_', ' ')}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="px-6 py-4 border-t border-outline-variant/30 bg-surface-container-high/50 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-primary text-on-primary font-bold text-sm rounded-lg hover:brightness-110 transition-all cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
