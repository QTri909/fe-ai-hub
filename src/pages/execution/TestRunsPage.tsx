import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, CheckCircle2, XCircle, Clock, ChevronRight, Loader2 } from 'lucide-react';
import { testRunApi, TestRun } from '@/features/project/api/testRuns.api';

export function TestRunsPage() {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const [runs, setRuns] = useState<TestRun[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (projectId) {
            testRunApi.getRunsByProject(projectId).then(res => {
                setRuns(res);
                setLoading(false);
            });
        }
    }, [projectId]);

    const formatDuration = (ms: number) => {
        if (!ms) return '-';
        const s = Math.floor(ms / 1000);
        const m = Math.floor(s / 60);
        return `${m.toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;
    };

    if (loading) return <div className="p-8 text-center text-gray-500"><Loader2 className="animate-spin inline-block mr-2"/> Loading Test Runs...</div>;

    return (
        <div className="p-8 max-w-[1400px] mx-auto text-slate-900 min-h-screen bg-slate-50">
            <div className="flex justify-between items-center my-6">
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Test Runs</h1>
                <button 
                    onClick={() => navigate(`/project/${projectId}/runner`)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-5 rounded-xl shadow-md shadow-blue-200 text-sm transition-all"
                >
                    <Play size={18} fill="currentColor" />
                    Create Test Run
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-6">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-white text-slate-500 font-semibold text-xs tracking-wider uppercase border-b border-slate-100">
                        <tr>
                            <th className="py-4 px-6 cursor-pointer hover:text-slate-700">Run ID <span className="text-[10px] text-slate-400 inline-block ml-1">◆</span></th>
                            <th className="py-4 px-6 cursor-pointer hover:text-slate-700">Suite <span className="text-[10px] text-slate-400 inline-block ml-1">◆</span></th>
                            <th className="py-4 px-6 cursor-pointer hover:text-slate-700">Environment <span className="text-[10px] text-slate-400 inline-block ml-1">◆</span></th>
                            <th className="py-4 px-6 text-center cursor-pointer hover:text-slate-700">Total <span className="text-[10px] text-slate-400 inline-block ml-1">◆</span></th>
                            <th className="py-4 px-6 text-center cursor-pointer hover:text-slate-700">Passed <span className="text-[10px] text-slate-400 inline-block ml-1">◆</span></th>
                            <th className="py-4 px-6 text-center cursor-pointer hover:text-slate-700">Failed <span className="text-[10px] text-slate-400 inline-block ml-1">◆</span></th>
                            <th className="py-4 px-6 cursor-pointer hover:text-slate-700">Status <span className="text-[10px] text-slate-400 inline-block ml-1">◆</span></th>
                            <th className="py-4 px-6 cursor-pointer hover:text-slate-700">Started At <span className="text-[10px] text-slate-400 inline-block ml-1">◆</span></th>
                            <th className="py-4 px-6 text-right"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                        {runs.length === 0 && (
                            <tr>
                                <td colSpan={9} className="p-8 text-center text-gray-400">No test runs found.</td>
                            </tr>
                        )}
                        {runs.map(run => (
                            <tr key={run.runId} className="hover:bg-slate-50/50 transition group cursor-pointer border-b border-slate-100 last:border-b-0" onClick={() => navigate(`/project/${projectId}/test-runs/${run.runId}`)}>
                                <td className="py-4 px-6 font-bold text-blue-600">RUN-{run.runId.toString().padStart(3, '0')}</td>
                                <td className="py-4 px-6 font-medium text-slate-600">{run.testSuite.suiteName}</td>
                                <td className="py-4 px-6">
                                    <span className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-100 text-blue-700 font-semibold px-2.5 py-1 rounded-lg text-xs w-max">
                                        <span className="w-3 h-3 rounded-sm border border-blue-600 flex items-center justify-center">
                                            <span className="w-1.5 h-1.5 bg-blue-600 rounded-sm"></span>
                                        </span>
                                        {run.environment}
                                    </span>
                                </td>
                                <td className="py-4 px-6 text-center font-bold text-slate-800">{run.totalTests || 0}</td>
                                <td className="py-4 px-6 text-center font-bold text-emerald-600">{run.passedCount || 0}</td>
                                <td className="py-4 px-6 text-center font-bold text-red-600">{run.failedCount || 0}</td>
                                <td className="py-4 px-6">
                                    {run.status === 'COMPLETED' ? (
                                        <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-600 border border-emerald-100 text-xs font-bold px-3 py-1 rounded-full w-max">
                                            <CheckCircle2 size={14} className="text-emerald-500 fill-white" /> Passed
                                        </span>
                                    ) : run.status === 'FAILED' ? (
                                        <span className="inline-flex items-center gap-1.5 bg-red-50 text-red-600 border border-red-100 text-xs font-bold px-3 py-1 rounded-full w-max">
                                            <XCircle size={14} className="text-red-500 fill-white" /> Failed
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold px-3 py-1 rounded-full w-max">
                                            <Loader2 size={14} className="animate-spin" /> {run.status}
                                        </span>
                                    )}
                                </td>
                                <td className="py-4 px-6 text-slate-500 font-medium">
                                    {new Date(run.startTime).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                </td>
                                <td className="py-4 px-6 text-right">
                                    <ChevronRight size={20} className="text-blue-500 inline-block" />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
