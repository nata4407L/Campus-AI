import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CampusStore,
  INITIAL_STUDENTS,
  validateStudentProfile,
} from './campusStore';

test('CampusStore initializes with existing campusai.db seed records', () => {
  const store = new CampusStore();
  const result = store.getAllStudents();
  assert.equal(result.total_students, INITIAL_STUDENTS.length);
  assert.equal(result.students[0].name, 'Niranjan');
  assert.equal(result.students[0].course, 'BSc AIML');
  assert.equal(result.students[0].semester, 3);
});

test('CampusStore creates a new student profile and increments ID', () => {
  const store = new CampusStore();
  const created = store.createStudentProfile({
    name: 'Aarav Sharma',
    course: 'BTech CSE',
    semester: 5,
    strong_subject: 'Algorithms',
    weak_subject: 'Operating Systems',
  });

  assert.equal(created.message, 'Student profile saved successfully!');
  assert.equal(created.student_id, 5);
  assert.deepEqual(created.student, {
    name: 'Aarav Sharma',
    course: 'BTech CSE',
    semester: 5,
    strong_subject: 'Algorithms',
    weak_subject: 'Operating Systems',
  });

  const fetched = store.getStudentById(5);
  assert.notEqual(fetched, null);
  assert.equal(fetched?.name, 'Aarav Sharma');
});

test('CampusStore returns null when looking up non-existent student ID', () => {
  const store = new CampusStore();
  assert.equal(store.getStudentById(999), null);
});

test('validateStudentProfile rejects missing or invalid fields', () => {
  const invalid = validateStudentProfile({
    name: '',
    course: 'BSc AIML',
    semester: 0,
    strong_subject: 'Python',
    weak_subject: '',
  });
  assert.equal(invalid.valid, false);
  assert.equal(invalid.errors.length, 3);

  const valid = validateStudentProfile({
    name: 'Priya Patel',
    course: 'MSc Data Science',
    semester: 2,
    strong_subject: 'Statistics',
    weak_subject: 'Deep Learning',
  });
  assert.equal(valid.valid, true);
  assert.equal(valid.parsed?.semester, 2);
});
