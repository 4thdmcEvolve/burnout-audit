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

const RESULTS = {
  thriving: { range: [35, 40], label: "Thriving", emoji: "🔥", color: "#2a9d5c", headline: "You're built different right now.", body: "Your energy, purpose, and presence are all firing. That's not an accident — it's the result of intentional choices. The risk at this level isn't burnout, it's complacency. The question isn't how to survive. It's how to multiply. This is the exact moment to invest in your growth, take on a new challenge, and pull others up with you.", actions: ["Mentor a colleague who's struggling — your perspective is medicine right now", "Document what's working in your practice before you forget it", "Set a 90-day growth goal that scares you slightly", "Explore the 4THDMC | EVOLVE workshops — you're ready for the next level"] },
  stable: { range: [27, 34], label: "Stable But Watching", emoji: "⚡", color: GOLD, headline: "You're okay — but 'okay' has an expiration date.", body: "You're functioning well. Most days are manageable. But there are patterns here that, left unchecked, will compound. The teacher who burns out rarely sees it coming — they were 'fine' until they weren't. The fact that you're paying attention right now is your advantage. Use it.", actions: ["Identify the one area scoring lowest and give it focused attention this month", "Build one non-negotiable boundary around your personal time — and hold it", "Reconnect with your original purpose — write it down somewhere you'll see it", "Use the Differentiation Helper and Sub Plan tools to reclaim 2-3 hours a week"] },
  warning: { range: [18, 26], label: "Warning Signs Present", emoji: "⚠️", color: "#e07b54", headline: "This is the conversation you need to have with yourself.", body: "You're carrying more than you should, and it's showing up in ways you may be minimizing. This isn't weakness — it's what happens when people who care deeply operate in systems that take more than they give. But staying here will cost you more than the job is worth. Something has to shift. Not eventually. Now.", actions: ["Have an honest conversation with someone you trust — don't carry this alone", "Identify one thing you can stop doing or delegate this week — start small", "Use the free tools to cut your workload immediately — that time belongs to you", "Seriously consider reaching out about a 1-on-1 coaching conversation"] },
  crisis: { range: [10, 17], label: "At a Breaking Point", emoji: "🆘", color: "#e05454", headline: "I'm not going to sugarcoat this.", body: "You are at or near a breaking point. The fact that you finished this audit means part of you is still fighting — hold onto that. But what you're describing is not sustainable and you know it. Teaching at this level of depletion doesn't just hurt you — it limits what you can give the students who need you most. Something real needs to change, and you deserve support in figuring out what that is.", actions: ["Talk to someone today — a trusted colleague, family member, or counselor", "Take a real mental health day without guilt — you have earned it", "Write down the three things draining you most and share them with your admin or union rep", "Reach out directly — a conversation about next steps costs nothing"] },
};

const getResult = (score) => Object.values(RESULTS).find(r => score >= r.range[0] && score <= r.range[1]) || RESULTS.warning;

