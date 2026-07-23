import React, { useState, useEffect, useCallback } from 'react';
import {
  Search,
  Filter,
  RefreshCw,
  Sparkles,
  Eye,
  CheckCircle2,
  Circle,
  Clock,
  X,
  FileText,
  Layers,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  FlaskConical,
  Check,
  Play,
  History,
  Edit3,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { requirementApi } from '@/features/requirements';
import { projectApi } from '@/features/project/api/project.api';
import { testCaseApi, type TestCase } from '@/features/project/api/testCases.api';
import { testSuiteApi, type TestSuite } from '@/features/project/api/testSuites.api';
import { TestCaseHistoryModal } from '@/features/history/components/TestCaseHistoryModal';
import { useWorkspaceStore } from '@/core/store/workspace.store';
import type { Requirement, RequirementDetail } from '@/features/requirements';
import type { Project } from '@/features/project/types/project.types';

export const RequirementsPage = () => {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const activeWorkspace = useWorkspaceStore((state) => state.activeWorkspace);

  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [project, setProject] = useState<Project | null>(null);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'GENERATED' | 'NOT_GENERATED'>('ALL');

  // Detail Modal & Drawer state
  const [selectedReq, setSelectedReq] = useState<Requirement | null>(null);
  const [reqDetail, setReqDetail] = useState<RequirementDetail | null>(null);
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [activeDetailTab, setActiveDetailTab] = useState<'overview' | 'test-cases'>('overview');

  // Specific requirement currently being generated
  const [generatingReqId, setGeneratingReqId] = useState<string | null>(null);

  // AC Filter for Test Cases tab
  const [selectedAcFilter, setSelectedAcFilter] = useState<string | number | 'ALL'>('ALL');

  // Expanded TC state inside detail
  const [expandedTcId, setExpandedTcId] = useState<number | null>(null);

  // Checkbox selection states
  const [selectedTestCaseIds, setSelectedTestCaseIds] = useState<number[]>([]);

  // Add to Suite modal states
  const [isAddToSuiteModalOpen, setIsAddToSuiteModalOpen] = useState(false);
  const [testSuites, setTestSuites] = useState<TestSuite[]>([]);
  const [selectedSuiteId, setSelectedSuiteId] = useState<number | null>(null);
  const [isLoadingSuites, setIsLoadingSuites] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [newSuiteName, setNewSuiteName] = useState('');
  const [newSuiteDescription, setNewSuiteDescription] = useState('');
  const [isCreatingSuite, setIsCreatingSuite] = useState(false);

  // Run Test states
  const [runningTestCases, setRunningTestCases] = useState<Record<number, boolean>>({});
  const [historyModalTc, setHistoryModalTc] = useState<{ id: number; code: string; title: string } | null>(null);
  const [notifications, setNotifications] = useState<Array<{ id: string; testCaseCode: string; passed: boolean; message: string }>>([]);

  // Edit modal state (single declaration)
  const [editModal, setEditModal] = useState<{ visible: boolean; field: 'precondition' | 'expectedResult' | 'title' | 'steps' | 'testData' | 'scripts'; tc: any }>({ visible: false, field: 'precondition', tc: null });
  const [editFormData, setEditFormData] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);

  const [projectBaseUrl, setProjectBaseUrl] = useState<string>('');

  const addEditNotification = (tcCode: string, success: boolean, message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setNotifications(prev => [...prev, { id, testCaseCode: tcCode, passed: success, message }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 10000);
  };

  const addNotification = (testCaseCode: string, passed: boolean, message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setNotifications(prev => [...prev, { id, testCaseCode, passed, message }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 10000);
  };

  useEffect(() => {
    const fetchProjectBaseUrl = async () => {
      if (!projectId) return;
      try {
        const { environmentsApi } = await import('@/features/project/api/environments.api');
        const envs = await environmentsApi.getEnvironmentsByProject(projectId);
        const validEnvs = envs.filter(e => e.baseUrl && e.baseUrl.trim() !== '');
        const defaultEnv = validEnvs.find(e => e.isDefault) || validEnvs[0];
        if (defaultEnv && defaultEnv.baseUrl) {
          setProjectBaseUrl(defaultEnv.baseUrl);
        }
      } catch (error) {
        console.error('Failed to fetch project base URL:', error);
      }
    };
    fetchProjectBaseUrl();
  }, [projectId]);

  const fetchRequirements = useCallback(async () => {
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
  }, [projectId]);

  useEffect(() => {
    fetchRequirements();
  }, [fetchRequirements]);

  // Fetch project info for Jira sync
  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) return;
      try {
        const data = await projectApi.getProjectById(projectId);
        setProject(data);
      } catch (error) {
        console.error('Failed to fetch project', error);
      }
    };
    fetchProject();
  }, [projectId]);

  const handleSync = async () => {
    if (!activeWorkspace || !project) return;
    try {
      setIsSyncing(true);
      await projectApi.syncProjectRequirements(activeWorkspace.id, project.projectKey);
      await fetchRequirements();
    } catch (error) {
      console.error('Failed to sync requirements', error);
    } finally {
      setIsSyncing(false);
    }
  };

  // Helper: Fetch test cases along with their test steps, test data, and scripts
  const fetchTestCasesWithSteps = async (reqId: string) => {
    try {
      const rawCases = await testCaseApi.getTestCasesByRequirement(reqId);
      if (!rawCases || rawCases.length === 0) return [];

      const casesWithDetails = await Promise.all(
        rawCases.map(async (tc: any) => {
          try {
            const [steps, testData, scripts] = await Promise.all([
              testCaseApi.getTestCaseSteps(tc.testCaseId).catch(() => []),
              testCaseApi.getTestCaseTestData(tc.testCaseId).catch(() => []),
              testCaseApi.getTestCaseScripts(tc.testCaseId).catch(() => []),
            ]);
            return {
              ...tc,
              steps: steps || [],
              testData: testData || [],
              scripts: scripts || [],
            };
          } catch {
            return {
              ...tc,
              steps: [],
              testData: [],
              scripts: [],
            };
          }
        })
      );
      return casesWithDetails;
    } catch (err) {
      console.error('Failed to fetch test cases with details', err);
      return [];
    }
  };

  const handleToggleSelectTestCase = (tcId: number) => {
    setSelectedTestCaseIds((prev) =>
      prev.includes(tcId) ? prev.filter((id) => id !== tcId) : [...prev, tcId]
    );
  };

  const handleOpenAddToSuite = async () => {
    if (!projectId) return;
    try {
      setIsLoadingSuites(true);
      setIsAddToSuiteModalOpen(true);
      const suites = await testSuiteApi.getTestSuitesByProject(projectId);
      setTestSuites(suites);
    } catch (error) {
      console.error('Failed to fetch test suites:', error);
    } finally {
      setIsLoadingSuites(false);
    }
  };

  const handleAddToSuiteSubmit = async () => {
    if (isCreateMode) {
      if (!newSuiteName.trim() || !projectId) return;
      try {
        setIsCreatingSuite(true);
        await testSuiteApi.createTestSuite({
          projectId: projectId,
          suiteName: newSuiteName.trim(),
          description: newSuiteDescription.trim(),
          testCaseIds: selectedTestCaseIds,
        });
        setIsAddToSuiteModalOpen(false);
        setSelectedTestCaseIds([]);
        alert('Successfully created new test suite and added test cases!');
      } catch (error) {
        console.error('Failed to create suite:', error);
        alert('Failed to create test suite. Please try again.');
      } finally {
        setIsCreatingSuite(false);
      }
    } else {
      if (!selectedSuiteId || selectedTestCaseIds.length === 0) return;
      try {
        setIsSubmitting(true);
        await testSuiteApi.addTestCasesToSuite(selectedSuiteId, selectedTestCaseIds);
        setIsAddToSuiteModalOpen(false);
        setSelectedTestCaseIds([]);
        alert('Successfully added test cases to suite!');
      } catch (error) {
        console.error('Failed to add test cases to suite:', error);
        alert('Failed to add test cases to suite. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleOpenEdit = (tc: any, field: 'precondition' | 'expectedResult' | 'title' | 'steps' | 'testData' | 'scripts') => {
    setEditModal({ visible: true, field, tc });
    if (field === 'steps') {
      setEditFormData({ steps: JSON.parse(JSON.stringify(tc.steps || [])) });
    } else if (field === 'testData') {
      setEditFormData({ testData: JSON.parse(JSON.stringify(tc.testData || [])) });
    } else if (field === 'scripts') {
      setEditFormData({ scriptContent: tc.scripts?.[0]?.scriptContent || '' });
    } else {
      setEditFormData({ value: tc[field] || '' });
    }
  };

  const handleSaveEdit = async () => {
    if (!editModal.tc) return;
    const tcData = editModal.tc;
    setIsSaving(true);
    try {
      if (editModal.field === 'precondition') {
        await testCaseApi.updateTestCase(tcData.testCaseId, { precondition: editFormData.value });
      } else if (editModal.field === 'expectedResult') {
        await testCaseApi.updateTestCase(tcData.testCaseId, { expectedResult: editFormData.value });
      } else if (editModal.field === 'title') {
        await testCaseApi.updateTestCase(tcData.testCaseId, { title: editFormData.value });
      } else if (editModal.field === 'steps') {
        for (const step of editFormData.steps || []) {
          await testCaseApi.updateTestStep(tcData.testCaseId, step.stepId, {
            stepOrder: step.stepOrder,
            actionDescription: step.actionDescription,
            expectedResult: step.expectedResult,
          });
        }
      } else if (editModal.field === 'testData') {
        for (const td of editFormData.testData || []) {
          await testCaseApi.updateTestData(tcData.testCaseId, td.testDataId, {
            dataName: td.dataName,
            inputData: td.inputData,
            expectedData: td.expectedData,
          });
        }
      } else if (editModal.field === 'scripts') {
        const script = tcData.scripts?.[0];
        if (script) {
          await testCaseApi.updateScript(tcData.testCaseId, script.scriptId, {
            scriptContent: editFormData.scriptContent,
          });
        }
      }
      if (selectedReq) {
        const updatedCases = await fetchTestCasesWithSteps(selectedReq.id);
        setTestCases(updatedCases);
      }
      setEditModal({ visible: false, field: 'precondition', tc: null });
      setEditFormData({});
      addEditNotification(tcData.testCaseCode, true, `${editModal.field} updated successfully!`);
    } catch (error: any) {
      console.error("Failed to save edit:", error);
      const errMsg = error.response?.data?.message || error.message || "Failed to save changes.";
      addEditNotification(tcData.testCaseCode, false, errMsg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRunTestCase = async (tc: TestCase) => {
    let baseUrl = '';
    if (projectId) {
      try {
        const { environmentsApi } = await import('@/features/project/api/environments.api');
        const envs = await environmentsApi.getEnvironmentsByProject(projectId);
        const validEnvs = envs.filter(e => e.baseUrl && e.baseUrl.trim() !== '');
        const defaultEnv = validEnvs.find(e => e.isDefault) || validEnvs[0];
        if (defaultEnv && defaultEnv.baseUrl) {
          baseUrl = defaultEnv.baseUrl;
        }
      } catch (err) {
        console.error('Failed to auto-fetch environment base URL:', err);
      }
    }

    if (!baseUrl) {
      baseUrl = window.prompt('Enter base URL to run tests against:', '') || '';
    }
    if (!baseUrl.trim()) {
      alert('Base URL is required to run tests.');
      return;
    }

    setRunningTestCases(prev => ({ ...prev, [tc.testCaseId]: true }));

    testCaseApi.executeScript(tc.testCaseId, baseUrl)
      .then(async (response) => {
        if (selectedReq) {
          const updatedCases = await fetchTestCasesWithSteps(selectedReq.id);
          setTestCases(updatedCases);
        }

        const msg = response.passed
          ? `PASSED in ${response.executionTime}ms. (Attempts: ${response.attempts})`
          : `FAILED: ${response.errorMessage || 'Unknown error'}.`;
        
        addNotification(tc.testCaseCode, response.passed, msg);
      })
      .catch((error: any) => {
        console.error('Failed to run script:', error);
        const errMsg = error.response?.data?.message || error.message || 'Failed to run script.';
        addNotification(tc.testCaseCode, false, errMsg);
      })
      .finally(() => {
        setRunningTestCases(prev => {
          const next = { ...prev };
          delete next[tc.testCaseId];
          return next;
        });
      });
  };

  // Open Detail Modal
  const handleOpenDetail = async (
    req: Requirement,
    defaultTab: 'overview' | 'test-cases' = 'overview',
    acFilter: string | number | 'ALL' = 'ALL',
    e?: React.MouseEvent
  ) => {
    if (e) e.stopPropagation();
    setSelectedReq(req);
    setActiveDetailTab(defaultTab);
    setSelectedAcFilter(acFilter);
    setIsDetailLoading(true);
    setReqDetail(null);
    setTestCases([]);
    setExpandedTcId(null);

    try {
      const [detailData, tcsData] = await Promise.all([
        requirementApi.getDetail(req.id).catch(() => null),
        fetchTestCasesWithSteps(req.id),
      ]);

      if (detailData) setReqDetail(detailData);
      if (tcsData) setTestCases(tcsData);
    } catch (error) {
      console.error('Failed to fetch requirement detail and test cases', error);
    } finally {
      setIsDetailLoading(false);
    }
  };

  // Generate Test Cases directly on button click
  const handleGenerateTestCases = async (reqToGen: Requirement, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (generatingReqId) return;

    let baseUrl = projectBaseUrl;
    if (!baseUrl || !baseUrl.trim()) {
      baseUrl = window.prompt('Enter base URL for UI exploration & generation:', '') || '';
      if (!baseUrl.trim()) {
        alert('Base URL is required to generate test cases.');
        return;
      }
      setProjectBaseUrl(baseUrl);
    }

    setGeneratingReqId(reqToGen.id);

    try {
      const resp = await requirementApi.generateAllInOne(reqToGen.id, {
        scriptLanguage: 'JAVASCRIPT',
        framework: 'playwright',
        maxTestCases: 5,
        generateScript: true,
        generateTestData: true,
        maxLajRetries: 3,
        baseUrl: baseUrl,
        enableUIExploration: true,
      });

      if (resp.job_id) {
        let isCompleted = false;
        while (!isCompleted) {
          await new Promise((resolve) => setTimeout(resolve, 3000));
          const statusResp = await requirementApi.getJobStatus(reqToGen.id, resp.job_id);
          
          if (statusResp.status === 'COMPLETED') {
            isCompleted = true;
          } else if (statusResp.status === 'FAILED') {
            console.error('Job failed:', statusResp.message);
            isCompleted = true;
          } else {
            console.log(`Polling job ${resp.job_id} status: ${statusResp.status} - ${statusResp.progress}%`);
          }
        }
      }

      await fetchRequirements();
    } catch (error) {
      console.error('Failed to generate test cases', error);
    } finally {
      setGeneratingReqId(null);
    }
  };

  // Generate Test Cases inside Drawer
  const handleGenerateDrawerTestCases = async (reqToGen: Requirement) => {
    if (!reqToGen || generatingReqId) return;

    let baseUrl = projectBaseUrl;
    if (!baseUrl || !baseUrl.trim()) {
      baseUrl = window.prompt('Enter base URL for UI exploration & generation:', '') || '';
      if (!baseUrl.trim()) {
        alert('Base URL is required to generate test cases.');
        return;
      }
      setProjectBaseUrl(baseUrl);
    }

    setGeneratingReqId(reqToGen.id);

    try {
      const resp = await requirementApi.generateAllInOne(reqToGen.id, {
        scriptLanguage: 'JAVASCRIPT',
        framework: 'playwright',
        maxTestCases: 5,
        generateScript: true,
        generateTestData: true,
        maxLajRetries: 3,
        baseUrl: baseUrl,
        enableUIExploration: true,
      });

      if (resp.job_id) {
        let isCompleted = false;
        while (!isCompleted) {
          await new Promise((resolve) => setTimeout(resolve, 3000));
          const statusResp = await requirementApi.getJobStatus(reqToGen.id, resp.job_id);
          
          if (statusResp.status === 'COMPLETED') {
            isCompleted = true;
          } else if (statusResp.status === 'FAILED') {
            console.error('Job failed:', statusResp.message);
            isCompleted = true;
          }
        }
      }

      const [detailData, tcsData] = await Promise.all([
        requirementApi.getDetail(reqToGen.id).catch(() => null),
        fetchTestCasesWithSteps(reqToGen.id),
      ]);

      if (detailData) setReqDetail(detailData);
      if (tcsData) setTestCases(tcsData);

      setActiveDetailTab('test-cases');
      setSelectedAcFilter('ALL');
      await fetchRequirements();
    } catch (error) {
      console.error('Failed to generate test cases inside drawer', error);
    } finally {
      setGeneratingReqId(null);
    }
  };

  // Helper: Get AC List for selected requirement
  const getAcList = () => {
    if (reqDetail?.acceptanceCriteria && reqDetail.acceptanceCriteria.length > 0) {
      return reqDetail.acceptanceCriteria.map((ac, idx) => ({
        id: ac.acId || ac.requirementId || idx + 1,
        content: ac.content,
        orderIndex: ac.orderIndex || idx + 1,
      }));
    }
    if (selectedReq?.acceptanceCriteriaList && selectedReq.acceptanceCriteriaList.length > 0) {
      return selectedReq.acceptanceCriteriaList.map((ac, idx) => ({
        id: ac.id || idx + 1,
        content: ac.content,
        orderIndex: ac.orderIndex || idx + 1,
      }));
    }
    return [];
  };

  // Helper: Get Test Cases mapped to a specific AC
  const getTcsForAc = (acId: string | number, acIndex: number, acContent: string) => {
    if (!testCases || testCases.length === 0) return [];
    const acList = getAcList();
    if (acList.length === 0) return testCases;

    return testCases.filter((tc: any, tcIdx: number) => {
      if (tc.acceptanceCriteriaId === acId || tc.acId === acId) return true;
      if (tc.acceptanceCriteriaId === acIndex || tc.acId === acIndex) return true;

      const textMatch =
        (tc.title && tc.title.toLowerCase().includes(acContent.toLowerCase().slice(0, 15))) ||
        (tc.expectedResult && tc.expectedResult.toLowerCase().includes(acContent.toLowerCase().slice(0, 15)));
      if (textMatch) return true;

      return tcIdx % acList.length === acIndex - 1;
    });
  };

  // Filtered Requirements logic for main list
  const filteredRequirements = requirements.filter((req) => {
    const matchesSearch =
      req.requirementKey.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (req.description && req.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesPriority =
      priorityFilter === 'ALL' || (req.priority && req.priority.toUpperCase() === priorityFilter);

    const isGenerated = req.status === 'DONE' || req.status === 'COMPLETED' || req.status === 'GENERATED';
    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'GENERATED' && isGenerated) ||
      (statusFilter === 'NOT_GENERATED' && !isGenerated);

    return matchesSearch && matchesPriority && matchesStatus;
  });

  // Calculate Requirement Coverage for detail view
  const acList = getAcList();
  const coveredAcs = acList.filter((ac) => {
    const linkedTcs = getTcsForAc(ac.id, ac.orderIndex, ac.content);
    return linkedTcs.length > 0;
  });
  const coveragePercent =
    acList.length > 0
      ? Math.round((coveredAcs.length / acList.length) * 100)
      : testCases.length > 0
      ? 100
      : 0;

  // Filtered Test Cases for the Test Cases tab
  const displayTestCases = testCases.filter((tc, tcIdx) => {
    if (selectedAcFilter === 'ALL' || selectedAcFilter === '') return true;

    const targetAc = acList.find(
      (a) => String(a.id) === String(selectedAcFilter) || String(a.orderIndex) === String(selectedAcFilter)
    );
    if (!targetAc) return true;

    const linkedTcs = getTcsForAc(targetAc.id, targetAc.orderIndex, targetAc.content);
    return (
      linkedTcs.some((linkedTc) => linkedTc.testCaseId === tc.testCaseId) ||
      tcIdx % acList.length === targetAc.orderIndex - 1
    );
  });

  return (
    <div className="animate-fade-in flex flex-col gap-6 p-2 md:p-6 max-w-7xl mx-auto w-full">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Requirements & User Stories
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold">
              {requirements.length} Stories
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1.5 text-sm text-slate-400">
            <span>Synchronized from Jira Workspace:</span>
            <span className="text-indigo-400 font-semibold">
              {project?.name || project?.projectKey || 'Project'}
            </span>
            <span className="inline-block w-1 h-1 rounded-full bg-slate-600"></span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-bold text-slate-400 uppercase border border-slate-700">
              Live Sync Active
            </span>
          </div>
        </div>

        <button
          onClick={handleSync}
          disabled={isSyncing || !project}
          className="bg-[#0052CC] hover:bg-[#0047B3] active:scale-95 text-white px-4 py-2.5 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
        >
          <RefreshCw size={16} className={isSyncing ? 'animate-spin' : ''} />
          {isSyncing ? 'Syncing Jira...' : 'Sync from Jira'}
        </button>
      </div>

      {/* Toolbar & Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm shadow-md">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[260px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search US key, title, or description..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
          />
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400">Priority:</span>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="ALL">All Priorities</option>
            <option value="HIGH">High Priority</option>
            <option value="MEDIUM">Medium Priority</option>
            <option value="LOW">Low Priority</option>
          </select>
        </div>

        {/* Status Segmented Control */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400">Status:</span>
          <div className="flex bg-slate-950 border border-slate-800 p-1 rounded-lg">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                statusFilter === 'ALL'
                  ? 'bg-slate-800 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter('NOT_GENERATED')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                statusFilter === 'NOT_GENERATED'
                  ? 'bg-slate-800 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Not Generated
            </button>
            <button
              onClick={() => setStatusFilter('GENERATED')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                statusFilter === 'GENERATED'
                  ? 'bg-slate-800 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Generated
            </button>
          </div>
        </div>
      </div>

      {/* User Stories List */}
      <div className="flex flex-col gap-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-slate-900/40 rounded-xl border border-slate-800/80">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent mb-4"></div>
            <p className="text-slate-400 text-sm font-medium">Loading User Stories...</p>
          </div>
        ) : filteredRequirements.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center bg-slate-900/40 rounded-xl border border-slate-800/80 p-6">
            <div className="w-16 h-16 rounded-full bg-slate-800/60 flex items-center justify-center mb-4 text-slate-500">
              <FileText size={32} />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">No Requirements Found</h3>
            <p className="text-slate-400 text-sm max-w-md mb-6">
              {searchTerm || priorityFilter !== 'ALL' || statusFilter !== 'ALL'
                ? 'No user stories match your active search filters. Try resetting your filters.'
                : 'There are no user stories synced for this project. Click "Sync from Jira" to import your backlog.'}
            </p>
            {(searchTerm || priorityFilter !== 'ALL' || statusFilter !== 'ALL') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setPriorityFilter('ALL');
                  setStatusFilter('ALL');
                }}
                className="text-xs font-bold text-indigo-400 hover:text-indigo-300 underline"
              >
                Reset Search Filters
              </button>
            )}
          </div>
        ) : (
          filteredRequirements.map((req) => {
            const acCount = req.acceptanceCriteriaList?.length || 0;
            const isGenerated =
              req.status === 'DONE' || req.status === 'COMPLETED' || req.status === 'GENERATED';
            const priorityUpper = (req.priority || 'MEDIUM').toUpperCase();
            const isCurrentlyGenerating = generatingReqId === req.id;

            return (
              <div
                key={req.id}
                onClick={() => handleOpenDetail(req, 'overview', 'ALL')}
                className="group relative rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900/90 hover:border-slate-700 p-5 transition-all duration-200 shadow-lg hover:shadow-slate-950/50 flex flex-col lg:flex-row lg:items-center justify-between gap-6 cursor-pointer"
              >
                {/* Story Content */}
                <div className="flex-1 space-y-2.5">
                  <div className="flex flex-wrap items-center gap-3">
                    {/* Jira Key Badge */}
                    <span className="bg-[#0052CC] text-white px-2.5 py-0.5 rounded text-[11px] font-black tracking-wide uppercase shadow-sm">
                      {req.requirementKey}
                    </span>

                    {/* US Title */}
                    <h3 className="text-base md:text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                      {req.title}
                    </h3>

                    {/* Status Badge */}
                    {isGenerated ? (
                      <div className="flex items-center gap-1 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                        <CheckCircle2 size={14} />
                        <span>Generated</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                        <Clock size={14} />
                        <span>Not Generated</span>
                      </div>
                    )}
                  </div>

                  {/* Metadata Tags */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="px-2.5 py-1 rounded-full bg-slate-800/80 text-slate-400 text-xs font-medium border border-slate-700/50 flex items-center gap-1">
                      <Layers size={12} />
                      {acCount > 0 ? `${acCount} ACs` : 'Standard AC'}
                    </span>

                    {priorityUpper === 'HIGH' && (
                      <span className="px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 text-xs font-semibold border border-rose-500/20">
                        High Priority
                      </span>
                    )}
                    {priorityUpper === 'MEDIUM' && (
                      <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold border border-amber-500/20">
                        Medium Priority
                      </span>
                    )}
                    {priorityUpper === 'LOW' && (
                      <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 text-xs font-semibold border border-slate-700">
                        Low Priority
                      </span>
                    )}

                    <span className="px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-300 text-xs font-medium border border-indigo-500/20">
                      Type: {req.type || 'User Story'}
                    </span>
                  </div>
                </div>

                {/* Actions Column */}
                <div className="flex items-center sm:flex-row lg:flex-col gap-2.5 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-800/80">
                  <button
                    onClick={(e) => handleGenerateTestCases(req, e)}
                    disabled={isCurrentlyGenerating}
                    className="flex-1 lg:w-48 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 active:scale-95 text-white px-4 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Sparkles size={16} className={isCurrentlyGenerating ? 'animate-spin' : ''} />
                    <span>{isCurrentlyGenerating ? 'Generating...' : 'Generate Test Cases'}</span>
                  </button>

                  <button
                    onClick={(e) => handleOpenDetail(req, 'overview', 'ALL', e)}
                    className="flex-1 lg:w-48 border border-slate-700/80 hover:bg-slate-800 active:scale-95 text-slate-300 px-4 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Eye size={16} />
                    <span>View Detail & TCs</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* User Story Detail Drawer / Modal */}
      {selectedReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div
            className="w-full max-w-3xl h-full bg-slate-900 border-l border-slate-800 flex flex-col shadow-2xl overflow-hidden animate-slide-in-right"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="p-6 border-b border-slate-800 flex items-start justify-between gap-4 bg-slate-950/50">
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2.5">
                  <span className="bg-[#0052CC] text-white px-2.5 py-0.5 rounded text-xs font-black tracking-wide uppercase">
                    {selectedReq.requirementKey}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold">
                    {selectedReq.type || 'User Story'}
                  </span>
                  <span className="text-xs text-slate-400 ml-auto">
                    {testCases.length} Test Cases Total
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white tracking-tight">{selectedReq.title}</h2>
              </div>

              <button
                onClick={() => setSelectedReq(null)}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Navigation Tabs inside Modal */}
            <div className="flex border-b border-slate-800 bg-slate-950/40 px-6">
              <button
                onClick={() => setActiveDetailTab('overview')}
                className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all ${
                  activeDetailTab === 'overview'
                    ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileText size={16} />
                <span>Story Overview & ACs</span>
              </button>

              <button
                onClick={() => setActiveDetailTab('test-cases')}
                className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all ${
                  activeDetailTab === 'test-cases'
                    ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <FlaskConical size={16} />
                <span>
                  Generated Test Cases ({displayTestCases.length}
                  {selectedAcFilter !== 'ALL' ? ' Filtered' : ''})
                </span>
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {isDetailLoading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent mb-3"></div>
                  <p className="text-xs text-slate-400">Loading User Story details & Coverage...</p>
                </div>
              ) : activeDetailTab === 'overview' ? (
                <>
                  {/* Requirement Coverage Progress Card */}
                  <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 shadow-inner space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-slate-300 tracking-wider uppercase">
                        REQUIREMENT COVERAGE
                      </span>
                      <span
                        className={`text-sm font-extrabold ${
                          coveragePercent > 50 ? 'text-emerald-400' : 'text-amber-400'
                        }`}
                      >
                        {coveragePercent}% Covered
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                        style={{ width: `${coveragePercent}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Story Description */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      User Story Description
                    </h4>
                    <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-sm text-slate-300 leading-relaxed font-sans">
                      {selectedReq.description ||
                        reqDetail?.description ||
                        'No detailed description provided for this user story.'}
                    </div>
                  </div>

                  {/* Acceptance Criteria & Linked TCs Coverage */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        ACCEPTANCE CRITERIA
                      </h4>
                      <span className="text-xs text-indigo-400 font-semibold">
                        {acList.length} Total Criteria ({coveredAcs.length} Covered)
                      </span>
                    </div>

                    <div className="space-y-3">
                      {acList.map((ac) => {
                        const linkedTcs = getTcsForAc(ac.id, ac.orderIndex, ac.content);
                        const isCovered = linkedTcs.length > 0;

                        return (
                          <div
                            key={ac.id}
                            className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/90 space-y-3 hover:border-slate-700 transition-colors"
                          >
                            <div className="flex items-start gap-3">
                              {/* Green Check Circle for Covered, Empty Circle for Uncovered */}
                              {isCovered ? (
                                <CheckCircle2 className="text-emerald-400 shrink-0 mt-0.5" size={20} />
                              ) : (
                                <Circle className="text-slate-600 shrink-0 mt-0.5" size={20} />
                              )}

                              <div className="flex-1 space-y-2">
                                <p className="text-sm text-slate-200 font-medium leading-relaxed">
                                  {ac.content}
                                </p>

                                {/* Linked TCs Badge */}
                                <div>
                                  {isCovered ? (
                                    <button
                                      onClick={() => {
                                        setSelectedAcFilter(ac.id);
                                        setActiveDetailTab('test-cases');
                                      }}
                                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold hover:bg-emerald-500/20 active:scale-95 transition-all cursor-pointer"
                                    >
                                      <span>
                                        {linkedTcs.length} TCs Linked (100% Covered)
                                      </span>
                                      <ChevronRight size={14} />
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => {
                                        setSelectedAcFilter(ac.id);
                                        setActiveDetailTab('test-cases');
                                      }}
                                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-bold hover:bg-rose-500/20 active:scale-95 transition-all cursor-pointer"
                                    >
                                      <span>0 TCs Linked (Uncovered)</span>
                                      <ChevronRight size={14} />
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      {acList.length === 0 && (
                        <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/60 text-xs text-slate-500 text-center italic">
                          No acceptance criteria explicitly attached to this story.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Metadata Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-950/40 border border-slate-800 text-xs">
                    <div>
                      <span className="text-slate-500 block mb-1 font-medium">Priority</span>
                      <span className="text-slate-200 font-semibold">
                        {selectedReq.priority || reqDetail?.priority || 'MEDIUM'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block mb-1 font-medium">Status</span>
                      <span className="text-slate-200 font-semibold">
                        {selectedReq.status || reqDetail?.status || 'OPEN'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block mb-1 font-medium">Total Test Cases</span>
                      <span className="text-emerald-400 font-bold">{testCases.length} TCs</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block mb-1 font-medium">Created Date</span>
                      <span className="text-slate-200 font-medium">
                        {selectedReq.createdAt
                          ? new Date(selectedReq.createdAt).toLocaleDateString()
                          : 'N/A'}
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                /* Test Cases Tab with ALL & AC Dropdown Filter */
                <div className="space-y-4">
                  {/* Filter Header for AC selection */}
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3 flex-1 min-w-[280px]">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0">
                        Filter:
                      </span>

                      {/* 1. All Button */}
                      <button
                        onClick={() => setSelectedAcFilter('ALL')}
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all shrink-0 cursor-pointer ${
                          selectedAcFilter === 'ALL'
                            ? 'bg-indigo-600 text-white shadow-sm'
                            : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                        }`}
                      >
                        All ({testCases.length})
                      </button>

                      {/* 2. AC Dropdown */}
                      <div className="flex-1 min-w-[200px]">
                        <select
                          value={selectedAcFilter}
                          onChange={(e) =>
                            setSelectedAcFilter(
                              e.target.value === 'ALL' ? 'ALL' : e.target.value
                            )
                          }
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 font-medium focus:outline-none focus:border-indigo-500 cursor-pointer transition-all truncate"
                        >
                          <option value="ALL">Select Acceptance Criteria (AC)...</option>
                          {acList.map((ac) => {
                            const linkedCount = getTcsForAc(ac.id, ac.orderIndex, ac.content).length;
                            return (
                              <option key={ac.id} value={ac.id}>
                                AC {ac.orderIndex}: {ac.content.length > 50 ? ac.content.slice(0, 50) + '...' : ac.content} ({linkedCount} TCs)
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </div>

                    {selectedAcFilter !== 'ALL' && (
                      <button
                        onClick={() => setSelectedAcFilter('ALL')}
                        className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold underline shrink-0"
                      >
                        Reset Filter
                      </button>
                    )}

                    {selectedTestCaseIds.length > 0 && (
                      <button
                        onClick={handleOpenAddToSuite}
                        className="animate-fade-in flex items-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3 py-1.5 text-xs transition shrink-0 cursor-pointer"
                      >
                        Add to Test Suite ({selectedTestCaseIds.length})
                      </button>
                    )}
                  </div>

                  {displayTestCases.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center bg-slate-950/40 rounded-xl border border-slate-800 p-6">
                      <FlaskConical size={36} className="text-slate-600 mb-3" />
                      <h4 className="text-sm font-bold text-white mb-1">
                        {selectedAcFilter === 'ALL'
                          ? 'No Test Cases Generated Yet'
                          : 'No Test Cases Linked to this AC'}
                      </h4>
                      <p className="text-xs text-slate-400 max-w-sm mb-4">
                        {selectedAcFilter === 'ALL'
                          ? 'This User Story does not have any test cases generated yet.'
                          : 'No test scenarios cover this specific Acceptance Criteria currently.'}
                      </p>
                      <button
                        onClick={() => handleGenerateDrawerTestCases(selectedReq)}
                        disabled={generatingReqId === selectedReq.id}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        <Sparkles size={14} className={generatingReqId === selectedReq.id ? 'animate-spin' : ''} />
                        <span>{generatingReqId === selectedReq.id ? 'Generating...' : 'Generate Test Cases Now'}</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {displayTestCases.map((tc) => {
                        const isExpanded = expandedTcId === tc.testCaseId;
                        const priorityUpper = (tc.priority || 'MEDIUM').toUpperCase();

                        return (
                          <div
                            key={tc.testCaseId}
                            className="rounded-xl border border-slate-800 bg-slate-900/80 overflow-hidden transition-all shadow-md"
                          >
                            {/* Card Header & Title */}
                            <div
                              onClick={() => setExpandedTcId(isExpanded ? null : tc.testCaseId)}
                              className="p-5 cursor-pointer hover:bg-slate-850/50 transition-colors space-y-3"
                            >
                              {/* Row 1: Checkbox icon, TC ID badge, Priority badge, Expand arrow */}
                              <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2.5">
                                  {/* Checkbox Icon */}
                                  <div
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleToggleSelectTestCase(tc.testCaseId);
                                    }}
                                    className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 cursor-pointer transition ${
                                      selectedTestCaseIds.includes(tc.testCaseId)
                                        ? 'bg-indigo-600 border-indigo-500 text-white'
                                        : 'bg-slate-900/45 border-slate-750 text-transparent hover:border-slate-500'
                                    }`}
                                  >
                                    <Check size={13} className="stroke-[3]" />
                                  </div>

                                  {/* TC Code Badge */}
                                  <span className="bg-slate-800 text-indigo-300 border border-slate-700/80 px-2.5 py-0.5 rounded text-xs font-mono font-bold tracking-wide">
                                    {tc.testCaseCode}
                                  </span>

                                  {/* Priority Pill Badge */}
                                  {priorityUpper === 'HIGH' && (
                                    <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[11px] font-bold flex items-center gap-1.5">
                                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                                      HIGH
                                    </span>
                                  )}
                                  {priorityUpper === 'MEDIUM' && (
                                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[11px] font-bold flex items-center gap-1.5">
                                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                                      MEDIUM
                                    </span>
                                  )}
                                  {priorityUpper === 'LOW' && (
                                    <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 text-[11px] font-bold flex items-center gap-1.5">
                                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                                      LOW
                                    </span>
                                  )}
                                </div>

                                <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                                  <button
                                    onClick={() => setHistoryModalTc({ id: tc.testCaseId, code: tc.testCaseCode, title: tc.title })}
                                    className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-bold px-2.5 py-1 rounded transition cursor-pointer border border-slate-700"
                                  >
                                    <History size={11} /> History Run
                                  </button>
                                  <button
                                    onClick={() => handleRunTestCase(tc)}
                                    disabled={runningTestCases[tc.testCaseId]}
                                    className={`flex items-center gap-1.5 text-white text-[11px] font-bold px-2.5 py-1 rounded transition cursor-pointer ${
                                      runningTestCases[tc.testCaseId]
                                        ? 'bg-slate-800 border border-slate-700 opacity-70 cursor-not-allowed text-slate-400'
                                        : 'bg-indigo-600/80 hover:bg-indigo-600'
                                    }`}
                                  >
                                    {runningTestCases[tc.testCaseId] ? (
                                      <div className="animate-spin rounded-full h-3 w-3 border-2 border-indigo-400 border-t-transparent"></div>
                                    ) : (
                                      <Play size={11} fill="currentColor" />
                                    )}
                                    <span>{runningTestCases[tc.testCaseId] ? 'Running...' : 'Run Test'}</span>
                                  </button>
                                  <span className="text-slate-400 p-1 hover:text-white transition-colors cursor-pointer" onClick={() => setExpandedTcId(isExpanded ? null : tc.testCaseId)}>
                                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                  </span>
                                </div>
                              </div>

                              {/* Row 2: Big Summary Title */}
                              <h4 className="text-base md:text-lg font-bold text-white leading-snug">
                                {tc.title}
                              </h4>
                            </div>

                            {/* Card Body */}
                            {isExpanded && (
                              <div className="px-5 pb-6 pt-2 border-t border-slate-800/80 bg-slate-950/70 space-y-5 text-xs">
                                {/* Section 1: PRECONDITIONS */}
                                <div className="space-y-1.5">
                                  <div className="flex items-center justify-between">
                                    <h5 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                                      PRECONDITIONS
                                    </h5>
                                    <button
                                      onClick={() => handleOpenEdit(tc, 'precondition')}
                                      className="flex items-center gap-1 text-slate-400 hover:text-white text-[10px] px-2 py-1 rounded border border-slate-700 hover:border-slate-600 transition cursor-pointer"
                                    >
                                      <Edit3 size={10} /> Edit
                                    </button>
                                  </div>
                                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs leading-relaxed font-sans">
                                    {tc.precondition && tc.precondition.trim() !== ''
                                      ? tc.precondition
                                      : 'User is on the relevant page and has a valid active account.'}
                                  </div>
                                </div>

                                {/* Section 2: TEST STEPS Table */}
                                <div className="space-y-1.5">
                                  <div className="flex items-center justify-between">
                                    <h5 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                                      TEST STEPS
                                    </h5>
                                    <button
                                      onClick={() => handleOpenEdit(tc, 'steps')}
                                      className="flex items-center gap-1 text-slate-400 hover:text-white text-[10px] px-2 py-1 rounded border border-slate-700 hover:border-slate-600 transition cursor-pointer"
                                    >
                                      <Edit3 size={10} /> Edit
                                    </button>
                                  </div>
                                  <div className="rounded-xl border border-slate-800 overflow-hidden bg-slate-900/90">
                                    <table className="w-full text-left border-collapse">
                                      <thead>
                                        <tr className="border-b border-slate-800 bg-slate-950/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                          <th className="py-2.5 px-4 w-12 text-center">#</th>
                                          <th className="py-2.5 px-4">Action Description</th>
                                          <th className="py-2.5 px-4">Expected Result</th>
                                        </tr>
                                      </thead>
                                      <tbody className="divide-y divide-slate-800/60 font-sans text-xs">
                                        {tc.steps && tc.steps.length > 0 ? (
                                          tc.steps.map((st: any, idx: number) => (
                                            <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                                              <td className="py-3 px-4 text-center font-bold text-indigo-400 border-r border-slate-800/40">
                                                {st.stepOrder || idx + 1}
                                              </td>
                                              <td className="py-3 px-4 text-slate-200 leading-relaxed border-r border-slate-800/40">
                                                {st.actionDescription || st.action || 'Execute step action'}
                                              </td>
                                              <td className="py-3 px-4 text-slate-400 leading-relaxed">
                                                {st.expectedResult || st.expected || 'Step completes successfully'}
                                              </td>
                                            </tr>
                                          ))
                                        ) : (
                                          <tr>
                                            <td colSpan={3} className="py-4 px-4 text-center text-slate-500 italic">
                                              No test steps defined.
                                            </td>
                                          </tr>
                                        )}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>

                                {/* Section 3: EXPECTED RESULT (Overall TC expected result) */}
                                <div className="space-y-1.5">
                                  <div className="flex items-center justify-between">
                                    <h5 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                                      EXPECTED RESULT
                                    </h5>
                                    <button
                                      onClick={() => handleOpenEdit(tc, 'expectedResult')}
                                      className="flex items-center gap-1 text-slate-400 hover:text-white text-[10px] px-2 py-1 rounded border border-slate-700 hover:border-slate-600 transition cursor-pointer"
                                    >
                                      <Edit3 size={10} /> Edit
                                    </button>
                                  </div>
                                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-emerald-300 text-xs leading-relaxed font-sans font-medium">
                                    {tc.expectedResult && tc.expectedResult.trim() !== ''
                                      ? tc.expectedResult
                                      : 'System completes request successfully and updates UI as expected.'}
                                  </div>
                                </div>

                                {/* Section 4: ACTUAL RESULT */}
                                {tc.actualResult && tc.actualResult.trim() !== '' && (
                                  <div className="space-y-1.5">
                                    <h5 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                                      ACTUAL RESULT
                                    </h5>
                                    <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs leading-relaxed font-sans">
                                      {tc.actualResult}
                                    </div>
                                  </div>
                                )}

                                {/* Section 5: TEST DATA */}
                                {tc.testData && tc.testData.length > 0 && (
                                  <div className="space-y-1.5 animate-fade-in">
                                    <div className="flex items-center justify-between">
                                      <h5 className="text-[11px] font-extrabold text-indigo-400 uppercase tracking-wider">
                                        TEST DATA
                                      </h5>
                                      <button
                                        onClick={() => handleOpenEdit(tc, 'testData')}
                                        className="flex items-center gap-1 text-slate-400 hover:text-white text-[10px] px-2 py-1 rounded border border-slate-700 hover:border-slate-600 transition cursor-pointer"
                                      >
                                        <Edit3 size={10} /> Edit
                                      </button>
                                    </div>
                                    <div className="rounded-xl border border-slate-800 overflow-hidden bg-slate-900/90 shadow-inner">
                                      <table className="w-full text-left border-collapse">
                                        <thead>
                                          <tr className="border-b border-slate-800 bg-slate-950/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                            <th className="py-2.5 px-4 w-1/3">Data Name</th>
                                            <th className="py-2.5 px-4 w-1/3">Input Value</th>
                                            <th className="py-2.5 px-4 w-1/3">Expected Criteria</th>
                                          </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-800/60 font-sans text-xs">
                                          {tc.testData.map((td: any, idx: number) => (
                                            <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                                              <td className="py-3 px-4 font-semibold text-slate-200">{td.dataName}</td>
                                              <td className="py-3 px-4 font-mono text-emerald-400 break-all">{String(td.inputData || '')}</td>
                                              <td className="py-3 px-4 text-slate-400">{td.expectedData || '-'}</td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                )}

                                {/* Section 6: TEST SCRIPT */}
                                {tc.scripts && tc.scripts.length > 0 && (
                                  <div className="space-y-1.5 animate-fade-in">
                                    <div className="flex items-center justify-between">
                                      <h5 className="text-[11px] font-extrabold text-indigo-400 uppercase tracking-wider">
                                        TEST SCRIPT ({tc.scripts[0].framework || 'playwright'})
                                      </h5>
                                      <div className="flex items-center gap-2">
                                        <button
                                          onClick={() => handleOpenEdit(tc, 'scripts')}
                                          className="flex items-center gap-1 text-slate-400 hover:text-white text-[10px] px-2 py-1 rounded border border-slate-700 hover:border-slate-600 transition cursor-pointer"
                                        >
                                          <Edit3 size={10} /> Edit
                                        </button>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            navigator.clipboard.writeText(tc.scripts![0].scriptContent || '');
                                            alert('Successfully copied test script to clipboard!');
                                          }}
                                          className="text-[10px] bg-slate-800 hover:bg-slate-700 text-indigo-300 font-bold px-2.5 py-1 rounded border border-slate-700 transition cursor-pointer active:scale-95"
                                        >
                                          Copy Script
                                        </button>
                                      </div>
                                    </div>
                                    <pre className="p-4 rounded-xl bg-slate-950/80 border border-slate-850 text-indigo-300 text-[11px] overflow-x-auto font-mono max-h-60 custom-scrollbar leading-relaxed">
                                      {tc.scripts[0].scriptContent || '// Empty script content'}
                                    </pre>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editModal.visible && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setEditModal({ visible: false, field: 'precondition', tc: null })}>
          <div className="w-full max-w-2xl rounded-xl border border-gray-800 bg-gray-900 p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white capitalize">
                Edit {editModal.field.replace(/([A-Z])/g, " $1")}
                <span className="ml-2 text-indigo-400 text-sm font-mono">{editModal.tc?.testCaseCode}</span>
              </h3>
              <button onClick={() => setEditModal({ visible: false, field: 'precondition', tc: null })} className="text-gray-400 hover:text-white p-1"><X size={20} /></button>
            </div>
            
            <div className="space-y-4">
              {editModal.field === 'steps' && (
                <div className="space-y-3">
                  {(editFormData.steps || []).map((step: any, idx: number) => (
                    <div key={step.stepId || idx} className="grid grid-cols-12 gap-3 p-3 rounded-lg bg-gray-950/50 border border-gray-800">
                      <div className="col-span-2">
                        <label className="block text-xs font-semibold text-gray-400 mb-1">Order</label>
                        <input
                          type="number"
                          value={step.stepOrder || idx + 1}
                          onChange={(e) => {
                            const newSteps = [...editFormData.steps];
                            newSteps[idx].stepOrder = parseInt(e.target.value) || idx + 1;
                            setEditFormData({ ...editFormData, steps: newSteps });
                          }}
                          className="w-full rounded-md border border-gray-800 bg-gray-900 px-3 py-1.5 text-sm text-gray-200 focus:border-indigo-500 focus:outline-none"
                        />
                      </div>
                      <div className="col-span-5">
                        <label className="block text-xs font-semibold text-gray-400 mb-1">Action Description</label>
                        <textarea
                          value={step.actionDescription || ''}
                          onChange={(e) => {
                            const newSteps = [...editFormData.steps];
                            newSteps[idx].actionDescription = e.target.value;
                            setEditFormData({ ...editFormData, steps: newSteps });
                          }}
                          className="w-full rounded-md border border-gray-800 bg-gray-900 px-3 py-1.5 text-sm text-gray-200 focus:border-indigo-500 focus:outline-none resize-none"
                          rows={2}
                        />
                      </div>
                      <div className="col-span-5">
                        <label className="block text-xs font-semibold text-gray-400 mb-1">Expected Result</label>
                        <textarea
                          value={step.expectedResult || ''}
                          onChange={(e) => {
                            const newSteps = [...editFormData.steps];
                            newSteps[idx].expectedResult = e.target.value;
                            setEditFormData({ ...editFormData, steps: newSteps });
                          }}
                          className="w-full rounded-md border border-gray-800 bg-gray-900 px-3 py-1.5 text-sm text-gray-200 focus:border-indigo-500 focus:outline-none resize-none"
                          rows={2}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {editModal.field === 'testData' && (
                <div className="space-y-3">
                  {(editFormData.testData || []).map((td: any, idx: number) => (
                    <div key={td.testDataId || idx} className="grid grid-cols-12 gap-3 p-3 rounded-lg bg-gray-950/50 border border-gray-800">
                      <div className="col-span-4">
                        <label className="block text-xs font-semibold text-gray-400 mb-1">Data Name</label>
                        <input
                          type="text"
                          value={td.dataName || ''}
                          onChange={(e) => {
                            const newData = [...editFormData.testData];
                            newData[idx].dataName = e.target.value;
                            setEditFormData({ ...editFormData, testData: newData });
                          }}
                          className="w-full rounded-md border border-gray-800 bg-gray-900 px-3 py-1.5 text-sm text-gray-200 focus:border-indigo-500 focus:outline-none"
                        />
                      </div>
                      <div className="col-span-4">
                        <label className="block text-xs font-semibold text-gray-400 mb-1">Input Data</label>
                        <input
                          type="text"
                          value={td.inputData || ''}
                          onChange={(e) => {
                            const newData = [...editFormData.testData];
                            newData[idx].inputData = e.target.value;
                            setEditFormData({ ...editFormData, testData: newData });
                          }}
                          className="w-full rounded-md border border-gray-800 bg-gray-900 px-3 py-1.5 text-sm text-gray-200 focus:border-indigo-500 focus:outline-none"
                        />
                      </div>
                      <div className="col-span-4">
                        <label className="block text-xs font-semibold text-gray-400 mb-1">Expected Data</label>
                        <input
                          type="text"
                          value={td.expectedData || ''}
                          onChange={(e) => {
                            const newData = [...editFormData.testData];
                            newData[idx].expectedData = e.target.value;
                            setEditFormData({ ...editFormData, testData: newData });
                          }}
                          className="w-full rounded-md border border-gray-800 bg-gray-900 px-3 py-1.5 text-sm text-gray-200 focus:border-indigo-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {editModal.field === 'scripts' && (
                <textarea
                  value={editFormData.scriptContent || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, scriptContent: e.target.value })}
                  className="w-full min-h-[300px] rounded-lg border border-gray-800 bg-gray-950 px-4 py-3 font-mono text-sm text-gray-200 focus:border-indigo-500 focus:outline-none resize-y"
                  placeholder="Enter script content..."
                  rows={12}
                />
              )}

              {editModal.field === 'precondition' && (
                <textarea
                  value={editFormData.value || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, value: e.target.value })}
                  className="w-full min-h-[200px] rounded-lg border border-gray-800 bg-gray-950 px-4 py-3 font-mono text-sm text-gray-200 focus:border-indigo-500 focus:outline-none resize-y"
                  placeholder="Enter precondition..."
                  rows={6}
                />
              )}

              {editModal.field === 'expectedResult' && (
                <textarea
                  value={editFormData.value || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, value: e.target.value })}
                  className="w-full min-h-[200px] rounded-lg border border-gray-800 bg-gray-950 px-4 py-3 font-mono text-sm text-gray-200 focus:border-indigo-500 focus:outline-none resize-y"
                  placeholder="Enter expected result..."
                  rows={6}
                />
              )}

              {editModal.field === 'title' && (
                <input
                  type="text"
                  value={editFormData.value || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, value: e.target.value })}
                  className="w-full rounded-lg border border-gray-800 bg-gray-950 px-4 py-3 text-sm text-gray-200 focus:border-indigo-500 focus:outline-none"
                  placeholder="Enter test case title..."
                />
              )}
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => setEditModal({ visible: false, field: 'precondition', tc: null })} className="rounded-lg bg-gray-800 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition">
                Cancel
              </button>
              <button onClick={handleSaveEdit} disabled={isSaving} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition disabled:opacity-50 flex items-center gap-2">
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add to Suite Modal */}
      {isAddToSuiteModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setIsAddToSuiteModalOpen(false)}>
          <div className="w-full max-w-md rounded-xl border border-gray-800 bg-gray-900 p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">
                {isCreateMode ? 'Create New Test Suite' : 'Add to Test Suite'}
              </h3>
              <button onClick={() => setIsAddToSuiteModalOpen(false)} className="text-gray-400 hover:text-white p-1"><X size={20} /></button>
            </div>

            <div className="space-y-4">
              {!isCreateMode ? (
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Select Test Suite</label>
                  <select
                    value={selectedSuiteId || ''}
                    onChange={(e) => setSelectedSuiteId(Number(e.target.value) || null)}
                    className="w-full rounded-lg border border-gray-800 bg-gray-950 px-4 py-2.5 text-sm text-gray-200 focus:border-indigo-500 focus:outline-none cursor-pointer"
                  >
                    <option value="">Select a suite...</option>
                    {testSuites.map((suite) => (
                      <option key={suite.suiteId} value={suite.suiteId}>
                        {suite.suiteName}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">Suite Name</label>
                    <input
                      type="text"
                      value={newSuiteName}
                      onChange={(e) => setNewSuiteName(e.target.value)}
                      className="w-full rounded-lg border border-gray-800 bg-gray-950 px-4 py-2.5 text-sm text-gray-200 focus:border-indigo-500 focus:outline-none"
                      placeholder="Enter suite name..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">Description (Optional)</label>
                    <textarea
                      value={newSuiteDescription}
                      onChange={(e) => setNewSuiteDescription(e.target.value)}
                      className="w-full rounded-lg border border-gray-800 bg-gray-950 px-4 py-2.5 text-sm text-gray-200 focus:border-indigo-500 focus:outline-none resize-none"
                      placeholder="Enter description..."
                      rows={3}
                    />
                  </div>
                </>
              )}

              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400">Or:</span>
                <button
                  onClick={() => {
                    setIsCreateMode(!isCreateMode);
                    setSelectedSuiteId(null);
                  }}
                  className="text-indigo-400 hover:text-indigo-300 font-semibold"
                >
                  {isCreateMode ? 'Select existing suite instead' : 'Create new test suite'}
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setIsAddToSuiteModalOpen(false)} className="rounded-lg bg-gray-800 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition">
                Cancel
              </button>
              <button
                onClick={handleAddToSuiteSubmit}
                disabled={isSubmitting || isCreatingSuite}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition disabled:opacity-50"
              >
                {isSubmitting || isCreatingSuite ? 'Saving...' : (isCreateMode ? 'Create Suite & Add TCs' : 'Add to Suite')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notifications */}
      <div className="fixed bottom-4 right-4 z-[200] space-y-2 max-w-sm">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className="animate-fade-in flex items-start gap-3 p-4 rounded-xl border shadow-2xl backdrop-blur-sm"
            style={{
              backgroundColor: notif.passed ? 'rgba(6, 78, 59, 0.95)' : 'rgba(127, 29, 29, 0.95)',
              borderColor: notif.passed ? '#065f46' : '#7f1d1d',
            }}
          >
            <div className="shrink-0 mt-0.5">
              {notif.passed ? (
                <CheckCircle2 size={20} className="text-emerald-400" />
              ) : (
                <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center">
                  <X size={14} className="text-red-400" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-xs font-bold text-white">{notif.testCaseCode}</span>
              </div>
              <p className="text-xs text-slate-300 break-words">{notif.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};