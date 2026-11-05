import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import {
  defaultCampusStore,
  validateStudentProfile,
} from './src/lib/campusStore.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Root status endpoint for API clients (or explicit /api/home)
  app.get('/api/home', (_req, res) => {
    res.json(defaultCampusStore.getHomeStatus());
  });

  // Health check endpoint (mirrors @app.get("/health") in original FastAPI app)
  const handleHealth = (_req: express.Request, res: express.Response) => {
    res.json(defaultCampusStore.getHealthStatus());
  };
  app.get('/health', handleHealth);
  app.get('/api/health', handleHealth);

  // Create student profile endpoint (mirrors @app.post("/student/profile"))
  const handleCreateProfile = (req: express.Request, res: express.Response) => {
    const validation = validateStudentProfile(req.body);
    if (!validation.valid || !validation.parsed) {
      res.status(422).json({
        detail: validation.errors.join(' '),
        errors: validation.errors,
      });
      return;
    }

    const result = defaultCampusStore.createStudentProfile(validation.parsed);
    res.status(200).json(result);
  };
  app.post('/student/profile', handleCreateProfile);
  app.post('/api/student/profile', handleCreateProfile);

  // Get all students endpoint (mirrors @app.get("/students"))
  const handleGetStudents = (_req: express.Request, res: express.Response) => {
    res.json(defaultCampusStore.getAllStudents());
  };
  app.get('/students', handleGetStudents);
  app.get('/api/students', handleGetStudents);

  // Get student by ID endpoint (mirrors @app.get("/students/{student_id}"))
  const handleGetStudentById = (req: express.Request, res: express.Response) => {
    const studentId = Number(req.params.student_id);
    if (!Number.isInteger(studentId) || studentId < 1) {
      res.status(422).json({
        detail: 'student_id must be a positive integer',
      });
      return;
    }

    const student = defaultCampusStore.getStudentById(studentId);
    if (!student) {
      res.status(404).json({
        detail: 'Student not found',
      });
      return;
    }

    res.json(student);
  };
  app.get('/students/:student_id', handleGetStudentById);
  app.get('/api/students/:student_id', handleGetStudentById);

  // Content-negotiated root route: returns JSON if client does not accept HTML
  app.get('/', (req, res, next) => {
    const accept = req.headers.accept || '';
    if (
      req.query.format === 'json' ||
      (accept.includes('application/json') && !accept.includes('text/html'))
    ) {
      res.json(defaultCampusStore.getHomeStatus());
      return;
    }
    next();
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*all', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log('Welcome to CampusAI!');
    console.log('Your personal student analytics assistant is starting.');
    console.log(`CampusAI setup is successful! Listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
