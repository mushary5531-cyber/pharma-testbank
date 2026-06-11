import React, { useState, useMemo } from "react";

type ExamType = "mid1" | "mid2" | "final";

type Question = {
  id: string;
  exam: ExamType;
  lecture: string;
  q: string;
  options: [string, string, string, string];
  answer: 0 | 1 | 2 | 3;
  explanation: string;
};

const MID1_QUESTIONS: Question[] = [];
const MID2_QUESTIONS: Question[] = [];
const FINAL_QUESTIONS: Question[] = [];
const ALL_Q = [...MID1_QUESTIONS, ...MID2_QUESTIONS, ...FINAL_QUESTIONS];

type Screen = "home" | "quiz" | "score" | "review";
type Filter = "all" | "mid1" | "mid2" | "final";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const LABELS: Record<Filter, { en: string; ar: string }> = {
  all:   { en: "All Questions", ar: "جميع الأسئلة" },
  mid1:  { en: "Midterm 1",     ar: "الاختبار الأول" },
  mid2:  { en: "Midterm 2",     ar: "الاختبار الثاني" },
  final: { en: "Final",         ar: "الاختبار النهائي" },
};

const OPTION_LETTERS = ["A", "B", "C", "D"] as const;

export default function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [filter, setFilter] = useState<Filter>("all");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [reviewIndex, setReviewIndex] = useState(0);

  function startQuiz(f: Filter) {
    const pool =
      f === "all"   ? ALL_Q :
      f === "mid1"  ? MID1_QUESTIONS :
      f === "mid2"  ? MID2_QUESTIONS :
                      FINAL_QUESTIONS;
    if (pool.length === 0) return;
    const qs = shuffle(pool);
    setFilter(f);
    setQuestions(qs);
    setAnswers(new Array(qs.length).fill(null));
    setCurrent(0);
    setSelected(null);
    setScreen("quiz");
  }

  function handleSelect(idx: number) {
    if (selected !== null) return;
    setSelected(idx);
    setAnswers(prev => {
      const next = [...prev];
      next[current] = idx;
      return next;
    });
  }

  function handleNext() {
    if (current + 1 < questions.length) {
      setCurrent(c => c + 1);
      setSelected(answers[current + 1] ?? null);
    } else {
      setScreen("score");
    }
  }

  function handlePrev() {
    if (current > 0) {
      setCurrent(c => c - 1);
      setSelected(answers[current - 1] ?? null);
    }
  }

  const wrongQuestions = useMemo(
    () => questions.filter((q, i) => answers[i] !== q.answer),
    [questions, answers]
  );

  const score = answers.filter((a, i) => a === questions[i]?.answer).length;
  const pct = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;

  const counts: Record<Filter, number> = {
    all:   ALL_Q.length,
    mid1:  MID1_QUESTIONS.length,
    mid2:  MID2_QUESTIONS.length,
    final: FINAL_QUESTIONS.length,
  };

  /* ── HOME ── */
  if (screen === "home") {
    return (
      <div style={S.page}>
        <div style={S.container}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={S.badge}>Pharmacology — PH45</div>
            <h1 style={S.title}>Test Bank</h1>
            <p style={S.subtitle}>بنك الأسئلة</p>
          </div>

          <div style={S.grid}>
            {(["mid1", "mid2", "final", "all"] as Filter[]).map(f => (
              <button
                key={f}
                style={{
                  ...S.sectionBtn,
                  opacity: counts[f] === 0 ? 0.45 : 1,
                  cursor: counts[f] === 0 ? "not-allowed" : "pointer",
                }}
                onClick={() => startQuiz(f)}
                disabled={counts[f] === 0}
              >
                <span style={S.btnAr}>{LABELS[f].ar}</span>
                <span style={S.btnEn}>{LABELS[f].en}</span>
                <span style={S.btnCount}>{counts[f]} questions</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ── QUIZ ── */
  if (screen === "quiz") {
    const q = questions[current];
    const isAnswered = selected !== null;

    return (
      <div style={S.page}>
        <div style={S.container}>
          {/* Header */}
          <div style={S.quizHeader}>
            <button style={S.backBtn} onClick={() => setScreen("home")}>← Home</button>
            <span style={S.sectionTag}>{LABELS[filter].en}</span>
          </div>

          {/* Progress */}
          <div style={S.progressWrap}>
            <div style={S.progressBar}>
              <div
                style={{
                  ...S.progressFill,
                  width: `${((current + 1) / questions.length) * 100}%`,
                }}
              />
            </div>
            <span style={S.progressText}>
              {current + 1} / {questions.length}
            </span>
          </div>

          {/* Card */}
          <div style={S.card}>
            <div style={S.lectureBadge}>{q.lecture}</div>
            <p style={S.questionText} dir="ltr">{q.q}</p>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {q.options.map((opt, i) => {
                let bg = "transparent";
                let border = "1.5px solid #334155";
                let color = "#e2e8f0";
                if (isAnswered) {
                  if (i === q.answer) {
                    bg = "#14532d44";
                    border = "1.5px solid #22c55e";
                    color = "#86efac";
                  } else if (i === selected && i !== q.answer) {
                    bg = "#7f1d1d44";
                    border = "1.5px solid #ef4444";
                    color = "#fca5a5";
                  }
                } else if (false) {
                  // hover handled via inline — skip
                }
                return (
                  <button
                    key={i}
                    style={{ ...S.optionBtn, background: bg, border, color }}
                    onClick={() => handleSelect(i)}
                    disabled={isAnswered}
                    dir="ltr"
                  >
                    <span style={S.optionLetter}>{OPTION_LETTERS[i]}</span>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>

            {/* Explanation */}
            {isAnswered && (
              <div style={S.explanationBox}>
                <div style={S.explanationLabel}>
                  <span>Explanation</span>
                  <span style={{ color: "#94a3b8", fontSize: 13 }}>الشرح</span>
                </div>
                <p style={{ margin: 0, lineHeight: 1.7, color: "#bfdbfe" }} dir="ltr">
                  {q.explanation || "—"}
                </p>
              </div>
            )}
          </div>

          {/* Nav */}
          <div style={S.navRow}>
            <button
              style={{ ...S.navBtn, opacity: current === 0 ? 0.35 : 1 }}
              onClick={handlePrev}
              disabled={current === 0}
            >
              ← Prev
            </button>
            {isAnswered && (
              <button style={{ ...S.navBtn, ...S.navBtnPrimary }} onClick={handleNext}>
                {current + 1 === questions.length ? "Finish ✓" : "Next →"}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* ── SCORE ── */
  if (screen === "score") {
    const grade =
      pct >= 90 ? { label: "Excellent!", color: "#22c55e" } :
      pct >= 75 ? { label: "Good",       color: "#3b82f6" } :
      pct >= 60 ? { label: "Pass",       color: "#f59e0b" } :
                  { label: "Try Again",  color: "#ef4444" };

    return (
      <div style={S.page}>
        <div style={{ ...S.container, textAlign: "center" }}>
          <div style={S.card}>
            <div style={{ fontSize: 64, marginBottom: 8 }}>
              {pct >= 75 ? "🎉" : pct >= 60 ? "👍" : "📚"}
            </div>
            <h2 style={{ margin: "0 0 4px", color: grade.color, fontSize: 28 }}>
              {grade.label}
            </h2>
            <p style={{ color: "#94a3b8", margin: "0 0 24px", fontSize: 14 }}>
              {LABELS[filter].en}
            </p>

            <div style={S.scoreBig}>{pct}%</div>
            <p style={{ color: "#94a3b8", margin: "0 0 32px" }}>
              {score} correct out of {questions.length}
            </p>

            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <button style={S.actionBtn} onClick={() => startQuiz(filter)}>
                Retry
              </button>
              {wrongQuestions.length > 0 && (
                <button
                  style={{ ...S.actionBtn, background: "#1e40af" }}
                  onClick={() => { setReviewIndex(0); setScreen("review"); }}
                >
                  Review Wrong ({wrongQuestions.length})
                </button>
              )}
              <button style={{ ...S.actionBtn, background: "#1e293b" }} onClick={() => setScreen("home")}>
                Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── REVIEW ── */
  if (screen === "review") {
    const q = wrongQuestions[reviewIndex];
    const userAnswer = answers[questions.indexOf(q)];

    return (
      <div style={S.page}>
        <div style={S.container}>
          <div style={S.quizHeader}>
            <button style={S.backBtn} onClick={() => setScreen("score")}>← Score</button>
            <span style={S.sectionTag}>Review Wrong Answers</span>
          </div>

          <div style={S.progressWrap}>
            <div style={S.progressBar}>
              <div
                style={{
                  ...S.progressFill,
                  width: `${((reviewIndex + 1) / wrongQuestions.length) * 100}%`,
                  background: "#ef4444",
                }}
              />
            </div>
            <span style={S.progressText}>
              {reviewIndex + 1} / {wrongQuestions.length}
            </span>
          </div>

          <div style={S.card}>
            <div style={S.lectureBadge}>{q.lecture}</div>
            <p style={S.questionText} dir="ltr">{q.q}</p>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {q.options.map((opt, i) => {
                let bg = "transparent";
                let border = "1.5px solid #334155";
                let color = "#e2e8f0";
                if (i === q.answer) {
                  bg = "#14532d44";
                  border = "1.5px solid #22c55e";
                  color = "#86efac";
                } else if (i === userAnswer && i !== q.answer) {
                  bg = "#7f1d1d44";
                  border = "1.5px solid #ef4444";
                  color = "#fca5a5";
                }
                return (
                  <div key={i} style={{ ...S.optionBtn, background: bg, border, color }} dir="ltr">
                    <span style={S.optionLetter}>{OPTION_LETTERS[i]}</span>
                    <span>{opt}</span>
                  </div>
                );
              })}
            </div>

            <div style={S.explanationBox}>
              <div style={S.explanationLabel}>
                <span>Explanation</span>
                <span style={{ color: "#94a3b8", fontSize: 13 }}>الشرح</span>
              </div>
              <p style={{ margin: 0, lineHeight: 1.7, color: "#bfdbfe" }} dir="ltr">
                {q.explanation || "—"}
              </p>
            </div>
          </div>

          <div style={S.navRow}>
            <button
              style={{ ...S.navBtn, opacity: reviewIndex === 0 ? 0.35 : 1 }}
              onClick={() => setReviewIndex(i => i - 1)}
              disabled={reviewIndex === 0}
            >
              ← Prev
            </button>
            <button
              style={{ ...S.navBtn, opacity: reviewIndex + 1 >= wrongQuestions.length ? 0.35 : 1 }}
              onClick={() => setReviewIndex(i => i + 1)}
              disabled={reviewIndex + 1 >= wrongQuestions.length}
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

/* ── Styles ── */
const S: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#0f172a",
    color: "#e2e8f0",
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    padding: "24px 16px",
  },
  container: {
    maxWidth: 720,
    margin: "0 auto",
  },
  badge: {
    display: "inline-block",
    background: "#1e3a5f",
    color: "#60a5fa",
    borderRadius: 999,
    padding: "4px 14px",
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  title: {
    margin: 0,
    fontSize: 36,
    fontWeight: 800,
    color: "#f1f5f9",
  },
  subtitle: {
    margin: "6px 0 0",
    fontSize: 16,
    color: "#94a3b8",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: 14,
  },
  sectionBtn: {
    background: "#1e293b",
    border: "1.5px solid #334155",
    borderRadius: 14,
    padding: "20px 16px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 4,
    color: "#e2e8f0",
    transition: "border-color 0.15s",
  },
  btnAr: {
    fontSize: 17,
    fontWeight: 700,
    color: "#f1f5f9",
  },
  btnEn: {
    fontSize: 13,
    color: "#94a3b8",
  },
  btnCount: {
    marginTop: 6,
    fontSize: 12,
    color: "#60a5fa",
    background: "#172554",
    borderRadius: 999,
    padding: "2px 10px",
  },
  quizHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  backBtn: {
    background: "transparent",
    border: "1px solid #334155",
    color: "#94a3b8",
    borderRadius: 8,
    padding: "6px 14px",
    cursor: "pointer",
    fontSize: 13,
  },
  sectionTag: {
    fontSize: 13,
    color: "#60a5fa",
    background: "#172554",
    padding: "4px 12px",
    borderRadius: 999,
  },
  progressWrap: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 18,
  },
  progressBar: {
    flex: 1,
    height: 6,
    background: "#1e293b",
    borderRadius: 999,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    background: "#3b82f6",
    borderRadius: 999,
    transition: "width 0.3s ease",
  },
  progressText: {
    fontSize: 13,
    color: "#64748b",
    whiteSpace: "nowrap",
  },
  card: {
    background: "#1e293b",
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
  },
  lectureBadge: {
    display: "inline-block",
    fontSize: 11,
    background: "#0f172a",
    color: "#7dd3fc",
    borderRadius: 6,
    padding: "3px 10px",
    marginBottom: 14,
    fontWeight: 600,
    letterSpacing: 0.3,
  },
  questionText: {
    fontSize: 17,
    lineHeight: 1.65,
    marginBottom: 20,
    color: "#f1f5f9",
    margin: "0 0 20px",
  },
  optionBtn: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "12px 16px",
    borderRadius: 10,
    cursor: "pointer",
    fontSize: 15,
    textAlign: "left",
    width: "100%",
    transition: "background 0.15s",
  },
  optionLetter: {
    minWidth: 28,
    height: 28,
    background: "#0f172a",
    borderRadius: 6,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    fontSize: 13,
    color: "#94a3b8",
    flexShrink: 0,
  },
  explanationBox: {
    marginTop: 20,
    background: "#172554",
    border: "1.5px solid #1d4ed8",
    borderRadius: 12,
    padding: "14px 18px",
  },
  explanationLabel: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 8,
    fontWeight: 700,
    fontSize: 14,
    color: "#93c5fd",
  },
  navRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: 10,
  },
  navBtn: {
    background: "#1e293b",
    border: "1px solid #334155",
    color: "#e2e8f0",
    borderRadius: 10,
    padding: "10px 22px",
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 600,
  },
  navBtnPrimary: {
    background: "#1d4ed8",
    border: "1px solid #2563eb",
    color: "#fff",
  },
  scoreBig: {
    fontSize: 72,
    fontWeight: 900,
    color: "#f1f5f9",
    lineHeight: 1,
    marginBottom: 8,
  },
  actionBtn: {
    background: "#1d4ed8",
    border: "none",
    color: "#fff",
    borderRadius: 10,
    padding: "11px 24px",
    cursor: "pointer",
    fontSize: 15,
    fontWeight: 600,
  },
};
