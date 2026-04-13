import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'

const NAVY = "#1B3A6B";
const GOLD = "#C9A84C";
const DARK = "#0d1b2a";

const QUESTIONS = [
  { id: 1, category: "Energy", question: "How do you feel on Sunday evening thinking about the week ahead?", options: [{ value: 4, label: "Ready. I'm genuinely looking forward to it." }, { value: 3, label: "Neutral. It's fine. Another week." }, { value: 2, label: "A low-level dread I've learned to ignore." }, { value: 1, label: "Honestly? It ruins my whole Sunday." }] },
  { id: 2, category: "Purpose", question: "When you close your classroom door and the day starts — how connected do you feel to WHY you became an educator?", options: [{ value: 4, label: "Very connected. That purpose still drives me daily." }, { value: 3, label: "Sometimes. On the good days." }, { value: 2, label: "I'm going through the motions more than I'd like to admit." }, { value: 1, label: "I've lost it. I don't know why I'm still here." }] },
  { id: 3, category: "Boundaries", question: "How often does work follow you home — mentally or physically?", options: [{ value: 4, label: "Rarely. I protect my personal time intentionally." }, { value: 3, label: "Sometimes, but I manage it." }, { value: 2, label: "Most nights. I can't fully switch off." }, { value: 1, label: "Always. There is no 'off.'" }] },
  { id: 4, category: "Recognition", question: "Do you feel genuinely valued — by leadership, students, or the system?", options: [{ value: 4, label: "Yes. My contributions are seen and acknowledged." }, { value: 3, label: "By some people. Not consistently." }, { value: 2, label: "Rarely. I feel invisible most of the time." }, { value: 1, label: "Not at all. I feel like a number." }] },
  { id: 5, category: "Growth", question: "When did you last learn something new — in your profession or personally — and apply it in your classroom?", options: [{ value: 4, label: "Recently. I'm always evolving my practice." }, { value: 3, label: "A while ago, but I want to get back to it." }, { value: 2, label: "I can't remember. Survival mode leaves no room for growth." }, { value: 1, label: "Growth feels like a luxury I can't afford right now." }] },
  { id: 6, category: "Relationships", question: "How are your relationships with your students right now?", options: [{ value: 4, label: "Strong. That connection is why I show up." }, { value: 3, label: "Good with most. Struggling with a few." }, { value: 2, label: "I've pulled back. I don't have the bandwidth." }, { value: 1, label: "I feel disconnected from them entirely." }] },
  { id: 7, category: "Control", question: "How much ownership do you feel over your own classroom and practice?", options: [{ value: 4, label: "A lot. I run my room my way." }, { value: 3, label: "Some. There are constraints but I work within them." }, { value: 2, label: "Not much. I feel micromanaged or boxed in." }, { value: 1, label: "None. I'm just executing someone else's vision." }] },
  { id: 8, category: "Physical", question: "How is the job affecting you physically?", options: [{ value: 4, label: "I'm taking care of myself. Energy levels are decent." }, { value: 3, label: "Some fatigue but nothing alarming." }, { value: 2, label: "Regularly exhausted. Getting sick more than I should." }, { value: 1, label: "My body is telling me something has to change." }] },
  { id: 9, category: "Future", question: "When you picture yourself five years from now, what do you see?", options: [{ value: 4, label: "Still in education, growing, building something meaningful." }, { value: 3, label: "Maybe still here. I haven't thought about it much." }, { value: 2, label: "Honestly, I see myself leaving if things don't change." }, { value: 1, label: "I'm already mentally out the door." }] },
  { id: 10, category: "Honest Check", question: "If a close friend asked you right now — 'Are you okay?' — what would you say honestly?", options: [{ value: 4, label: "Yes. I really am." }, { value: 3, label: "Mostly. Some things I'm working through." }, { value: 2, label: "Not really. But I keep moving." }, { value: 1, label: "No. And I need something to change." }] },
];

