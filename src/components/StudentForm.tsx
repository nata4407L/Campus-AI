import React, { useState } from 'react';
import { BookOpen, PlusCircle, AlertCircle, CheckCircle2 } from 'lucide-react';
import type { StudentProfileInput } from '../lib/campusStore';

interface StudentFormProps {
  onSuccess: (response: {
    message: string;
    student_id: number;
    student: StudentProfileInput;
  }) => void;
}

export function StudentForm({ onSuccess }: StudentFormProps) {
  const [name, setName] = useState('');
  const [course, setCourse] = useState('');
  const [semester, setSemester] = useState('1');
  const [strongSubject, setStrongSubject] = useState('');
  const [weakSubject, setWeakSubject] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessBanner(null);

    const trimmedName = name.trim();
    const trimmedCourse = course.trim();
    const trimmedStrong = strongSubject.trim();
    const trimmedWeak = weakSubject.trim();
    const parsedSemester = Number(semester);

    if (!trimmedName || !trimmedCourse || !trimmedStrong || !trimmedWeak) {
      setErrorMessage('All student profile fields are required.');
      return;
    }

    if (!Number.isInteger(parsedSemester) || parsedSemester < 1 || parsedSemester > 16) {
      setErrorMessage('Semester must be a valid integer between 1 and 16.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/student/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: trimmedName,
          course: trimmedCourse,
          semester: parsedSemester,
          strong_subject: trimmedStrong,
          weak_subject: trimmedWeak,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.detail || 'Failed to save student profile.');
        return;
      }

      setSuccessBanner(`${data.message} (Assigned ID #${data.student_id})`);
      setName('');
      setCourse('');
      setSemester('1');
      setStrongSubject('');
      setWeakSubject('');
      onSuccess(data);
    } catch {
      setErrorMessage('Network error while saving student profile.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      aria-labelledby="create-profile-heading"
      className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs"
    >
      <div className="flex items-center gap-2.5 mb-4">
        <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
          <BookOpen className="w-5 h-5" />
        </div>
        <div>
          <h2 id="create-profile-heading" className="text-lg font-semibold text-slate-900">
            Create Student Profile
          </h2>
          <p className="text-xs text-slate-500 font-mono">POST /student/profile</p>
        </div>
      </div>

      {errorMessage && (
        <div
          role="alert"
          className="mb-4 flex items-start gap-2 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700"
        >
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successBanner && (
        <div
          role="status"
          className="mb-4 flex items-start gap-2 rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-sm text-emerald-700"
        >
          <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{successBanner}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <label htmlFor="student-name" className="block text-sm font-medium text-slate-700 mb-1">
            Student Name
          </label>
          <input
            id="student-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Niranjan"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-indigo-600 focus:outline-hidden focus:ring-2 focus:ring-indigo-600/20"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="student-course" className="block text-sm font-medium text-slate-700 mb-1">
              Course / Program
            </label>
            <input
              id="student-course"
              type="text"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              placeholder="e.g. BSc AIML"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-indigo-600 focus:outline-hidden focus:ring-2 focus:ring-indigo-600/20"
            />
          </div>

          <div>
            <label htmlFor="student-semester" className="block text-sm font-medium text-slate-700 mb-1">
              Semester
            </label>
            <input
              id="student-semester"
              type="number"
              min={1}
              max={16}
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-indigo-600 focus:outline-hidden focus:ring-2 focus:ring-indigo-600/20"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="strong-subject" className="block text-sm font-medium text-slate-700 mb-1">
              Strong Subject
            </label>
            <input
              id="strong-subject"
              type="text"
              value={strongSubject}
              onChange={(e) => setStrongSubject(e.target.value)}
              placeholder="e.g. Python"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-indigo-600 focus:outline-hidden focus:ring-2 focus:ring-indigo-600/20"
            />
          </div>

          <div>
            <label htmlFor="weak-subject" className="block text-sm font-medium text-slate-700 mb-1">
              Weak Subject
            </label>
            <input
              id="weak-subject"
              type="text"
              value={weakSubject}
              onChange={(e) => setWeakSubject(e.target.value)}
              placeholder="e.g. Mathematics"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-indigo-600 focus:outline-hidden focus:ring-2 focus:ring-indigo-600/20"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 disabled:opacity-50 transition-colors cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          {submitting ? 'Saving Profile...' : 'Save Student Profile'}
        </button>
      </form>
    </section>
  );
}
