export interface StudentProfileInput {
  name: string;
  course: string;
  semester: number;
  strong_subject: string;
  weak_subject: string;
}

export interface StudentRecord extends StudentProfileInput {
  id: number;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  parsed?: StudentProfileInput;
}

export const INITIAL_STUDENTS: StudentRecord[] = [
  {
    id: 1,
    name: 'Niranjan',
    course: 'BSc AIML',
    semester: 3,
    strong_subject: 'Python',
    weak_subject: 'Mathematics',
  },
  {
    id: 2,
    name: 'Niranjan',
    course: 'BSc AIML',
    semester: 3,
    strong_subject: 'Python',
    weak_subject: 'Mathematics',
  },
  {
    id: 3,
    name: 'Niranjan',
    course: 'BSc AIML',
    semester: 3,
    strong_subject: 'Python',
    weak_subject: 'Mathematics',
  },
  {
    id: 4,
    name: 'Niranjan',
    course: 'BSc AIML',
    semester: 3,
    strong_subject: 'Python',
    weak_subject: 'Mathematics',
  },
];

export function validateStudentProfile(input: unknown): ValidationResult {
  const errors: string[] = [];
  if (!input || typeof input !== 'object') {
    return { valid: false, errors: ['Request body must be a valid JSON object'] };
  }

  const raw = input as Record<string, unknown>;
  const name = typeof raw.name === 'string' ? raw.name.trim() : '';
  const course = typeof raw.course === 'string' ? raw.course.trim() : '';
  const strong_subject =
    typeof raw.strong_subject === 'string' ? raw.strong_subject.trim() : '';
  const weak_subject =
    typeof raw.weak_subject === 'string' ? raw.weak_subject.trim() : '';

  const semesterNum =
    typeof raw.semester === 'number'
      ? raw.semester
      : typeof raw.semester === 'string' && raw.semester.trim() !== ''
        ? Number(raw.semester)
        : NaN;

  if (!name) {
    errors.push('Field "name" is required and must be a non-empty string.');
  }
  if (!course) {
    errors.push('Field "course" is required and must be a non-empty string.');
  }
  if (!Number.isInteger(semesterNum) || semesterNum < 1 || semesterNum > 16) {
    errors.push('Field "semester" must be an integer between 1 and 16.');
  }
  if (!strong_subject) {
    errors.push('Field "strong_subject" is required and must be a non-empty string.');
  }
  if (!weak_subject) {
    errors.push('Field "weak_subject" is required and must be a non-empty string.');
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    errors: [],
    parsed: {
      name,
      course,
      semester: semesterNum,
      strong_subject,
      weak_subject,
    },
  };
}

export class CampusStore {
  private students: Map<number, StudentRecord> = new Map();
  private nextId = 1;

  constructor(seed: StudentRecord[] = INITIAL_STUDENTS) {
    for (const student of seed) {
      this.students.set(student.id, { ...student });
      if (student.id >= this.nextId) {
        this.nextId = student.id + 1;
      }
    }
  }

  getHomeStatus(): { message: string; status: string } {
    return {
      message: 'Welcome to CampusAI!',
      status: 'Running successfully',
    };
  }

  getHealthStatus(): { status: string; project: string } {
    return {
      status: 'healthy',
      project: 'CampusAI',
    };
  }

  getAllStudents(): { total_students: number; students: StudentRecord[] } {
    const list = Array.from(this.students.values()).sort((a, b) => a.id - b.id);
    return {
      total_students: list.length,
      students: list,
    };
  }

  getStudentById(id: number): StudentRecord | null {
    return this.students.get(id) ?? null;
  }

  createStudentProfile(profile: StudentProfileInput): {
    message: string;
    student_id: number;
    student: StudentProfileInput;
  } {
    const id = this.nextId++;
    const cleanProfile: StudentProfileInput = {
      name: profile.name.trim(),
      course: profile.course.trim(),
      semester: Number(profile.semester),
      strong_subject: profile.strong_subject.trim(),
      weak_subject: profile.weak_subject.trim(),
    };
    this.students.set(id, {
      id,
      ...cleanProfile,
    });
    return {
      message: 'Student profile saved successfully!',
      student_id: id,
      student: cleanProfile,
    };
  }
}

export const defaultCampusStore = new CampusStore();
