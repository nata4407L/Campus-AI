from fastapi import FastAPI, HTTPException
import sqlite3
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="CampusAI")


# Student profile data format
class StudentProfile(BaseModel):
    name: str
    course: str
    semester: int
    strong_subject: str
    weak_subject: str


# Create the database and students table
def create_database():
    conn = sqlite3.connect("campusai.db")
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            course TEXT NOT NULL,
            semester INTEGER NOT NULL,
            strong_subject TEXT,
            weak_subject TEXT
        )
    """)

    conn.commit()
    conn.close()


create_database()


@app.get("/")
def home():
    return {
        "message": "Welcome to CampusAI!",
        "status": "Running successfully"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "project": "CampusAI"
    }


@app.post("/student/profile")
def create_student_profile(student: StudentProfile):
    conn = sqlite3.connect("campusai.db")
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO students
        (name, course, semester, strong_subject, weak_subject)
        VALUES (?, ?, ?, ?, ?)
    """, (
        student.name,
        student.course,
        student.semester,
        student.strong_subject,
        student.weak_subject
    ))

    conn.commit()
    student_id = cursor.lastrowid
    conn.close()

    return {
        "message": "Student profile saved successfully!",
        "student_id": student_id,
        "student": student.model_dump()
    }

@app.get("/students")
def get_students():
    conn = sqlite3.connect("campusai.db")
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM students")
    students = [dict(row) for row in cursor.fetchall()]

    conn.close()

    return {
        "total_students": len(students),
        "students": students
    }

@app.get("/students/{student_id}")
def get_student_by_id(student_id: int):
    conn = sqlite3.connect("campusai.db")
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    cursor.execute(
        "SELECT * FROM students WHERE id = ?",
        (student_id,)
    )
    student = cursor.fetchone()
    conn.close()

  
    if student is None:
        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

