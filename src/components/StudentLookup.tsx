import React, { useState } from 'react';
import { Search, UserCheck, AlertTriangle } from 'lucide-react';
import type { StudentRecord } from '../lib/campusStore';

interface StudentLookupProps {
  onLookupResult?: (payload: unknown) => void;
}

export function StudentLookup({ onLookupResult }: StudentLookupProps) {
  const [searchId, setSearchId] = useState('1');
  const [loading, setLoading] = useState(false);
  const [student, setStudent] = useState<StudentRecord | null>(null);
  const [lookupError, setLookupError] = useState<string | null>(null);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLookupError(null);
    setStudent(null);

    const trimmed = searchId.trim();
    const idNum = Number(trimmed);
    if (!trimmed || !Number.isInteger(idNum) || idNum < 1) {
      setLookupError('Please enter a valid positive integer Student ID.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/students/${idNum}`);
      const data = await res.json();
      onLookupResult?.(data);

      if (!res.ok) {
        setLookupError(data.detail || 'Student not found');
        return;
      }

      setStudent(data);
    } catch {
      setLookupError('Failed to fetch student by ID.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      aria-labelledby="lookup-student-heading"
      className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs"
    >
      <div className="flex items-center gap-2.5 mb-4">
        <div className="p-2 rounded-lg bg-slate-100 text-slate-700">
          <Search className="w-5 h-5" />
        </div>
        <div>
          <h2 id="lookup-student-heading" className="text-lg font-semibold text-slate-900">
            Find Student by ID
          </h2>
          <p className="text-xs text-slate-500 font-mono">GET /students/&#123;student_id&#125;</p>
        </div>
      </div>

      <form onSubmit={handleLookup} noValidate className="flex gap-2 mb-4">
        <div className="flex-1">
          <label htmlFor="lookup-student-id" className="sr-only">
            Student ID
          </label>
          <input
            id="lookup-student-id"
            type="number"
            min={1}
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder="Enter Student ID (e.g. 1)"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-indigo-600 focus:outline-hidden focus:ring-2 focus:ring-indigo-600/20"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 disabled:opacity-50 transition-colors cursor-pointer"
        >
          <Search className="w-4 h-4" />
          {loading ? 'Searching...' : 'Lookup Student'}
        </button>
      </form>

      {lookupError && (
        <div
          role="alert"
          className="flex items-center gap-2 rounded-lg bg-amber-50 border border-amber-200 p-3 text-sm text-amber-800"
        >
          <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
          <span>404 Error: {lookupError}</span>
        </div>
      )}

      {student && (
        <div className="rounded-lg bg-slate-50 border border-slate-200 p-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2.5 mb-3">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <span className="font-semibold text-slate-900">{student.name}</span>
            </div>
            <span className="text-xs font-mono text-slate-500">ID #{student.id}</span>
          </div>
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-xs text-slate-500">Course</dt>
              <dd className="font-medium text-slate-800">{student.course}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Semester</dt>
              <dd className="font-medium text-slate-800">Semester {student.semester}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Strong Subject</dt>
              <dd className="font-medium text-emerald-700">{student.strong_subject}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Weak Subject</dt>
              <dd className="font-medium text-rose-700">{student.weak_subject}</dd>
            </div>
          </dl>
        </div>
      )}
    </section>
  );
}
