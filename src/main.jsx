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

const FOLLOW_UPS = {
  1: { question: "What specifically weighs on you?", options: ["A particular class or student situation", "Admin tasks or paperwork I didn't finish", "A coworker or leadership issue", "Just the weight of all of it combined"] },
  2: { question: "When did you last feel that original spark?", options: ["Within the last month", "Sometime this school year", "It's been over a year", "I honestly can't remember"] },
  3: { question: "What follows you home most often?", options: ["Grading and planning I couldn't finish", "Worry about specific students", "Replaying difficult interactions", "A general anxiety I can't name"] },
  4: { question: "Where do you feel the lack of recognition most?", options: ["From admin or leadership", "From parents", "From the system itself", "Even from students lately"] },
  5: { question: "What's blocking your growth right now?", options: ["No time - I'm in survival mode", "No energy - I'm running on empty", "No support - PD feels pointless", "No motivation - I've stopped caring"] },
  6: { question: "What's driving the disconnect?", options: ["Behavior issues I can't get ahead of", "Too many students, not enough time", "I'm emotionally protecting myself", "I've lost patience I used to have"] },
  7: { question: "What's taking your control away?", options: ["Scripted curriculum I have to follow", "Constant observations or evaluations", "Decisions made without teacher input", "All of the above"] },
  8: { question: "How is it showing up physically?", options: ["Sleep problems - can't fall or stay asleep", "Getting sick more often than normal", "Stress eating or not eating enough", "Headaches, tension, or body pain"] },
  9: { question: "What would need to change for you to stay?", options: ["Better admin or leadership support", "Less workload or more planning time", "Higher pay that reflects my work", "Honestly, I'm not sure anything would"] },
  10: { question: "What's the hardest part to say out loud?", options: ["I'm angry more than I should be", "I cry about work more than I admit", "I've thought about quitting without a plan", "I don't recognize who I've become"] },
};

const getScoreCategory = (score) => {
  if (score >= 35) return { label: "Thriving", emoji: "🔥", color: "#2a9d5c" };
  if (score >= 27) return { label: "Stable But Watching", emoji: "⚡", color: GOLD };
  if (score >= 18) return { label: "Warning Signs Present", emoji: "⚠️", color: "#e07b54" };
  return { label: "At a Breaking Point", emoji: "🆘", color: "#e05454" };
};