function App() {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [current, setCurrent] = useState(0);

  const answer = (qId, value) => setAnswers(prev => ({ ...prev, [qId]: value }));
  const score = Object.values(answers).reduce((a, b) => a + b, 0);
  const answered = Object.keys(answers).length;
  const result = getResult(score);
  const progress = (answered / QUESTIONS.length) * 100;
  const allAnswered = answered === QUESTIONS.length;
  const q = QUESTIONS[current];

  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(160deg, ${DARK} 0%, ${NAVY} 100%)`, fontFamily: "'Segoe UI', system-ui, sans-serif", padding: "0 0 80px" }}>
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontWeight: 900, fontSize: 16, color: "#fff", letterSpacing: 1 }}>4THDMC <span style={{ color: GOLD }}>|</span> EVOLVE</div>
        <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, letterSpacing: 2, textTransform: "uppercase" }}>Subscriber Exclusive</div>
      </div>
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "32px 18px" }}>
        {!submitted ? (
          <>
            <div style={{ marginBottom: 28 }}>
              <div style={{ display: "inline-block", border: `1px solid ${GOLD}`, color: GOLD, fontSize: 10, letterSpacing: 4, padding: "4px 14px", marginBottom: 12, fontWeight: 700, borderRadius: 2, textTransform: "uppercase" }}>🔒 Subscriber Exclusive</div>
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
                : <button onClick={() => setSubmitted(true)} disabled={!allAnswered} style={{ flex: 2, padding: 14, background: allAnswered ? GOLD : "rgba(201,168,76,0.2)", color: allAnswered ? DARK : "rgba(255,255,255,0.2)", border: "none", borderRadius: 10, fontWeight: 900, fontSize: 14, cursor: allAnswered ? "pointer" : "not-allowed", textTransform: "uppercase", letterSpacing: 2 }}>{allAnswered ? "See My Results →" : "Answer All Questions First"}</button>
              }
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center" }}>
              {QUESTIONS.map((q, i) => <button key={i} onClick={() => setCurrent(i)} style={{ width: 28, height: 28, borderRadius: "50%", border: "none", cursor: "pointer", background: answers[q.id] ? GOLD : current === i ? "rgba(201,168,76,0.3)" : "rgba(255,255,255,0.1)", color: answers[q.id] ? DARK : "rgba(255,255,255,0.5)", fontSize: 11, fontWeight: 700 }}>{i + 1}</button>)}
            </div>
          </>
        ) : (
          <div>
            <div style={{ marginBottom: 24, textAlign: "center" }}>
              <div style={{ fontSize: 52, marginBottom: 12 }}>{result.emoji}</div>
              <div style={{ display: "inline-block", border: `1px solid ${result.color}`, color: result.color, fontSize: 10, letterSpacing: 4, padding: "4px 16px", marginBottom: 12, fontWeight: 700, borderRadius: 2, textTransform: "uppercase" }}>Your Result</div>
              <div style={{ fontSize: "clamp(28px, 7vw, 42px)", fontWeight: 900, color: "#fff", lineHeight: 1.1, marginBottom: 6 }}>{result.label}</div>
              <div style={{ width: 40, height: 3, background: result.color, margin: "10px auto 0" }} />
            </div>
            <div style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${result.color}30`, borderRadius: 12, padding: "20px 24px", marginBottom: 20, display: "flex", alignItems: "center", gap: 20 }}>
              <div style={{ textAlign: "center", flexShrink: 0 }}>
                <div style={{ fontFamily: "serif", fontSize: 48, fontWeight: 900, color: result.color, lineHeight: 1 }}>{score}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", letterSpacing: 2, textTransform: "uppercase" }}>out of 40</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ height: 8, background: "rgba(255,255,255,0.08)", borderRadius: 4, overflow: "hidden", marginBottom: 8 }}>
                  <div style={{ height: "100%", width: `${(score / 40) * 100}%`, background: result.color, borderRadius: 4 }} />
                </div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", lineHeight: 1.5 }}>{score <= 17 ? "Critical attention needed" : score <= 26 ? "Warning signs present" : score <= 34 ? "Stable — stay watchful" : "Operating at full strength"}</div>
              </div>
            </div>
            <div style={{ background: "#fff", borderRadius: 14, padding: "28px 24px", marginBottom: 16, boxShadow: "0 16px 50px rgba(0,0,0,0.4)" }}>
              <div style={{ borderLeft: `4px solid ${result.color}`, paddingLeft: 16, marginBottom: 20 }}>
                <div style={{ fontWeight: 900, fontSize: 18, color: NAVY, marginBottom: 6, lineHeight: 1.3 }}>{result.headline}</div>
              </div>
              <p style={{ fontSize: 15, color: "#444", lineHeight: 1.8, margin: "0 0 24px" }}>{result.body}</p>
              <div style={{ borderTop: "2px solid #f4f1eb", paddingTop: 20 }}>
                <div style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: 3, color: NAVY, textTransform: "uppercase", marginBottom: 14, fontWeight: 700 }}>Your Next Steps</div>
                {result.actions.map((action, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, marginBottom: 12, alignItems: "flex-start" }}>
                    <div style={{ width: 20, height: 20, background: result.color, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                      <span style={{ color: "#fff", fontSize: 11, fontWeight: 900 }}>{i + 1}</span>
                    </div>
                    <div style={{ fontSize: 14, color: "#333", lineHeight: 1.6 }}>{action}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 12, padding: "24px 20px", marginBottom: 16, textAlign: "center" }}>
              <div style={{ color: GOLD, fontWeight: 700, fontSize: 11, letterSpacing: 3, textTransform: "uppercase", marginBottom: 8 }}>Ready to go deeper?</div>
              <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, lineHeight: 1.6, marginBottom: 16 }}>Brandon works with educators one-on-one and runs workshops for school districts. If this audit lit something up — that's worth a conversation.</div>
              <a href="mailto:cario333ccc@gmail.com" style={{ display: "inline-block", background: GOLD, color: DARK, fontWeight: 900, fontSize: 11, letterSpacing: 3, textTransform: "uppercase", padding: "14px 28px", borderRadius: 4, textDecoration: "none" }}>Get in Touch →</a>
            </div>
            <button onClick={() => { setAnswers({}); setSubmitted(false); setCurrent(0); }} style={{ width: "100%", padding: 14, background: "transparent", color: "rgba(255,255,255,0.35)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, fontWeight: 700, fontSize: 12, cursor: "pointer", textTransform: "uppercase", letterSpacing: 1 }}>← Retake the Audit</button>
          </div>
        )}
      </div>
      <div style={{ textAlign: "center", color: "rgba(255,255,255,0.18)", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", marginTop: 20 }}>
        Powered by <span style={{ color: "rgba(201,168,76,0.35)" }}>4THDMC | EVOLVE</span> · Brandon Russell
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode><App /></React.StrictMode>
)
