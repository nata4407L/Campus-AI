import React from 'react';
import { Users, RefreshCw } from 'lucide-react';
import type { StudentRecord } from '../lib/campusStore';

interface StudentListProps {
  students: StudentRecord[];
  totalStudents: number;
  loading: boolean;
  onRefresh: () => void;
  onSelectStudent: (student: StudentRecord) => void;
}

export function StudentList({
  students,
  totalStudents,
  loading,
  onRefresh,
  onSelectStudent,
}: StudentListProps) {
  return (
    <section
      aria-labelledby="student-directory-heading"
      className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs"
    >
      <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 id="student-directory-heading" className="text-lg font-semibold text-slate-900">
                Registered Students
              </h2>
              <span className="text-xs font-mono font-semibold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md">
                Total: {totalStudents}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-mono">GET /students (SQLite campusai.db)</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 focus:outline-hidden focus:ring-2 focus:ring-indigo-600 disabled:opacity-50 transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh List
        </button>
      </div>

      {students.length === 0 ? (
        <div className="text-center py-10 border border-dashed border-slate-200 rounded-lg">
          <p className="text-sm text-slate-500">No student profiles found in database.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500">
                <th className="py-3 px-3 font-semibold">ID</th>
                <th className="py-3 px-3 font-semibold">Name</th>
                <th className="py-3 px-3 font-semibold">Course</th>
                <th className="py-3 px-3 font-semibold">Semester</th>
                <th className="py-3 px-3 font-semibold">Strong Subject</th>
                <th className="py-3 px-3 font-semibold">Weak Subject</th>
                <th className="py-3 px-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3 font-mono text-xs text-slate-500 whitespace-nowrap">
                    #{student.id}
                  </td>
                  <td className="py-3 px-3 font-medium text-slate-900 whitespace-nowrap">
                    {student.name}
                  </td>
                  <td className="py-3 px-3 text-slate-700 whitespace-nowrap">{student.course}</td>
                  <td className="py-3 px-3 text-slate-700 whitespace-nowrap">
                    Sem {student.semester}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className="text-emerald-700 font-medium">{student.strong_subject}</span>
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className="text-rose-700 font-medium">{student.weak_subject}</span>
                  </td>
                  <td className="py-3 px-3 text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => onSelectStudent(student)}
                      className="text-xs font-medium text-indigo-600 hover:text-indigo-800 cursor-pointer"
                    >
                      Inspect JSON #{student.id}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
