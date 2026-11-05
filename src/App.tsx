import React, { useEffect, useState, useCallback } from 'react';
import { GraduationCap, Activity, Terminal } from 'lucide-react';
import { StudentForm } from './components/StudentForm';
import { StudentLookup } from './components/StudentLookup';
import { StudentList } from './components/StudentList';
import type { StudentRecord } from './lib/campusStore';

export function App() {
  const [homeStatus, setHomeStatus] = useState<{ message: string; status: string }>({
    message: 'Welcome to CampusAI!',
    status: 'Running successfully',
  });
  const [healthStatus, setHealthStatus] = useState<{ status: string; project: string }>({
    status: 'healthy',
    project: 'CampusAI',
  });
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [totalStudents, setTotalStudents] = useState<number>(0);
  const [loadingStudents, setLoadingStudents] = useState<boolean>(true);
  const [lastApiPayload, setLastApiPayload] = useState<unknown>(null);

  const fetchStudents = useCallback(async () => {
    setLoadingStudents(true);
    try {
      const res = await fetch('/api/students');
      const data = await res.json();
      setStudents(data.students || []);
      setTotalStudents(data.total_students ?? 0);
      setLastApiPayload(data);
    } catch (err) {
      console.error('Error loading students:', err);
    } finally {
      setLoadingStudents(false);
    }
  }, []);

  useEffect(() => {
    async function loadInitialStatus() {
      try {
        const [homeRes, healthRes] = await Promise.all([
          fetch('/api/home'),
          fetch('/api/health'),
        ]);
        if (homeRes.ok) {
          setHomeStatus(await homeRes.json());
        }
        if (healthRes.ok) {
          setHealthStatus(await healthRes.json());
        }
      } catch (err) {
        console.error('Error loading service status:', err);
      }
    }

    loadInitialStatus();
    fetchStudents();
  }, [fetchStudents]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">CampusAI</h1>
              <p className="text-xs text-slate-500">
                Student academic analytics and study assistant
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 font-medium">
              <span>{homeStatus.message}</span>
              <span className="text-slate-400">•</span>
              <span className="text-emerald-700">{homeStatus.status}</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-800 font-mono">
              <Activity className="w-3.5 h-3.5 text-emerald-600" />
              <span>/health: {healthStatus.status}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-5 space-y-6">
            <StudentForm
              onSuccess={(response) => {
                setLastApiPayload(response);
                fetchStudents();
              }}
            />

            <StudentLookup
              onLookupResult={(payload) => {
                setLastApiPayload(payload);
              }}
            />
          </div>

          <div className="lg:col-span-7 space-y-6">
            <StudentList
              students={students}
              totalStudents={totalStudents}
              loading={loadingStudents}
              onRefresh={fetchStudents}
              onSelectStudent={(student) => setLastApiPayload(student)}
            />

            <section
              aria-labelledby="api-inspector-heading"
              className="bg-slate-900 text-slate-100 rounded-xl p-5 shadow-xs"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-indigo-400" />
                  <h2 id="api-inspector-heading" className="text-sm font-semibold">
                    Latest API Response Payload
                  </h2>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={async () => {
                      const res = await fetch('/api/home');
                      setLastApiPayload(await res.json());
                    }}
                    className="text-xs font-mono px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
                  >
                    GET /
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      const res = await fetch('/api/health');
                      setLastApiPayload(await res.json());
                    }}
                    className="text-xs font-mono px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
                  >
                    GET /health
                  </button>
                </div>
              </div>
              <pre className="text-xs font-mono bg-slate-950/80 border border-slate-800 rounded-lg p-3.5 overflow-x-auto text-emerald-300">
                {JSON.stringify(lastApiPayload, null, 2)}
              </pre>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
