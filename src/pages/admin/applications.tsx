"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/src/pages/dashboard";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { useToast } from "@/src/hooks/use-toast";
import { Loader2, X, ChevronLeft, ChevronRight, CheckCircle2, XCircle } from "lucide-react";
import * as studentActions from "@/src/Actions/studentActions";
import { useSelector } from "react-redux";
import { RootState } from "@/src/state/store";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import StudentIDCard from "@/src/components/StudentIdCard";

type SortConfig = {
  key: string;
  direction: 'asc' | 'desc';
};

export default function ApplicationsPage() {
  const { user, loading } = useSelector((state: RootState) => state.auth);
  const [applications, setApplications] = useState<any[]>([]);
  const [fetchingData, setFetchingData] = useState(true);
  const [processing, setProcessing] = useState<boolean>(false);
  
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [drawerTab, setDrawerTab] = useState<'details' | 'preview'>('details');
  const [previewFace, setPreviewFace] = useState<'front' | 'back'>('front');
  
  const { toast } = useToast();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;
  
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch all students and filter locally for now to find "Applications"
      // Applications = Profile complete but verificationStatus is 'pending' or missing/falsy
      const studentsData = await studentActions.getAllStudents();
      
      const pendingApps = studentsData.filter(s => {
        const isComplete = s.full_name && s.studentId && s.program; // Add other validation requirements as needed
        const isPending = !s.verificationStatus || s.verificationStatus === 'pending';
        return isComplete && isPending && !s.isVerified;
      });

      // Add a mock application for testing if empty
      if (pendingApps.length === 0) {
        pendingApps.push({
          _id: "mock-app-1",
          userId: "mock-user-app-1",
          full_name: "John Smith",
          email: "john.smith@university.edu",
          program: "Cyber Security",
          study_year: 2,
          sex: "M",
          studentId: "CYB10293",
          stateOfOrigin: "Abuja",
          dob: "2004-11-22",
          phone: "08123456789",
          verificationStatus: "pending",
          isVerified: false,
          createdAt: new Date().toISOString()
        });
      }

      setApplications(pendingApps);
    } catch (err: any) {
      toast({ title: "Error fetching data", description: err.message, variant: "destructive" });
    } finally {
      setFetchingData(false);
    }
  };

  const handleBulkAction = async (action: 'approve' | 'reject') => {
    if (selectedRows.size === 0) return;
    
    setProcessing(true);
    const userIds = Array.from(selectedRows);
    
    try {
      await studentActions.bulkActionApplications(userIds, action);
      
      // Update local state
      setApplications(applications.filter(app => !userIds.includes(app.userId || app._id)));
      setSelectedRows(new Set());
      setSelectedStudent(null);
      
      toast({ 
        title: `Successfully ${action}d ${userIds.length} application(s)`,
        className: action === 'approve' ? 'bg-green-50 text-green-900 border-green-200' : 'bg-red-50 text-red-900 border-red-200'
      });
    } catch (err: any) {
      toast({ title: `Error ${action}ing applications`, description: err.message, variant: "destructive" });
    } finally {
      setProcessing(false);
    }
  };

  const toggleRowSelection = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    e.stopPropagation();
    const newSelection = new Set(selectedRows);
    if (e.target.checked) {
      newSelection.add(id);
    } else {
      newSelection.delete(id);
    }
    setSelectedRows(newSelection);
  };

  const toggleAllSelection = (e: React.ChangeEvent<HTMLInputElement>, currentItems: any[]) => {
    if (e.target.checked) {
      const allIds = currentItems.map(item => item.userId || item._id);
      setSelectedRows(new Set([...Array.from(selectedRows), ...allIds]));
    } else {
      const itemsToRemove = new Set(currentItems.map(item => item.userId || item._id));
      const newSelection = new Set(Array.from(selectedRows).filter(id => !itemsToRemove.has(id)));
      setSelectedRows(newSelection);
    }
  };

  // Sorting Logic
  const sortedApplications = [...applications].sort((a, b) => {
    if (!sortConfig) return 0;
    
    let aValue = a[sortConfig.key];
    let bValue = b[sortConfig.key];

    if (sortConfig.key === 'name') {
      aValue = (a.full_name || a.name || "").toLowerCase();
      bValue = (b.full_name || b.name || "").toLowerCase();
    } else if (sortConfig.key === 'date') {
      aValue = new Date(a.createdAt || 0).getTime();
      bValue = new Date(b.createdAt || 0).getTime();
    }

    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedApplications.length / itemsPerPage) || 1;
  const validCurrentPage = Math.min(currentPage, totalPages);
  const paginatedApplications = sortedApplications.slice((validCurrentPage - 1) * itemsPerPage, validCurrentPage * itemsPerPage);

  // Check if all items on current page are selected
  const allCurrentPageSelected = paginatedApplications.length > 0 && paginatedApplications.every(app => selectedRows.has(app.userId || app._id));

  if (user?.role !== "admin") return null;

  return (
    <DashboardLayout loading={loading} profile={null as any} user={user}>
      <div className="space-y-6 relative h-full flex flex-col">
        {fetchingData ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : (
          <div className="bg-white border border-[#EAECF0]/80 rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col">
            
            {/* Bulk Action Header */}
            {selectedRows.size > 0 && (
              <div className="bg-[#F0FDF4] border-b border-[#DCFCE7] px-4 py-3 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
                <div className="text-sm font-medium text-[#166534]">
                  {selectedRows.size} application(s) selected
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 text-[#DC2626] border-[#FECACA] hover:bg-[#FEF2F2] hover:text-[#DC2626]"
                    onClick={() => handleBulkAction('reject')}
                    disabled={processing}
                  >
                    <XCircle className="w-4 h-4 mr-1.5" />
                    Reject Selected
                  </Button>
                  <Button 
                    size="sm" 
                    className="h-8 bg-[#16A34A] hover:bg-[#15803D] text-white"
                    onClick={() => handleBulkAction('approve')}
                    disabled={processing}
                  >
                    {processing ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> : <CheckCircle2 className="w-4 h-4 mr-1.5" />}
                    Approve Selected
                  </Button>
                </div>
              </div>
            )}

            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-[#F8FAFC]">
                  <TableRow>
                    <TableHead className="w-[5%] px-4 py-3">
                      <input 
                        type="checkbox" 
                        className="rounded border-[#D1D5DB] text-[#0052FF] focus:ring-[#0052FF] w-4 h-4 cursor-pointer"
                        checked={allCurrentPageSelected}
                        onChange={(e) => toggleAllSelection(e, paginatedApplications)}
                      />
                    </TableHead>
                    <TableHead className="font-semibold text-[#6E7C87] text-sm px-4 py-3 w-[25%]">Applicant Name</TableHead>
                    <TableHead className="font-semibold text-[#6E7C87] text-sm px-4 py-3 w-[15%]">Student ID</TableHead>
                    <TableHead className="font-semibold text-[#6E7C87] text-sm px-4 py-3 w-[25%]">Department</TableHead>
                    <TableHead className="font-semibold text-[#6E7C87] text-sm px-4 py-3 w-[15%]">Date Submitted</TableHead>
                    <TableHead className="font-semibold text-[#6E7C87] text-sm px-4 py-3 w-[15%]">Validation</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedApplications.map(app => {
                    const appId = app.userId || app._id;
                    const isSelected = selectedRows.has(appId);
                    
                    return (
                      <TableRow 
                        key={appId} 
                        className={`cursor-pointer transition-colors group ${isSelected ? 'bg-[#F0FDF4]/50 hover:bg-[#F0FDF4]' : 'hover:bg-[#F8FAFC]/50'}`}
                        onClick={() => setSelectedStudent(app)}
                      >
                        <TableCell className="px-4 py-3" onClick={e => e.stopPropagation()}>
                          <input 
                            type="checkbox" 
                            className="rounded border-[#D1D5DB] text-[#0052FF] focus:ring-[#0052FF] w-4 h-4 cursor-pointer"
                            checked={isSelected}
                            onChange={(e) => toggleRowSelection(e, appId)}
                          />
                        </TableCell>
                        <TableCell className="px-4 py-3">
                          <div className="font-medium text-[#111827] text-sm truncate max-w-[220px]">
                            {app.full_name || app.name || "Unknown"}
                          </div>
                          <div className="text-xs text-[#8E9CAE] font-normal truncate max-w-[220px]">{app.email}</div>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-[#4A5568] text-sm font-medium">
                          {app.studentId || "N/A"}
                        </TableCell>
                        <TableCell className="text-[#4A5568] text-sm px-4 py-3 truncate max-w-[200px]">
                          {app.program || "N/A"}
                        </TableCell>
                        <TableCell className="text-[#4A5568] text-sm px-4 py-3">
                          {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'N/A'}
                        </TableCell>
                        <TableCell className="px-4 py-3">
                          <Badge variant="secondary" className="bg-[#F8FAFC] text-[#6E7C87] border border-[#EAECF0]">
                            Ready for Review
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              
              {paginatedApplications.length === 0 && (
                <div className="text-center py-16 text-[#8E9CAE] flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-[#F8FAFC] flex items-center justify-center mb-3">
                    <CheckCircle2 className="w-6 h-6 text-[#10B981]" />
                  </div>
                  <h3 className="text-[#111827] font-medium text-sm mb-1">All Caught Up</h3>
                  <p className="text-xs">There are no pending ID card applications.</p>
                </div>
              )}
            </div>

            {/* Pagination Controls */}
            {sortedApplications.length > 0 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-[#EAECF0] bg-white mt-auto">
                <div className="text-xs text-[#6E7C87]">
                  Showing <span className="font-medium text-[#111827]">{(validCurrentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium text-[#111827]">{Math.min(validCurrentPage * itemsPerPage, sortedApplications.length)}</span> of <span className="font-medium text-[#111827]">{sortedApplications.length}</span> results
                </div>
                <div className="flex items-center gap-1">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-7 w-7 text-[#6E7C87]"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={validCurrentPage === 1}
                  >
                    <ChevronLeft className="w-3 h-3" />
                  </Button>
                  <div className="text-xs font-medium text-[#111827] px-2">
                    {validCurrentPage} / {totalPages}
                  </div>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-7 w-7 text-[#6E7C87]"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={validCurrentPage === totalPages}
                  >
                    <ChevronRight className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Validation Drawer Overlay */}
        {selectedStudent && (
          <div 
            className="fixed inset-0 z-50 flex justify-end bg-black/20 backdrop-blur-[2px] transition-opacity"
            onClick={() => setSelectedStudent(null)}
          >
            <div 
              className="w-[400px] h-full bg-[#F8FAFC] shadow-2xl border-l border-[#EAECF0] animate-in slide-in-from-right duration-300 flex flex-col"
              onClick={e => e.stopPropagation()}
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#EAECF0] bg-white shrink-0">
                <h2 className="text-base font-bold text-[#111827]" style={{ fontFamily: "'Sora', sans-serif" }}>Application Review</h2>
                <Button variant="ghost" size="icon" onClick={() => setSelectedStudent(null)} className="h-7 w-7 rounded-full">
                  <X className="w-4 h-4 text-[#6E7C87]" />
                </Button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-[#EAECF0] bg-white px-5 shrink-0">
                <button 
                  onClick={() => setDrawerTab('details')}
                  className={`text-xs font-medium py-3 px-4 border-b-2 transition-colors ${drawerTab === 'details' ? 'border-[#0052FF] text-[#0052FF]' : 'border-transparent text-[#6E7C87] hover:text-[#111827]'}`}
                >
                  Profile Details
                </button>
                <button 
                  onClick={() => setDrawerTab('preview')}
                  className={`text-xs font-medium py-3 px-4 border-b-2 transition-colors ${drawerTab === 'preview' ? 'border-[#0052FF] text-[#0052FF]' : 'border-transparent text-[#6E7C87] hover:text-[#111827]'}`}
                >
                  Card Preview
                </button>
              </div>
              
              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-5 pb-24">
                
                {drawerTab === 'details' ? (
                  <>
                    {/* Passport Review */}
                    <div className="bg-white rounded-xl border border-[#EAECF0] shadow-sm p-5 mb-5 flex flex-col items-center">
                       <div className="w-32 h-32 rounded-lg bg-gray-100 overflow-hidden mb-4 border border-[#EAECF0] flex items-center justify-center">
                         {selectedStudent.avatar ? (
                           <img src={selectedStudent.avatar} alt="Passport" className="w-full h-full object-cover" />
                         ) : (
                           <span className="text-xs text-gray-400">No Photo</span>
                         )}
                       </div>
                       <h3 className="text-lg font-bold text-[#111827] leading-tight text-center">{selectedStudent.full_name || selectedStudent.name}</h3>
                       <p className="text-xs text-[#6E7C87] truncate text-center mb-4">{selectedStudent.email}</p>
                       
                       <div className="w-full flex items-center gap-2">
                         <Button 
                           variant="outline" 
                           className="flex-1 text-[#DC2626] border-[#FECACA] hover:bg-[#FEF2F2] hover:text-[#DC2626]"
                           onClick={() => handleBulkAction('reject')}
                           disabled={processing}
                         >
                           Reject
                         </Button>
                         <Button 
                           className="flex-1 bg-[#16A34A] hover:bg-[#15803D] text-white"
                           onClick={() => handleBulkAction('approve')}
                           disabled={processing}
                         >
                           Approve
                         </Button>
                       </div>
                    </div>

                    {/* Profile Data Review */}
                    <div className="bg-white rounded-xl border border-[#EAECF0] shadow-sm p-5">
                      <h4 className="text-[10px] font-bold text-[#8E9CAE] uppercase tracking-wider mb-4 border-b border-[#EAECF0] pb-2">Profile Details</h4>
                      
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-[10px] text-[#6E7C87] block mb-1">Student ID</Label>
                            <div className="text-xs font-medium text-[#111827] bg-[#F8FAFC] p-2 rounded border border-[#EAECF0]">{selectedStudent.studentId || "-"}</div>
                          </div>
                          <div>
                            <Label className="text-[10px] text-[#6E7C87] block mb-1">Department</Label>
                            <div className="text-xs font-medium text-[#111827] bg-[#F8FAFC] p-2 rounded border border-[#EAECF0] truncate">{selectedStudent.program || "-"}</div>
                          </div>
                          <div>
                            <Label className="text-[10px] text-[#6E7C87] block mb-1">Level</Label>
                            <div className="text-xs font-medium text-[#111827] bg-[#F8FAFC] p-2 rounded border border-[#EAECF0]">{selectedStudent.study_year || selectedStudent.yearOfStudy ? `${(selectedStudent.study_year || selectedStudent.yearOfStudy) * 100}L` : "-"}</div>
                          </div>
                          <div>
                            <Label className="text-[10px] text-[#6E7C87] block mb-1">Phone Number</Label>
                            <div className="text-xs font-medium text-[#111827] bg-[#F8FAFC] p-2 rounded border border-[#EAECF0]">{selectedStudent.phone || "-"}</div>
                          </div>
                          <div>
                            <Label className="text-[10px] text-[#6E7C87] block mb-1">Gender</Label>
                            <div className="text-xs font-medium text-[#111827] bg-[#F8FAFC] p-2 rounded border border-[#EAECF0]">{selectedStudent.sex === 'M' ? 'Male' : selectedStudent.sex === 'F' ? 'Female' : "-"}</div>
                          </div>
                          <div>
                            <Label className="text-[10px] text-[#6E7C87] block mb-1">Date of Birth</Label>
                            <div className="text-xs font-medium text-[#111827] bg-[#F8FAFC] p-2 rounded border border-[#EAECF0]">{selectedStudent.dob || "-"}</div>
                          </div>
                        </div>

                        <div className="pt-2">
                          <Label className="text-[10px] text-[#6E7C87] block mb-1">State of Origin</Label>
                          <div className="text-xs font-medium text-[#111827] bg-[#F8FAFC] p-2 rounded border border-[#EAECF0]">{selectedStudent.stateOfOrigin || "-"}</div>
                        </div>

                        <div>
                          <h4 className="text-[10px] font-bold text-[#8E9CAE] uppercase tracking-wider mb-2 mt-4 border-b border-[#EAECF0] pb-2">Next of Kin</h4>
                          <div className="grid grid-cols-2 gap-4 mt-2">
                            <div>
                              <Label className="text-[10px] text-[#6E7C87] block mb-1">Name</Label>
                              <div className="text-xs font-medium text-[#111827] bg-[#F8FAFC] p-2 rounded border border-[#EAECF0]">{selectedStudent.nextOfKin || "-"}</div>
                            </div>
                            <div>
                              <Label className="text-[10px] text-[#6E7C87] block mb-1">Phone</Label>
                              <div className="text-xs font-medium text-[#111827] bg-[#F8FAFC] p-2 rounded border border-[#EAECF0]">{selectedStudent.kinPhone || "-"}</div>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="bg-white rounded-xl border border-[#EAECF0] shadow-sm p-5 mb-5 w-full">
                      <div className="flex items-center justify-center gap-2 mb-6">
                        <Button
                          variant={previewFace === 'front' ? 'default' : 'outline'}
                          size="sm"
                          className={previewFace === 'front' ? 'bg-[#0052FF]' : ''}
                          onClick={() => setPreviewFace('front')}
                        >
                          Front Face
                        </Button>
                        <Button
                          variant={previewFace === 'back' ? 'default' : 'outline'}
                          size="sm"
                          className={previewFace === 'back' ? 'bg-[#0052FF]' : ''}
                          onClick={() => setPreviewFace('back')}
                        >
                          Back Face
                        </Button>
                      </div>

                      <div className="flex justify-center -ml-2">
                        <StudentIDCard 
                           student={selectedStudent} 
                           profile={selectedStudent} 
                           previewMode={true} 
                           forceFlip={previewFace === 'back'} 
                        />
                      </div>
                    </div>
                    
                    <div className="w-full flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        className="flex-1 text-[#DC2626] border-[#FECACA] hover:bg-[#FEF2F2] hover:text-[#DC2626]"
                        onClick={() => handleBulkAction('reject')}
                        disabled={processing}
                      >
                        Reject
                      </Button>
                      <Button 
                        className="flex-1 bg-[#16A34A] hover:bg-[#15803D] text-white"
                        onClick={() => handleBulkAction('approve')}
                        disabled={processing}
                      >
                        Approve
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