const getScoreCategory = (score) => {
  if (score >= 35) return { label: "Thriving", emoji: "🔥", color: "#2a9d5c" };
  if (score >= 27) return { label: "Stable But Watching", emoji: "⚡", color: GOLD };
  if (score >= 18) return { label: "Warning Signs Present", emoji: "⚠️", color: "#e07b54" };
  return { label: "At a Breaking Point", emoji: "🆘", color: "#e05454" };
};

function App() {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [error, setError] = useState("");

  const answer = (qId, value) => setAnswers(prev => ({ ...prev, [qId]: value }));
  const score = Object.values(answers).reduce((a, b) => a + b, 0);
  const answered = Object.keys(answers).length;
  const category = getScoreCategory(score);
  const progress = (answered / QUESTIONS.length) * 100;
  const allAnswered = answered === QUESTIONS.length;
  const q = QUESTIONS[current];

  const buildPrompt = () => {
    const answerDetails = QUESTIONS.map(q => {
      const selectedValue = answers[q.id];
      const selectedOption = q.options.find(o => o.value === selectedValue);
      return `${q.category} (${selectedValue}/4): "${selectedOption?.label}"`;
    }).join("\n");

    const lowest = QUESTIONS.reduce((min, q) => answers[q.id] < answers[min.id] ? q : min, QUESTIONS[0]);
    const highest = QUESTIONS.reduce((max, q) => answers[q.id] > answers[max.id] ? q : max, QUESTIONS[0]);

    return `You are an expert educator coach who has worked with hundreds of burned-out teachers. A teacher just completed a burnout audit. Your job is to make them feel SEEN - not give generic advice.

THEIR RESPONSES:
${answerDetails}

TOTAL SCORE: ${score}/40
LOWEST AREA: ${lowest.category} (${answers[lowest.id]}/4)
HIGHEST AREA: ${highest.category} (${answers[highest.id]}/4)

CRITICAL FORMATTING RULES:
- Use PLAIN TEXT only. No markdown, no asterisks, no hashtags, no bullet symbols.
- Write in second person ("you") - speak directly to them.
- Be warm but honest. Don't sugarcoat, but don't be harsh.
- Reference their SPECIFIC answers - quote their exact words back to them.
- Total response must be under 500 words.

WRITE EXACTLY THIS STRUCTURE:

HEADLINE:
[One punchy sentence that captures their situation - make it land]

THE PATTERN I SEE:
[2-3 sentences identifying what their specific combination of answers reveals. Name something they didn't say out loud but their answers imply. Reference the gap between their highest and lowest scores. This is where they should feel "this tool gets me."]

WHAT'S ACTUALLY HAPPENING:
[2-3 sentences explaining the deeper dynamic at play. Connect their ${lowest.category} score to real consequences. Be specific, not generic.]

THE ONE THING:
[One specific, actionable thing they should do THIS WEEK based on their lowest scoring area. Not "set boundaries" - something concrete like "Pick one night this week where you do not open your laptop after 7pm. Put your phone in another room. See what happens."]

THE REAL TALK:
[1-2 sentences that are slightly uncomfortable but true. The thing a good friend would say. End with something that acknowledges their strength for even taking this audit.]

Remember: Generic advice like "practice self-care" or "set boundaries" will be ignored. Reference their actual answers. Make them feel like you read their specific situation, not a score range.`;
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setSubmitted(true);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: buildPrompt() })
      });
      const json = await res.json();
      if (json.error) {
        setError("Error generating results: " + json.error);
        return;
      }
      setAiResult(json.text);
    } catch (e) {
      setError("Request failed: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const parseResult = (text) => {
    if (!text) return {};
    const sections = {};
    const patterns = [
      { key: "headline", regex: /HEADLINE:\s*\n?([\s\S]*?)(?=\n\s*THE PATTERN|$)/i },
      { key: "pattern", regex: /THE PATTERN I SEE:\s*\n?([\s\S]*?)(?=\n\s*WHAT'S ACTUALLY|$)/i },
      { key: "happening", regex: /WHAT'S ACTUALLY HAPPENING:\s*\n?([\s\S]*?)(?=\n\s*THE ONE THING|$)/i },
      { key: "oneThing", regex: /THE ONE THING:\s*\n?([\s\S]*?)(?=\n\s*THE REAL TALK|$)/i },
      { key: "realTalk", regex: /THE REAL TALK:\s*\n?([\s\S]*?)$/i },
    ];
    patterns.forEach(({ key, regex }) => {
      const match = text.match(regex);
      if (match) sections[key] = match[1].trim();
    });
    return sections;
  };

  const result = parseResult(aiResult);

  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(160deg, ${DARK} 0%, ${NAVY} 100%)`, fontFamily: "'Segoe UI', system-ui, sans-serif", padding: "0 0 80px" }}>
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontWeight: 900, fontSize: 16, color: "#fff", letterSpacing: 1 }}>4THDMC <span style={{ color: GOLD }}>|</span> EVOLVE</div>
        <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, letterSpacing: 2, textTransform: "uppercase" }}>Teacher Toolkit</div>
      </div>
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "32px 18px" }}>
        {!submitted ? (
          <>
            <div style={{ marginBottom: 28 }}>
              <div style={{ display: "inline-block", border: `1px solid ${GOLD}`, color: GOLD, fontSize: 10, letterSpacing: 4, padding: "4px 14px", marginBottom: 12, fontWeight: 700, borderRadius: 2, textTransform: "uppercase" }}>4THDMC | EVOLVE</div>
              <div style={{ fontSize: "clamp(26px, 7vw, 40px)", fontWeight: 900, color: "#fff", lineHeight: 1.1 }}>TEACHER BURNOUT<br /><span style={{ color: GOLD }}>AUDIT</span></div>
              <div style={{ width: 40, height: 3, background: GOLD, margin: "12px 0 8px" }} />
              <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, fontStyle: "italic", lineHeight: 1.6 }}>10 honest questions. No fluff. A real picture of where you are — and what to do about it.</div>
            </div>
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: 2, textTransform: "uppercase", fontWeight: 700 }}>Question {Math.min(current + 1, QUESTIONS.length)} of {QUESTIONS.length}</div>
                <div style={{ fontSize: 11, color: GOLD, fontWeight: 700 }}>{answered} answered</div>
              </div>
              <div style={{ height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 2, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${progress}%`, background: GOLD, borderRadius: 2, transition: "width 0.4s ease" }} />
              </div>
            </div>
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: "28px 22px", marginBottom: 16 }}>
              <div style={{ color: GOLD, fontWeight: 700, fontSize: 10, letterSpacing: 3, textTransform: "uppercase", marginBottom: 14 }}>Category: {q.category}</div>
              <div style={{ fontSize: "clamp(15px, 4vw, 18px)", fontWeight: 600, color: "#fff", lineHeight: 1.5, marginBottom: 24 }}>{q.question}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {q.options.map((opt, i) => {
                  const selected = answers[q.id] === opt.value;
                  return <button key={i} onClick={() => answer(q.id, opt.value)} style={{ padding: "14px 18px", borderRadius: 10, cursor: "pointer", textAlign: "left", border: `1px solid ${selected ? GOLD : "rgba(255,255,255,0.15)"}`, background: selected ? "rgba(201,168,76,0.15)" : "rgba(255,255,255,0.02)", color: selected ? GOLD : "rgba(255,255,255,0.75)", fontSize: 14, fontWeight: selected ? 700 : 400, lineHeight: 1.5, transition: "all 0.15s" }}>{selected && <span style={{ marginRight: 8 }}>✓</span>}{opt.label}</button>;
                })}
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
              {current > 0 && <button onClick={() => setCurrent(c => c - 1)} style={{ flex: 1, padding: 14, background: "transparent", color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: "pointer", textTransform: "uppercase", letterSpacing: 1 }}>← Back</button>}
              {current < QUESTIONS.length - 1
                ? <button onClick={() => setCurrent(c => c + 1)} disabled={!answers[q.id]} style={{ flex: 2, padding: 14, background: answers[q.id] ? GOLD : "rgba(201,168,76,0.2)", color: answers[q.id] ? DARK : "rgba(255,255,255,0.2)", border: "none", borderRadius: 10, fontWeight: 900, fontSize: 14, cursor: answers[q.id] ? "pointer" : "not-allowed", textTransform: "uppercase", letterSpacing: 2 }}>Next →</button>
                : <button onClick={handleSubmit} disabled={!allAnswered} style={{ flex: 2, padding: 14, background: allAnswered ? GOLD : "rgba(201,168,76,0.2)", color: allAnswered ? DARK : "rgba(255,255,255,0.2)", border: "none", borderRadius: 10, fontWeight: 900, fontSize: 14, cursor: allAnswered ? "pointer" : "not-allowed", textTransform: "uppercase", letterSpacing: 2 }}>{allAnswered ? "See My Results →" : "Answer All Questions First"}</button>
              }
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center" }}>
              {QUESTIONS.map((q, i) => <button key={i} onClick={() => setCurrent(i)} style={{ width: 28, height: 28, borderRadius: "50%", border: "none", cursor: "pointer", background: answers[q.id] ? GOLD : current === i ? "rgba(201,168,76,0.3)" : "rgba(255,255,255,0.1)", color: answers[q.id] ? DARK : "rgba(255,255,255,0.5)", fontSize: 11, fontWeight: 700 }}>{i + 1}</button>)}
            </div>
          </>
        ) : (
          <div>
            <div style={{ marginBottom: 24, textAlign: "center" }}>
              <div style={{ fontSize: 52, marginBottom: 12 }}>{category.emoji}</div>
              <div style={{ display: "inline-block", border: `1px solid ${category.color}`, color: category.color, fontSize: 10, letterSpacing: 4, padding: "4px 16px", marginBottom: 12, fontWeight: 700, borderRadius: 2, textTransform: "uppercase" }}>Your Result</div>
              <div style={{ fontSize: "clamp(28px, 7vw, 42px)", fontWeight: 900, color: "#fff", lineHeight: 1.1, marginBottom: 6 }}>{category.label}</div>
              <div style={{ width: 40, height: 3, background: category.color, margin: "10px auto 0" }} />
            </div>
            <div style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${category.color}30`, borderRadius: 12, padding: "20px 24px", marginBottom: 20, display: "flex", alignItems: "center", gap: 20 }}>
              <div style={{ textAlign: "center", flexShrink: 0 }}>
                <div style={{ fontFamily: "serif", fontSize: 48, fontWeight: 900, color: category.color, lineHeight: 1 }}>{score}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", letterSpacing: 2, textTransform: "uppercase" }}>out of 40</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ height: 8, background: "rgba(255,255,255,0.08)", borderRadius: 4, overflow: "hidden", marginBottom: 8 }}>
                  <div style={{ height: "100%", width: `${(score / 40) * 100}%`, background: category.color, borderRadius: 4 }} />
                </div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", lineHeight: 1.5 }}>{score <= 17 ? "Critical attention needed" : score <= 26 ? "Warning signs present" : score <= 34 ? "Stable — stay watchful" : "Operating at full strength"}</div>
              </div>
            </div>

            {loading && (
              <div style={{ background: "#fff", borderRadius: 14, padding: "40px 24px", marginBottom: 16, textAlign: "center", boxShadow: "0 16px 50px rgba(0,0,0,0.4)" }}>
                <div style={{ fontSize: 24, marginBottom: 16 }}>🔍</div>
                <div style={{ color: NAVY, fontWeight: 700, fontSize: 16, marginBottom: 8 }}>Reading between your lines...</div>
                <div style={{ color: "#888", fontSize: 13 }}>Generating your personalized insight</div>
              </div>
            )}

            {error && (
              <div style={{ background: "rgba(255,80,80,0.12)", border: "1px solid rgba(255,80,80,0.3)", color: "#ff9090", padding: "16px 20px", borderRadius: 12, fontSize: 14, marginBottom: 16 }}>{error}</div>
            )}

            {aiResult && !loading && (
              <div style={{ background: "#fff", borderRadius: 14, padding: "28px 24px", marginBottom: 16, boxShadow: "0 16px 50px rgba(0,0,0,0.4)" }}>
                {result.headline && (
                  <div style={{ borderLeft: `4px solid ${category.color}`, paddingLeft: 16, marginBottom: 24 }}>
                    <div style={{ fontWeight: 900, fontSize: 20, color: NAVY, lineHeight: 1.3 }}>{result.headline}</div>
                  </div>
                )}

                {result.pattern && (
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: 3, color: category.color, textTransform: "uppercase", marginBottom: 8, fontWeight: 700 }}>The Pattern I See</div>
                    <p style={{ fontSize: 15, color: "#444", lineHeight: 1.8, margin: 0 }}>{result.pattern}</p>
                  </div>
                )}

                {result.happening && (
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: 3, color: category.color, textTransform: "uppercase", marginBottom: 8, fontWeight: 700 }}>What's Actually Happening</div>
                    <p style={{ fontSize: 15, color: "#444", lineHeight: 1.8, margin: 0 }}>{result.happening}</p>
                  </div>
                )}

                {result.oneThing && (
                  <div style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 10, padding: "16px 20px", marginBottom: 20 }}>
                    <div style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: 3, color: NAVY, textTransform: "uppercase", marginBottom: 8, fontWeight: 700 }}>The One Thing This Week</div>
                    <p style={{ fontSize: 15, color: "#333", lineHeight: 1.7, margin: 0, fontWeight: 500 }}>{result.oneThing}</p>
                  </div>
                )}

                {result.realTalk && (
                  <div style={{ borderTop: "2px solid #f4f1eb", paddingTop: 20 }}>
                    <div style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: 3, color: "#999", textTransform: "uppercase", marginBottom: 8, fontWeight: 700 }}>Real Talk</div>
                    <p style={{ fontSize: 15, color: "#555", lineHeight: 1.8, margin: 0, fontStyle: "italic" }}>{result.realTalk}</p>
                  </div>
                )}
              </div>
            )}

            <div style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 12, padding: "24px 20px", marginBottom: 16, textAlign: "center" }}>
              <div style={{ color: GOLD, fontWeight: 700, fontSize: 11, letterSpacing: 3, textTransform: "uppercase", marginBottom: 8 }}>Ready to go deeper?</div>
              <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, lineHeight: 1.6, marginBottom: 16 }}>I work with educators one-on-one and run workshops for school teams. If this audit lit something up — that's worth a conversation.</div>
              <a href="mailto:brandon@4thdmc.com" style={{ display: "inline-block", background: GOLD, color: DARK, fontWeight: 900, fontSize: 11, letterSpacing: 3, textTransform: "uppercase", padding: "14px 28px", borderRadius: 4, textDecoration: "none" }}>Get in Touch →</a>
            </div>
            <button onClick={() => { setAnswers({}); setSubmitted(false); setCurrent(0); setAiResult(null); setError(""); }} style={{ width: "100%", padding: 14, background: "transparent", color: "rgba(255,255,255,0.35)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, fontWeight: 700, fontSize: 12, cursor: "pointer", textTransform: "uppercase", letterSpacing: 1 }}>← Retake the Audit</button>
          </div>
        )}
      </div>
      <div style={{ textAlign: "center", color: "rgba(255,255,255,0.18)", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", marginTop: 20 }}>
        Powered by <span style={{ color: "rgba(201,168,76,0.35)" }}>4THDMC | EVOLVE LLC</span> · Brandon Russell
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode><App /></React.StrictMode>
)