function App() {
  const [answers, setAnswers] = useState({});
  const [followUps, setFollowUps] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [error, setError] = useState("");

  const answer = (qId, value) => {
    setAnswers(prev => ({ ...prev, [qId]: value }));
  };

  const answerFollowUp = (qId, value) => {
    setFollowUps(prev => ({ ...prev, [qId]: value }));
  };

  const score = Object.values(answers).reduce((a, b) => a + b, 0);
  const answered = Object.keys(answers).length;
  const category = getScoreCategory(score);
  const progress = (answered / QUESTIONS.length) * 100;
  const q = QUESTIONS[current];
  const currentFollowUp = FOLLOW_UPS[q.id];
  const needsFollowUp = answers[q.id] <= 2 && currentFollowUp;
  const followUpAnswered = followUps[q.id];
  const canProceed = answers[q.id] && (!needsFollowUp || followUpAnswered);

  const handleNext = () => setCurrent(c => c + 1);
  const handleBack = () => setCurrent(c => c - 1);

  const buildPrompt = () => {
    const answerDetails = QUESTIONS.map(q => {
      const selectedValue = answers[q.id];
      const selectedOption = q.options.find(o => o.value === selectedValue);
      let detail = `${q.category} (${selectedValue}/4): "${selectedOption?.label}"`;
      if (followUps[q.id]) {
        detail += `\n   Follow-up revealed: "${followUps[q.id]}"`;
      }
      return detail;
    }).join("\n");

    const lowest = QUESTIONS.reduce((min, q) => answers[q.id] < answers[min.id] ? q : min, QUESTIONS[0]);
    const highest = QUESTIONS.reduce((max, q) => answers[q.id] > answers[max.id] ? q : max, QUESTIONS[0]);
    const followUpCount = Object.keys(followUps).length;
    const criticalAreas = QUESTIONS.filter(q => answers[q.id] === 1).map(q => q.category);

    return `You are an expert educator coach who has worked with hundreds of burned-out teachers. A teacher just completed a burnout audit. Your job is to make them feel SEEN — not give generic advice.

THEIR RESPONSES:
${answerDetails}

TOTAL SCORE: ${score}/40
LOWEST AREA: ${lowest.category} (${answers[lowest.id]}/4)
HIGHEST AREA: ${highest.category} (${answers[highest.id]}/4)
CRITICAL AREAS (scored 1/4): ${criticalAreas.length > 0 ? criticalAreas.join(", ") : "None"}
FOLLOW-UP DETAILS REVEALED: ${followUpCount} areas with deeper context

CRITICAL RULES:
- Use PLAIN TEXT only. No markdown, no asterisks, no hashtags.
- Write in second person ("you") — speak directly to them.
- Be warm but honest. Don't sugarcoat. Don't be clinical.
- You MUST quote or directly reference their specific follow-up answers by name. If they said "Admin tasks or paperwork I didn't finish" follows them home, say exactly that.
- The follow-up answers are the most valuable data — they reveal the real story behind the score. Use every single one.
- If they scored 1 in any area, acknowledge it directly. Don't soften it.
- The "One Thing" MUST be specific to their lowest area AND their follow-up answer. No generic advice like "set boundaries" or "practice self-care."
- Total response under 500 words.

WRITE EXACTLY THIS STRUCTURE:

HEADLINE:
[One punchy, specific sentence that captures their exact situation — not a category name, a real observation]

THE PATTERN I SEE:
[2-3 sentences. Name what their combination of answers reveals that they didn't say out loud. Reference the gap between ${highest.category} and ${lowest.category}. Weave in their follow-up specifics — quote them back.]

WHAT'S ACTUALLY HAPPENING:
[2-3 sentences. Connect their ${lowest.category} score to real downstream consequences in their life. If they gave follow-up answers, reference those exact things by name. Make them feel like you've been in the room with them.]

THE ONE THING:
[One specific action for THIS WEEK that addresses their exact situation. Must reference their lowest area (${lowest.category}) and their follow-up answer if they gave one. Example: if they said admin tasks follow them home, tell them exactly what to do about admin tasks — not "set a boundary" but the specific action. Be concrete enough they could do it tomorrow.]

THE REAL TALK:
[1-2 sentences. The thing a trusted colleague would say that's slightly uncomfortable but true. End with one sentence that acknowledges their strength — not in a generic way, but specific to what their answers reveal about who they are.]`;
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
      if (json.error) { setError("Error generating results: " + json.error); return; }
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

  // ── NAV LOGO ──
  const NavLogo = () => (
    <a href="https://4thdmc.com" target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
      <img
        src="/4thdmc_logo.png"
        alt="4THDMC | EVOLVE LLC"
        style={{ height: 52, width: 52, objectFit: "contain" }}
      />
    </a>
  );

  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(160deg, ${DARK} 0%, ${NAVY} 100%)`, fontFamily: "'Segoe UI', system-ui, sans-serif", padding: "0 0 80px" }}>

      {/* NAV */}
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "10px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <NavLogo />
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, letterSpacing: 2, textTransform: "uppercase" }}>Teacher Toolkit</div>
          <a
            href="https://brrteaching.com/subscribe/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ background: GOLD, color: DARK, fontWeight: 900, fontSize: 11, letterSpacing: 2, textTransform: "uppercase", padding: "8px 16px", borderRadius: 4, textDecoration: "none", whiteSpace: "nowrap" }}
          >
            Subscribe
          </a>
        </div>
      </div>

      <div style={{ maxWidth: 600, margin: "0 auto", padding: "32px 18px" }}>
        {!submitted ? (
          <>
            {/* HEADER */}
            <div style={{ marginBottom: 32, textAlign: "center" }}>
              <div style={{ display: "inline-block", border: `1px solid ${GOLD}`, color: GOLD, fontSize: 10, letterSpacing: 4, padding: "4px 16px", marginBottom: 16, fontWeight: 700, borderRadius: 2, textTransform: "uppercase" }}>
                Free Tool · No Sign-Up Required
              </div>
              <div style={{ fontSize: "clamp(30px, 7vw, 48px)", fontWeight: 900, color: "#fff", lineHeight: 1.05, marginBottom: 10 }}>
                TEACHER BURNOUT<br /><span style={{ color: GOLD }}>AUDIT</span>
              </div>
              <div style={{ width: 48, height: 3, background: GOLD, margin: "0 auto 16px" }} />
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, fontStyle: "italic", lineHeight: 1.7, maxWidth: 440, margin: "0 auto" }}>
                10 honest questions. No fluff.<br />A real picture of where you are — and what to do about it.
              </div>
            </div>

            {/* PROGRESS */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: 2, textTransform: "uppercase", fontWeight: 700 }}>
                  Question {Math.min(current + 1, QUESTIONS.length)} of {QUESTIONS.length}
                </div>
                <div style={{ fontSize: 11, color: GOLD, fontWeight: 700 }}>{answered} answered</div>
              </div>
              <div style={{ height: 5, background: "rgba(255,255,255,0.08)", borderRadius: 3, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${progress}%`, background: `linear-gradient(90deg, ${GOLD}, #e8c86a)`, borderRadius: 3, transition: "width 0.4s ease" }} />
              </div>
            </div>

            {/* MAIN QUESTION */}
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 18, padding: "28px 22px", marginBottom: 16, boxShadow: "0 8px 32px rgba(0,0,0,0.2)" }}>
              <div style={{ display: "inline-block", background: `rgba(201,168,76,0.15)`, border: `1px solid rgba(201,168,76,0.3)`, color: GOLD, fontWeight: 700, fontSize: 10, letterSpacing: 3, textTransform: "uppercase", padding: "3px 10px", borderRadius: 20, marginBottom: 16 }}>
                {q.category}
              </div>
              <div style={{ fontSize: "clamp(15px, 4vw, 18px)", fontWeight: 600, color: "#fff", lineHeight: 1.6, marginBottom: 24 }}>{q.question}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {q.options.map((opt, i) => {
                  const selected = answers[q.id] === opt.value;
                  return (
                    <button key={i} onClick={() => answer(q.id, opt.value)} style={{
                      padding: "15px 18px", borderRadius: 12, cursor: "pointer", textAlign: "left",
                      border: `1px solid ${selected ? GOLD : "rgba(255,255,255,0.12)"}`,
                      background: selected ? "rgba(201,168,76,0.15)" : "rgba(255,255,255,0.02)",
                      color: selected ? GOLD : "rgba(255,255,255,0.75)",
                      fontSize: 14, fontWeight: selected ? 700 : 400,
                      lineHeight: 1.5, transition: "all 0.15s",
                      boxShadow: selected ? `0 0 0 1px ${GOLD}40` : "none"
                    }}>
                      {selected && <span style={{ marginRight: 8 }}>✓</span>}{opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* FOLLOW-UP */}
            {needsFollowUp && (
              <div style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 16, padding: "24px 22px", marginBottom: 16 }}>
                <div style={{ color: GOLD, fontWeight: 700, fontSize: 10, letterSpacing: 3, textTransform: "uppercase", marginBottom: 6 }}>↳ Tell me more</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "#fff", lineHeight: 1.5, marginBottom: 18 }}>{currentFollowUp.question}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {currentFollowUp.options.map((opt, i) => {
                    const selected = followUps[q.id] === opt;
                    return (
                      <button key={i} onClick={() => answerFollowUp(q.id, opt)} style={{
                        padding: "12px 16px", borderRadius: 10, cursor: "pointer", textAlign: "left",
                        border: `1px solid ${selected ? GOLD : "rgba(255,255,255,0.12)"}`,
                        background: selected ? "rgba(201,168,76,0.18)" : "rgba(255,255,255,0.02)",
                        color: selected ? GOLD : "rgba(255,255,255,0.65)",
                        fontSize: 13, fontWeight: selected ? 700 : 400,
                        lineHeight: 1.5, transition: "all 0.15s"
                      }}>
                        {selected && <span style={{ marginRight: 8 }}>✓</span>}{opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* NAV BUTTONS */}
            <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
              {current > 0 && (
                <button onClick={handleBack} style={{ flex: 1, padding: 15, background: "transparent", color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: "pointer", textTransform: "uppercase", letterSpacing: 1 }}>
                  ← Back
                </button>
              )}
              {current < QUESTIONS.length - 1
                ? <button onClick={handleNext} disabled={!canProceed} style={{ flex: 2, padding: 15, background: canProceed ? GOLD : "rgba(201,168,76,0.15)", color: canProceed ? DARK : "rgba(255,255,255,0.2)", border: "none", borderRadius: 10, fontWeight: 900, fontSize: 14, cursor: canProceed ? "pointer" : "not-allowed", textTransform: "uppercase", letterSpacing: 2, transition: "all 0.2s" }}>
                    Next →
                  </button>
                : <button onClick={handleSubmit} disabled={!canProceed} style={{ flex: 2, padding: 15, background: canProceed ? GOLD : "rgba(201,168,76,0.15)", color: canProceed ? DARK : "rgba(255,255,255,0.2)", border: "none", borderRadius: 10, fontWeight: 900, fontSize: 14, cursor: canProceed ? "pointer" : "not-allowed", textTransform: "uppercase", letterSpacing: 2, transition: "all 0.2s" }}>
                    {canProceed ? "See My Results →" : "Answer to Continue"}
                  </button>
              }
            </div>

            {/* QUESTION DOTS */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center" }}>
              {QUESTIONS.map((qu, i) => (
                <button key={i} onClick={() => setCurrent(i)} style={{
                  width: 30, height: 30, borderRadius: "50%", border: "none", cursor: "pointer",
                  background: answers[qu.id] ? GOLD : current === i ? "rgba(201,168,76,0.3)" : "rgba(255,255,255,0.1)",
                  color: answers[qu.id] ? DARK : "rgba(255,255,255,0.5)",
                  fontSize: 11, fontWeight: 700, transition: "all 0.15s"
                }}>{i + 1}</button>
              ))}
            </div>
          </>
        ) : (
          <div>
            {/* RESULT HEADER */}
            <div style={{ marginBottom: 24, textAlign: "center" }}>
              <a href="https://4thdmc.com" target="_blank" rel="noopener noreferrer">
                <img src="/4thdmc_logo.png" alt="4THDMC | EVOLVE LLC" style={{ height: 72, width: 72, objectFit: "contain", marginBottom: 16 }} />
              </a>
              <div style={{ fontSize: 52, marginBottom: 12 }}>{category.emoji}</div>
              <div style={{ display: "inline-block", border: `1px solid ${category.color}`, color: category.color, fontSize: 10, letterSpacing: 4, padding: "4px 16px", marginBottom: 12, fontWeight: 700, borderRadius: 2, textTransform: "uppercase" }}>Your Result</div>
              <div style={{ fontSize: "clamp(28px, 7vw, 42px)", fontWeight: 900, color: "#fff", lineHeight: 1.1, marginBottom: 6 }}>{category.label}</div>
              <div style={{ width: 40, height: 3, background: category.color, margin: "10px auto 0" }} />
            </div>

            {/* SCORE BAR */}
            <div style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${category.color}30`, borderRadius: 14, padding: "20px 24px", marginBottom: 20, display: "flex", alignItems: "center", gap: 20 }}>
              <div style={{ textAlign: "center", flexShrink: 0 }}>
                <div style={{ fontFamily: "serif", fontSize: 52, fontWeight: 900, color: category.color, lineHeight: 1 }}>{score}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", letterSpacing: 2, textTransform: "uppercase" }}>out of 40</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ height: 8, background: "rgba(255,255,255,0.08)", borderRadius: 4, overflow: "hidden", marginBottom: 8 }}>
                  <div style={{ height: "100%", width: `${(score / 40) * 100}%`, background: category.color, borderRadius: 4, transition: "width 0.8s ease" }} />
                </div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", lineHeight: 1.5 }}>
                  {score <= 17 ? "Critical attention needed — something has to change." : score <= 26 ? "Warning signs present — don't wait." : score <= 34 ? "Stable — but worth staying watchful." : "Operating at full strength."}
                </div>
              </div>
            </div>

            {/* LOADING */}
            {loading && (
              <div style={{ background: "#fff", borderRadius: 16, padding: "48px 24px", marginBottom: 16, textAlign: "center", boxShadow: "0 16px 50px rgba(0,0,0,0.4)" }}>
                <div style={{ fontSize: 28, marginBottom: 16 }}>🔍</div>
                <div style={{ color: NAVY, fontWeight: 800, fontSize: 17, marginBottom: 8 }}>Reading between your lines...</div>
                <div style={{ color: "#999", fontSize: 13 }}>Generating your personalized insight</div>
              </div>
            )}

            {error && (
              <div style={{ background: "rgba(255,80,80,0.12)", border: "1px solid rgba(255,80,80,0.3)", color: "#ff9090", padding: "16px 20px", borderRadius: 12, fontSize: 14, marginBottom: 16 }}>{error}</div>
            )}

            {/* AI RESULT */}
            {aiResult && !loading && (
              <div style={{ background: "#fff", borderRadius: 16, padding: "32px 28px", marginBottom: 20, boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}>
                {result.headline && (
                  <div style={{ borderLeft: `4px solid ${category.color}`, paddingLeft: 18, marginBottom: 28 }}>
                    <div style={{ fontWeight: 900, fontSize: 21, color: NAVY, lineHeight: 1.3 }}>{result.headline}</div>
                  </div>
                )}
                {result.pattern && (
                  <div style={{ marginBottom: 22 }}>
                    <div style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: 3, color: category.color, textTransform: "uppercase", marginBottom: 8, fontWeight: 700 }}>The Pattern I See</div>
                    <p style={{ fontSize: 15, color: "#444", lineHeight: 1.85, margin: 0 }}>{result.pattern}</p>
                  </div>
                )}
                {result.happening && (
                  <div style={{ marginBottom: 22 }}>
                    <div style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: 3, color: category.color, textTransform: "uppercase", marginBottom: 8, fontWeight: 700 }}>What's Actually Happening</div>
                    <p style={{ fontSize: 15, color: "#444", lineHeight: 1.85, margin: 0 }}>{result.happening}</p>
                  </div>
                )}
                {result.oneThing && (
                  <div style={{ background: `linear-gradient(135deg, rgba(201,168,76,0.08), rgba(201,168,76,0.04))`, border: "1px solid rgba(201,168,76,0.25)", borderRadius: 12, padding: "20px 22px", marginBottom: 22 }}>
                    <div style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: 3, color: NAVY, textTransform: "uppercase", marginBottom: 8, fontWeight: 700 }}>The One Thing This Week</div>
                    <p style={{ fontSize: 15, color: "#333", lineHeight: 1.75, margin: 0, fontWeight: 600 }}>{result.oneThing}</p>
                  </div>
                )}
                {result.realTalk && (
                  <div style={{ borderTop: "2px solid #f0ece0", paddingTop: 22 }}>
                    <div style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: 3, color: "#bbb", textTransform: "uppercase", marginBottom: 8, fontWeight: 700 }}>Real Talk</div>
                    <p style={{ fontSize: 15, color: "#555", lineHeight: 1.85, margin: 0, fontStyle: "italic" }}>{result.realTalk}</p>
                  </div>
                )}
              </div>
            )}

            {/* CTA BLOCK */}
            {aiResult && !loading && (
              <div style={{ background: `linear-gradient(135deg, rgba(27,58,107,0.6), rgba(13,27,42,0.8))`, border: `1px solid rgba(201,168,76,0.3)`, borderRadius: 16, padding: "32px 24px", marginBottom: 16, textAlign: "center" }}>
                <a href="https://4thdmc.com" target="_blank" rel="noopener noreferrer">
                  <img src="/4thdmc_logo.png" alt="4THDMC | EVOLVE LLC" style={{ height: 60, width: 60, objectFit: "contain", marginBottom: 16 }} />
                </a>
                <div style={{ color: GOLD, fontWeight: 800, fontSize: 13, letterSpacing: 3, textTransform: "uppercase", marginBottom: 10 }}>
                  This is just the beginning
                </div>
                <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 15, lineHeight: 1.7, marginBottom: 24, maxWidth: 420, margin: "0 auto 24px" }}>
                  The Teacher Toolkit gives you AI-powered tools that save hours every week — lesson plans, sub plans, assignment grading, differentiation, and more. Built by a teacher, for teachers.
                </div>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
                  <a
                    href="https://brrteaching.com/subscribe/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ background: GOLD, color: DARK, fontWeight: 900, fontSize: 13, letterSpacing: 2, textTransform: "uppercase", padding: "16px 28px", borderRadius: 6, textDecoration: "none", display: "inline-block", boxShadow: "0 4px 20px rgba(201,168,76,0.35)" }}
                  >
                    Subscribe to the Toolkit →
                  </a>
                  <a
                    href="https://4thdmc.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ background: "transparent", color: "rgba(255,255,255,0.7)", fontWeight: 700, fontSize: 13, letterSpacing: 2, textTransform: "uppercase", padding: "16px 28px", borderRadius: 6, textDecoration: "none", display: "inline-block", border: "1px solid rgba(255,255,255,0.2)" }}
                  >
                    Work with Brandon
                  </a>
                </div>
              </div>
            )}

            <button onClick={() => { setAnswers({}); setFollowUps({}); setSubmitted(false); setCurrent(0); setAiResult(null); setError(""); }} style={{ width: "100%", padding: 14, background: "transparent", color: "rgba(255,255,255,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, fontWeight: 700, fontSize: 12, cursor: "pointer", textTransform: "uppercase", letterSpacing: 1 }}>
              ← Retake the Audit
            </button>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div style={{ textAlign: "center", color: "rgba(255,255,255,0.18)", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", marginTop: 20, padding: "0 18px" }}>
        © 2026 4THDMC | EVOLVE LLC · All Rights Reserved<br />
        <span style={{ color: "rgba(201,168,76,0.25)" }}>Brandon Russell · The Multiplier · Chattanooga, TN</span>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode><App /></React.StrictMode>
)
