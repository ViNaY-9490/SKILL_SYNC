'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3,
  Brain,
  CheckCircle2,
  Clock,
  Play,
  Award,
  AlertCircle,
  RotateCcw,
} from 'lucide-react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';

const SAMPLE_ASSESSMENTS = [
  {
    id: 'assessment_sql_dbms',
    title: 'SQL Relational Queries & Database Management Systems (DBMS)',
    description: 'Assess relational database querying skills, JOINs, indexing strategies, normalization, and ACID transactions verified by Dr. Subba Rao Sir.',
    type: 'SKILL_KNOWLEDGE',
    duration: 25,
    totalQuestions: 20,
    difficulty: 'MEDIUM',
    skill: 'DBMS & SQL',
    evaluator: 'Dr. Subba Rao Sir (DBMS Head)',
    passingMarks: 70,
  },
  {
    id: 'assessment_python_basic',
    title: 'Python Fundamentals & Data Structures',
    description: 'Test core Python knowledge covering data structures, OOP concepts, list comprehensions, and exception handling.',
    type: 'SKILL_KNOWLEDGE',
    duration: 20,
    totalQuestions: 15,
    difficulty: 'MEDIUM',
    skill: 'Python',
    evaluator: 'Dr. Suresh Menon',
    passingMarks: 70,
  },
  {
    id: 'assessment_rest_design',
    title: 'REST API Design & Security',
    description: 'Evaluate knowledge of HTTP status codes, API versioning, JWT authentication, and rate limiting patterns.',
    type: 'SKILL_KNOWLEDGE',
    duration: 15,
    totalQuestions: 10,
    difficulty: 'EASY',
    skill: 'REST API',
    evaluator: 'Meera Krishnan',
    passingMarks: 60,
  },
];

const ASSESSMENT_QUESTIONS_MAP: Record<string, any[]> = {
  assessment_sql_dbms: [
    {
      id: 'q_dbms_1',
      text: 'What does ACID stand for in Database Management Systems (DBMS)?',
      options: [
        'Atomicity, Consistency, Isolation, Durability',
        'Asynchronous, Concurrent, Indexing, Data',
        'Aggregate, Columnar, Isolated, Distributed',
        'Algorithm, Compression, Integrity, Deletion',
      ],
      correct: 0,
      explanation: 'ACID guarantees database transaction reliability under Dr. Subba Rao Sir DBMS standards.',
    },
    {
      id: 'q_dbms_2',
      text: 'Which SQL JOIN returns all rows from the left table and matched records from the right table?',
      options: ['INNER JOIN', 'LEFT OUTER JOIN', 'FULL JOIN', 'CROSS JOIN'],
      correct: 1,
      explanation: 'LEFT JOIN keeps all left rows regardless of right table matches.',
    },
    {
      id: 'q_dbms_3',
      text: 'Which Database Index physically sorts table rows on disk to accelerate range scans?',
      options: ['Clustered Index', 'Non-Clustered Index', 'Bitmap Index', 'Sparse Index'],
      correct: 0,
      explanation: 'A Clustered Index determines the physical order of data on disk (one per table).',
    },
    {
      id: 'q_dbms_4',
      text: 'In B+ Tree Database Indexing, where are all actual data pointers stored?',
      options: ['Root Node', 'Internal Nodes', 'Leaf Nodes Only', 'Header Block'],
      correct: 2,
      explanation: 'B+ Trees store all record pointers in leaf nodes connected as a linked list.',
    },
  ],
  assessment_python_basic: [
    {
      id: 'q_py_1',
      text: 'What is the average time complexity of looking up a key in a Python dictionary?',
      options: ['O(n)', 'O(1)', 'O(log n)', 'O(n²)'],
      correct: 1,
      explanation: 'Python dictionaries use hash tables, offering O(1) average lookup time.',
    },
    {
      id: 'q_py_2',
      text: 'Which keyword creates an anonymous inline function in Python?',
      options: ['def', 'lambda', 'func', 'inline'],
      correct: 1,
      explanation: 'lambda expressions define single-expression inline functions.',
    },
    {
      id: 'q_py_3',
      text: 'What is the type returned by type([]) in Python 3?',
      options: ['<class "list">', '<class "array">', '<class "dict">', '<class "tuple">'],
      correct: 0,
      explanation: 'Square brackets instantiate built-in Python list objects.',
    },
  ],
  assessment_rest_design: [
    {
      id: 'q_api_1',
      text: 'Which HTTP method is idempotent and used to replace an entire target resource state?',
      options: ['POST', 'PUT', 'PATCH', 'CONNECT'],
      correct: 1,
      explanation: 'PUT replaces the entire resource state and is idempotent.',
    },
    {
      id: 'q_api_2',
      text: 'Which HTTP status code indicates unauthenticated client credentials?',
      options: ['400 Bad Request', '401 Unauthorized', '403 Forbidden', '404 Not Found'],
      correct: 1,
      explanation: '401 Unauthorized indicates missing or invalid authentication credentials.',
    },
  ],
};

