"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/ui/BottomNav";

const gradeMap: Record<string, number> = {
  "A+": 4.0,
  A: 4.0,
  "A-": 3.7,
  "B+": 3.3,
  B: 3.0,
  "B-": 2.7,
  "C+": 2.3,
  C: 2.0,
  "C-": 1.7,
  D: 1.0,
  F: 0.0,
};

interface Course {
  name: string;
  grade: string;
  credits: string;
}

export default function GpaCalculatorPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([
    { name: "Course 1", grade: "A", credits: "3" },
    { name: "Course 2", grade: "B+", credits: "3" },
    { name: "Course 3", grade: "A-", credits: "4" },
  ]);

  const gpa = useMemo(() => {
    let totalPoints = 0;
    let totalCredits = 0;
    for (const course of courses) {
      const credit = Number(course.credits) || 0;
      const gradeValue = gradeMap[course.grade] ?? 0;
      totalCredits += credit;
      totalPoints += credit * gradeValue;
    }
    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "0.00";
  }, [courses]);

  const addCourse = () => {
    setCourses((prev) => [...prev, { name: `Course ${prev.length + 1}`, grade: "A", credits: "3" }]);
  };

  const updateCourse = (index: number, field: keyof Course, value: string) => {
    setCourses((prev) => prev.map((course, idx) => idx === index ? { ...course, [field]: value } : course));
  };

  const removeCourse = (index: number) => {
    setCourses((prev) => prev.filter((_, idx) => idx !== index));
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #111827 0%, #1f2937 100%)", padding: "1rem 1rem 80px 1rem" }}>
      <div style={{ marginBottom: "1.5rem", paddingTop: "1rem" }}>
        <button onClick={() => router.back()} style={{ background: "rgba(255,255,255,0.12)", border: "none", padding: "8px 16px", borderRadius: 40, color: "white", cursor: "pointer", marginBottom: "1rem" }}>
          ← Back
        </button>
        <h1 style={{ color: "white", margin: 0, fontSize: "1.8rem" }}>🎓 GPA Calculator</h1>
        <p style={{ color: "rgba(255,255,255,0.75)", marginTop: "0.25rem" }}>Track your GPA by adding courses, credits, and grades.</p>
      </div>

      <div style={{ background: "rgba(255,255,255,0.95)", borderRadius: 24, padding: "1.5rem", maxWidth: 760, margin: "0 auto" }}>
        <div style={{ display: "grid", gap: "1rem", marginBottom: "1.25rem" }}>
          {courses.map((course, index) => (
            <div key={index} style={{ display: "grid", gap: "0.75rem", padding: "1rem", borderRadius: 20, background: "#f8fafc", border: "1px solid #e5e7eb" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.75rem" }}>
                <div style={{ fontWeight: 700 }}>Course {index + 1}</div>
                {courses.length > 1 && (
                  <button onClick={() => removeCourse(index)} style={{ border: "none", background: "#ef4444", color: "white", borderRadius: 9999, padding: "0.5rem 0.75rem", cursor: "pointer", fontSize: "0.85rem" }}>
                    Remove
                  </button>
                )}
              </div>
              <input
                value={course.name}
                onChange={(e) => updateCourse(index, "name", e.target.value)}
                placeholder="Course name"
                style={{ width: "100%", padding: "0.85rem 1rem", borderRadius: 16, border: "1px solid #d1d5db", fontSize: "0.95rem" }}
              />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <select
                  value={course.grade}
                  onChange={(e) => updateCourse(index, "grade", e.target.value)}
                  style={{ width: "100%", padding: "0.85rem 1rem", borderRadius: 16, border: "1px solid #d1d5db", fontSize: "0.95rem" }}
                >
                  {Object.keys(gradeMap).map((grade) => (
                    <option key={grade} value={grade}>{grade}</option>
                  ))}
                </select>
                <input
                  type="number"
                  value={course.credits}
                  onChange={(e) => updateCourse(index, "credits", e.target.value)}
                  placeholder="Credits"
                  min="0"
                  style={{ width: "100%", padding: "0.85rem 1rem", borderRadius: 16, border: "1px solid #d1d5db", fontSize: "0.95rem" }}
                />
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "1.25rem" }}>
          <button onClick={addCourse} style={{ flex: 1, minWidth: 140, padding: "0.95rem 1rem", background: "#2563eb", color: "white", border: "none", borderRadius: 40, fontWeight: 700, cursor: "pointer" }}>
            Add course
          </button>
        </div>

        <div style={{ padding: "1.25rem", borderRadius: 20, background: "#eef2ff", border: "1px solid #c7d2fe" }}>
          <div style={{ fontSize: "0.95rem", color: "#4b5563", marginBottom: 6 }}>Cumulative GPA</div>
          <div style={{ fontSize: "2rem", fontWeight: 800 }}>{gpa}</div>
          <div style={{ color: "#6b7280", marginTop: 6 }}>Based on {courses.length} course{courses.length === 1 ? "" : "s"}</div>
        </div>
      </div>

      <BottomNav active="tools" onNavigate={(href) => router.push(href)} />
    </div>
  );
}
