const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'pages', 'requirements', 'RequirementsPage.tsx');
let c = fs.readFileSync(filePath, 'utf8');

// 1. Add edit modal states after projectBaseUrl line
c = c.replace(
  'const [projectBaseUrl, setProjectBaseUrl]',
  'const [editModal, setEditModal] = useState({visible:false,field:"",tc:null});\nconst [editFormData, setEditFormData] = useState({value:""});\nconst [isSaving, setIsSaving] = useState(false);\n\nconst [projectBaseUrl, setProjectBaseUrl]'
);

// 2. Add addEditNotification before addNotification
c = c.replace(
  'const addNotification = (testCaseCode: string, passed: boolean, message: string) => {',
  'const addEditNotification = (tcCode: string, success: boolean, message: string) => {\n    const id = Math.random().toString(36).substring(2, 9);\n    setNotifications(prev => [...prev, { id, testCaseCode: tcCode, passed: success, message }]);\n    setTimeout(() => {\n      setNotifications(prev => prev.filter(n => n.id !== id));\n    }, 10000);\n  };\n\n  const addNotification = (testCaseCode: string, passed: boolean, message: string) => {'
);

// 3. Add handleSaveEdit and openEditModal before handleRunTestCase
c = c.replace(
  'const handleRunTestCase = async (tc: TestCase) => {',
  'const handleSaveEdit = async () => {\n    if (!editModal.tc || !editModal.field) return;\n    const tcData = editModal.tc;\n    setIsSaving(true);\n    try {\n      if (editModal.field === "precondition") {\n        await testCaseApi.updateTestCase(tcData.testCaseId, { precondition: editFormData.value });\n      } else if (editModal.field === "expectedResult") {\n        await testCaseApi.updateTestCase(tcData.testCaseId, { expectedResult: editFormData.value });\n      } else if (editModal.field === "title") {\n        await testCaseApi.updateTestCase(tcData.testCaseId, { title: editFormData.value });\n      }\n      if (selectedReq) {\n        const updatedCases = await fetchTestCasesWithSteps(selectedReq.id);\n        setTestCases(updatedCases);\n      }\n      setEditModal({ visible: false, field: "", tc: null });\n      setEditFormData({});\n      addEditNotification(tcData.testCaseCode, true, editModal.field + " updated successfully!");\n    } catch (error: any) {\n      console.error("Failed to save edit:", error);\n      const errMsg = error.response?.data?.message || error.message || "Failed to save changes.";\n      addEditNotification(tcData.testCaseCode, false, errMsg);\n    } finally {\n      setIsSaving(false);\n    }\n  };\n\n  const openEditModal = (tc: any, field: string) => {\n    let value = "";\n    if (field === "precondition") value = tc.precondition || "";\n    else if (field === "expectedResult") value = tc.expectedResult || "";\n    else if (field === "title") value = tc.title || "";\n    setEditFormData({ value });\n    setEditModal({ visible: true, field, tc });\n  };\n\n  const handleRunTestCase = async (tc: TestCase) => {'
);

// 4. Add Edit button to PRECONDITIONS header
c = c.replace(
  '<h5 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">\n                                    PRECONDITIONS\n                                  </h5>',
  '<h5 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center justify-between">\n                                    <span>PRECONDITIONS</span>\n                                    <button onClick={(e) => { e.stopPropagation(); openEditModal(tc, "precondition"); }} className="text-slate-400 hover:text-indigo-400 transition p-1"><Edit3 size={13} /></button>\n                                  </h5>'
);

// 5. Add Edit button to EXPECTED RESULT header
c = c.replace(
  '<h5 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">\n                                    EXPECTED RESULT\n                                  </h5>',
  '<h5 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center justify-between">\n                                    <span>EXPECTED RESULT</span>\n                                    <button onClick={(e) => { e.stopPropagation(); openEditModal(tc, "expectedResult"); }} className="text-slate-400 hover:text-indigo-400 transition p-1"><Edit3 size={13} /></button>\n                                  </h5>'
);

// 6. Add Edit Modal JSX before Drawer Footer Actions
c = c.replace(
  '            {/* Drawer Footer Actions */}',
  '            {/* Edit Modal */}\n            {editModal.visible && (\n              <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setEditModal({visible:false,field:"",tc:null})}>\n                <div className="w-full max-w-2xl rounded-xl border border-gray-800 bg-gray-900 p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>\n                  <div className="flex items-center justify-between mb-4">\n                    <h3 className="text-lg font-bold text-white capitalize">\n                      Edit {editModal.field.replace(/([A-Z])/g, " $1")}\n                      <span className="ml-2 text-indigo-400 text-sm font-mono">{editModal.tc?.testCaseCode}</span>\n                    </h3>\n                    <button onClick={() => setEditModal({visible:false,field:"",tc:null})} className="text-gray-400 hover:text-white p-1"><X size={20} /></button>\n                  </div>\n                  <textarea\n                    value={editFormData.value || ""}\n                    onChange={(e) => setEditFormData({ value: e.target.value })}\n                    className="w-full min-h-[200px] rounded-lg border border-gray-800 bg-gray-950 px-4 py-3 font-mono text-sm text-gray-200 focus:border-indigo-500 focus:outline-none resize-y"\n                    placeholder={"Enter " + editModal.field + "..."}\n                    rows={8}\n                  />\n                  <div className="flex justify-end gap-3 mt-4">\n                    <button onClick={() => setEditModal({visible:false,field:"",tc:null})} className="rounded-lg bg-gray-800 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition">\n                      Cancel\n                    </button>\n                    <button onClick={handleSaveEdit} disabled={isSaving} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition disabled:opacity-50 flex items-center gap-2">\n                      {isSaving ? "Saving..." : "Save Changes"}\n                    </button>\n                  </div>\n                </div>\n              </div>\n            )}\n\n            {/* Drawer Footer Actions */}'
);

fs.writeFileSync(filePath, c, 'utf8');
console.log('Edit modal functionality added successfully!');
console.log('File length:', c.length);
console.log('Has editModal:', c.includes('editModal'));
console.log('Has openEditModal:', c.includes('openEditModal'));
console.log('Has handleSaveEdit:', c.includes('handleSaveEdit'));
console.log('Has addEditNotification:', c.includes('addEditNotification'));