export default function AssessmentsPage() {
  const [activeAssessment, setActiveAssessment] = useState<any | null>(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);

  const activeQuestions = activeAssessment ? (ASSESSMENT_QUESTIONS_MAP[activeAssessment.id] || ASSESSMENT_QUESTIONS_MAP['assessment_sql_dbms']) : [];

  const handleSelectOption = (qIdx: number, optionIdx: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [qIdx]: optionIdx }));
  };

  const handleFinishQuiz = () => {
    let correctCount = 0;
    activeQuestions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correct) correctCount++;
    });
    const finalScore = Math.round((correctCount / activeQuestions.length) * 100);
    setScore(finalScore);
    setIsCompleted(true);
  };

  const resetQuiz = () => {
    setActiveAssessment(null);
    setCurrentQIndex(0);
    setSelectedAnswers({});
    setIsCompleted(false);
    setScore(0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-warm)]">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-[var(--primary-green)] mb-0.5">
            Institutional Evaluations
          </div>
          <h1 className="text-h1 flex items-center gap-2 text-[var(--text-primary)]">
            <BarChart3 className="w-6 h-6 text-[var(--primary-dark)]" />
            Skill Assessments & Verification
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Validate technical competency through standardized evaluations to earn verified badges.
          </p>
        </div>
      </div>

      {/* Active Assessment Modal / Quiz view */}
      {activeAssessment ? (
        <div className="surface-card p-6 border border-[var(--border-warm)]">
          {!isCompleted ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
                <div>
                  <span className="text-xs font-bold text-[var(--primary-dark)] uppercase">
                    Question {currentQIndex + 1} of {activeQuestions.length}
                  </span>
                  <h2 className="text-sm font-bold text-[var(--text-primary)] mt-0.5">
                    {activeAssessment.title}
                  </h2>
                </div>
                <div className="text-xs font-semibold px-2.5 py-1 rounded bg-[var(--surface-subtle)] text-[var(--text-primary)] flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[var(--sage-muted)]" /> 18:45 left
                </div>
              </div>

              <div className="text-xs font-semibold text-[var(--text-primary)] py-1">
                {activeQuestions[currentQIndex]?.text}
              </div>

              <div className="space-y-2">
                {activeQuestions[currentQIndex]?.options.map((opt: string, optIdx: number) => {
                  const isSelected = selectedAnswers[currentQIndex] === optIdx;
                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(currentQIndex, optIdx)}
                      className={`w-full p-3 rounded-md text-left text-xs font-medium transition-all flex items-center justify-between border cursor-pointer ${
                        isSelected
                          ? 'border-[var(--primary-dark)] bg-[var(--surface-subtle)] text-[var(--primary-dark)] font-bold'
                          : 'border-[var(--border-warm)] bg-[var(--surface-paper)] text-[var(--text-primary)]'
                      }`}
                    >
                      <span>{opt}</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[var(--surface-bg)]">
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[var(--border-subtle)]">
                <Button
                  disabled={currentQIndex === 0}
                  onClick={() => setCurrentQIndex((prev) => prev - 1)}
                  variant="outline"
                  size="sm"
                >
                  Previous
                </Button>

                {currentQIndex < activeQuestions.length - 1 ? (
                  <Button onClick={() => setCurrentQIndex((prev) => prev + 1)} variant="primary" size="sm">
                    Next Question
                  </Button>
                ) : (
                  <Button onClick={handleFinishQuiz} variant="secondary" size="sm">
                    Submit Evaluation
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-6 space-y-4">
              <div className="w-12 h-12 rounded-lg bg-[var(--surface-subtle)] text-[var(--primary-dark)] mx-auto flex items-center justify-center font-bold text-xl">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-base font-bold text-[var(--text-primary)]">
                  {score >= 70 ? 'Assessment Passed! 🎉' : 'Assessment Completed'}
                </h2>
                <p className="text-xs text-[var(--text-secondary)] mt-1">
                  You scored <strong className="text-[var(--primary-dark)] font-bold">{score}%</strong> on {activeAssessment.title}.
                </p>
              </div>
              <Button onClick={resetQuiz} variant="primary" size="sm">
                Back to Catalog
              </Button>
            </div>
          )}
        </div>
      ) : (
        /* Assessment Catalog */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {SAMPLE_ASSESSMENTS.map((assessment) => (
            <div key={assessment.id} className="surface-card p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[var(--surface-subtle)] text-[var(--primary-dark)]">
                    {assessment.skill}
                  </span>
                  <span className="text-[11px] text-[var(--text-tertiary)] flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {assessment.duration} mins
                  </span>
                </div>

                <h3 className="font-bold text-sm text-[var(--text-primary)] mb-1">
                  {assessment.title}
                </h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-2">
                  {assessment.description}
                </p>
                <div className="text-[11px] font-semibold text-[var(--primary-green)] mb-3 flex items-center gap-1">
                  🎓 Evaluator: {assessment.evaluator}
                </div>
              </div>

              <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between">
                <span className="text-[11px] text-[var(--text-tertiary)]">Passing: {assessment.passingMarks}%</span>
                <Button onClick={() => setActiveAssessment(assessment)} variant="primary" size="sm">
                  <Play className="w-3.5 h-3.5" /> Start Test
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
