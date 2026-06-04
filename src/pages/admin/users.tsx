import { useEffect, useState } from "react";
import { DashboardLayout } from "@/src/pages/dashboard";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";
import { Badge } from "@/src/components/ui/badge";
import { useToast } from "@/src/hooks/use-toast";
import { Loader2, Users, Search } from "lucide-react";
import * as studentActions from "@/src/Actions/studentActions";
import { useSelector } from "react-redux";
import { RootState } from "@/src/state/store";

export default function UsersPage() {
  const { user, loading } = useSelector((state: RootState) => state.auth);
  const [students, setStudents] = useState<any[]>([]);
  const [fetchingData, setFetchingData] = useState(true);
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 100;
  const [sortConfig, setSortConfig] = useState<{key: string, direction: 'asc' | 'desc'} | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const studentsData = await studentActions.getAllStudents();
      // Filter out the admin account (which typically lacks standard student fields or has role='admin')
      const validStudents = (studentsData as any[]).filter((s: any) => (s.role !== 'admin' && s.email && s.email !== 'admin@admin.com'));
      setStudents(validStudents);
    } catch (err: any) {
      toast({ title: "Error fetching data", description: err.message, variant: "destructive" });
    } finally {
      setFetchingData(false);
    }
  };

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedAndFilteredStudents = [...students]
    .filter(student => {
      if (!searchQuery) return true;
      const searchLower = searchQuery.toLowerCase();
      return (
        (student.full_name || student.name || "").toLowerCase().includes(searchLower) ||
        (student.email || "").toLowerCase().includes(searchLower) ||
        (student.studentId || "").toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => {
      if (!sortConfig) return 0;
      let aValue = a[sortConfig.key] || "";
      let bValue = b[sortConfig.key] || "";

      if (sortConfig.key === 'name') {
        aValue = (a.full_name || a.name || "").toLowerCase();
        bValue = (b.full_name || b.name || "").toLowerCase();
      } else if (sortConfig.key === 'date') {
        aValue = new Date(a.createdAt || 0).getTime();
        bValue = new Date(b.createdAt || 0).getTime();
      } else if (sortConfig.key === 'verificationStatus') {
        aValue = (a.verificationStatus || 'unapplied').toLowerCase();
        bValue = (b.verificationStatus || 'unapplied').toLowerCase();
      }

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

  const totalPages = Math.ceil(sortedAndFilteredStudents.length / itemsPerPage) || 1;
  const validCurrentPage = Math.min(currentPage, totalPages);
  const paginatedStudents = sortedAndFilteredStudents.slice((validCurrentPage - 1) * itemsPerPage, validCurrentPage * itemsPerPage);

  if (user?.role !== "admin") return null;

  return (
    <DashboardLayout loading={loading} profile={null as any} user={user}>
      <div className="space-y-6 relative h-full flex flex-col">
        {/* We removed the duplicate "Registered Users" header to rely on the layout's header */}
        <div className="flex items-center justify-end">
          <div className="flex items-center gap-3 bg-white border border-[#EAECF0] rounded-lg px-3 py-2 shadow-sm">
            <Search className="w-4 h-4 text-[#9BA7B0]" />
            <input 
              type="text" 
              placeholder="Search users..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="border-none outline-none text-sm w-[200px]"
            />
          </div>
        </div>

        {fetchingData ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : (
          <div className="bg-white border border-[#EAECF0]/80 rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col flex-1">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-[#F8FAFC]">
                  <TableRow>
                    <TableHead className="font-semibold text-[#6E7C87] text-sm px-4 py-3 cursor-pointer hover:bg-[#F1F5F9] transition-colors" onClick={() => handleSort('name')}>
                      Full Name {sortConfig?.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </TableHead>
                    <TableHead className="font-semibold text-[#6E7C87] text-sm px-4 py-3 cursor-pointer hover:bg-[#F1F5F9] transition-colors" onClick={() => handleSort('email')}>
                      Email {sortConfig?.key === 'email' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </TableHead>
                    <TableHead className="font-semibold text-[#6E7C87] text-sm px-4 py-3 cursor-pointer hover:bg-[#F1F5F9] transition-colors" onClick={() => handleSort('studentId')}>
                      Student ID {sortConfig?.key === 'studentId' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </TableHead>
                    <TableHead className="font-semibold text-[#6E7C87] text-sm px-4 py-3 cursor-pointer hover:bg-[#F1F5F9] transition-colors" onClick={() => handleSort('verificationStatus')}>
                      Verification {sortConfig?.key === 'verificationStatus' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </TableHead>
                    <TableHead className="font-semibold text-[#6E7C87] text-sm px-4 py-3 cursor-pointer hover:bg-[#F1F5F9] transition-colors" onClick={() => handleSort('date')}>
                      Date Joined {sortConfig?.key === 'date' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedStudents.map(student => {
                    const studentIdStr = student.studentId || "N/A";
                    let badgeColor = "bg-amber-100 text-amber-800";
                    let statusText = "Pending";
                    if (student.verificationStatus === 'approved') {
                      badgeColor = "bg-green-100 text-green-800";
                      statusText = "Verified";
                    } else if (student.verificationStatus === 'rejected') {
                      badgeColor = "bg-red-100 text-red-800";
                      statusText = "Rejected";
                    } else if (student.verificationStatus === 'unapplied' || !student.verificationStatus) {
                      badgeColor = "bg-gray-100 text-gray-800";
                      statusText = "Unapplied";
                    }

                    return (
                      <TableRow key={student.userId || student._id} className="hover:bg-[#F8FAFC]/50">
                        <TableCell className="px-4 py-3">
                          <div className="font-medium text-[#111827] text-sm truncate max-w-[220px]">
                            {student.full_name || student.name || "Unknown"}
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-sm text-[#6E7C87]">
                          {student.email}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-[#4A5568] text-sm font-medium">
                          {studentIdStr}
                        </TableCell>
                        <TableCell className="px-4 py-3">
                          <Badge variant="secondary" className={`${badgeColor} border-0 shadow-none`}>
                            {statusText}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-[#4A5568] text-sm px-4 py-3">
                          {student.createdAt ? new Date(student.createdAt).toLocaleDateString() : 'N/A'}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              
            
              {paginatedStudents.length === 0 && (
                <div className="text-center py-16 text-[#8E9CAE] flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-[#F8FAFC] flex items-center justify-center mb-3">
                    <Users className="w-6 h-6 text-[#9BA7B0]" />
                  </div>
                  <h3 className="text-[#111827] font-medium text-sm mb-1">No Users Found</h3>
                  <p className="text-xs">There are currently no registered students matching your criteria.</p>
                </div>
              )}
            </div>

            {/* Pagination Controls */}
            {sortedAndFilteredStudents.length > 0 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-[#EAECF0] bg-white mt-auto">
                <div className="text-xs text-[#6E7C87]">
                  Showing <span className="font-medium text-[#111827]">{(validCurrentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium text-[#111827]">{Math.min(validCurrentPage * itemsPerPage, sortedAndFilteredStudents.length)}</span> of <span className="font-medium text-[#111827]">{sortedAndFilteredStudents.length}</span> results
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    className="h-8 px-3 text-xs border border-[#EAECF0] rounded-md text-[#6E7C87] hover:bg-[#F8FAFC] disabled:opacity-50"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={validCurrentPage === 1}
                  >
                    Previous
                  </button>
                  <div className="text-xs font-medium text-[#111827] px-2">
                    {validCurrentPage} / {totalPages}
                  </div>
                  <button 
                    className="h-8 px-3 text-xs border border-[#EAECF0] rounded-md text-[#6E7C87] hover:bg-[#F8FAFC] disabled:opacity-50"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={validCurrentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
