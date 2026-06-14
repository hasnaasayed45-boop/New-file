import { useState, useEffect } from "react";

export default function App() {
  const skillOptions = ["Networking", "Security", "DevOps", "Cloud"];

  const [engineers, setEngineers] = useState(() => {
    const saved = localStorage.getItem("engineers");
    return saved ? JSON.parse(saved) : [];
  });

  const [name, setName] = useState("");
  const [experience, setExperience] = useState("");
  const [courses, setCourses] = useState("");
  const [certifications, setCertifications] = useState("");
  const [capabilities, setCapabilities] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [skills, setSkills] = useState({
    Networking: 0,
    Security: 0,
    DevOps: 0,
    Cloud: 0
  });

  const [projectSkills, setProjectSkills] = useState([]);
  const [results, setResults] = useState([]);
  const [team, setTeam] = useState({});

  useEffect(() => {
    localStorage.setItem("engineers", JSON.stringify(engineers));
  }, [engineers]);

  function resetForm() {
    setName("");
    setExperience("");
    setCourses("");
    setCertifications("");
    setCapabilities("");
    setEditingId(null);
    setSkills({
      Networking: 0,
      Security: 0,
      DevOps: 0,
      Cloud: 0
    });
  }

  function addOrUpdateEngineer() {
    if (!name) return;

    const newEngineer = {
      id: editingId || Date.now(),
      name,
      experience,
      courses,
      certifications,
      capabilities,
      skills
    };

    if (editingId) {
      setEngineers(engineers.map(e => e.id === editingId ? newEngineer : e));
    } else {
      setEngineers([...engineers, newEngineer]);
    }

    resetForm();
  }

  function deleteEngineer(id) {
    setEngineers(engineers.filter(e => e.id !== id));
  }

  function editEngineer(e) {
    setName(e.name);
    setExperience(e.experience);
    setCourses(e.courses || "");
    setCertifications(e.certifications || "");
    setCapabilities(e.capabilities || "");
    setSkills(e.skills || {
      Networking: 0,
      Security: 0,
      DevOps: 0,
      Cloud: 0
    });
    setEditingId(e.id);
  }

  function hasSkillMatch(skill, text) {
    const t = (text || "").toLowerCase();

    if (skill === "Networking") return t.includes("network") || t.includes("ccna") || t.includes("ccnp");
    if (skill === "Security") return t.includes("security") || t.includes("cyber");
    if (skill === "DevOps") return t.includes("devops") || t.includes("docker");
    if (skill === "Cloud") return t.includes("cloud") || t.includes("aws") || t.includes("azure");

    return false;
  }

  function matchEngineers() {
    const matched = engineers.map(e => {
      const text = `${e.courses} ${e.certifications} ${e.capabilities}`;

      let matchedSkills = [];

      projectSkills.forEach(skill => {
        const val = e.skills?.[skill] || 0;
        const match = hasSkillMatch(skill, text) || val >= 5;

        if (match) {
          matchedSkills.push(skill);
        }
      });

      if (matchedSkills.length === 0) return null;

      return { ...e, matchedSkills };
    }).filter(Boolean);

    setResults(matched);
  }

  // 🔥 GROUPED SMART TEAM
  function buildSmartTeam() {
    const grouped = {};

    projectSkills.forEach(skill => {
      const matchedEngineers = engineers.filter(e => {
        const text = `${e.courses} ${e.certifications} ${e.capabilities}`.toLowerCase();
        const skillValue = e.skills?.[skill] || 0;

        return hasSkillMatch(skill, text) || skillValue >= 5;
      });

      grouped[skill] = matchedEngineers;
    });

    setTeam(grouped);
  }

  return (
    <div style={layout}>

      {/* SIDEBAR */}
      <div style={sidebar}>
        <h2 style={{ color: "#60a5fa" }}>Talent Dashboard</h2>

        <h3>{editingId ? "Edit Engineer" : "Add Engineer"}</h3>

        <input style={input} placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
        <input style={input} placeholder="Experience" value={experience} onChange={e => setExperience(e.target.value)} />

        <input style={input} placeholder="Courses" value={courses} onChange={e => setCourses(e.target.value)} />
        <input style={input} placeholder="Certifications" value={certifications} onChange={e => setCertifications(e.target.value)} />
        <input style={input} placeholder="Capabilities" value={capabilities} onChange={e => setCapabilities(e.target.value)} />

        <button style={btn} onClick={addOrUpdateEngineer}>
          {editingId ? "Update" : "Add Engineer"}
        </button>
      </div>

      {/* MAIN */}
      <div style={main}>

        <h1>Project Matching Dashboard</h1>

        {/* PROJECT SKILLS */}
        <div style={card}>
          <h3>Project Requirements</h3>

          {skillOptions.map(s => (
            <label key={s} style={{ marginRight: 10 }}>
              <input
                type="checkbox"
                checked={projectSkills.includes(s)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setProjectSkills([...projectSkills, s]);
                  } else {
                    setProjectSkills(projectSkills.filter(x => x !== s));
                  }
                }}
              />
              {s}
            </label>
          ))}

          <div style={{ marginTop: 10 }}>
            <button style={btn} onClick={matchEngineers}>Match</button>
            <button style={btn} onClick={buildSmartTeam}>Build Team</button>
          </div>
        </div>

        {/* ENGINEERS + RESULTS */}
        <div style={grid}>

          {/* ENGINEERS */}
          <div style={card}>
            <h3>Engineers</h3>

            {engineers.map(e => (
              <div key={e.id} style={miniCard}>
                <b>{e.name}</b>

                <div style={{ fontSize: "12px", opacity: 0.85, marginTop: 4 }}>
                  <div>📚 Courses: {e.courses || "None"}</div>
                  <div>🏆 Certifications: {e.certifications || "None"}</div>
                </div>

                <div>{e.experience} yrs</div>

                <div style={{ marginTop: 8, display: "flex", gap: 5 }}>
                  <button style={btn} onClick={() => editEngineer(e)}>Edit</button>
                  <button style={danger} onClick={() => deleteEngineer(e.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>

          {/* MATCH RESULTS */}
          <div style={card}>
            <h3>Match Results</h3>

            {results.map(e => (
              <div key={e.id} style={miniCard}>
                <b>{e.name}</b>
                <div>
                  <b>Matched Skills:</b> {e.matchedSkills?.join(", ")}
                </div>
              </div>
            ))}
          </div>

          {/* SMART TEAM GROUPED */}
          <div style={card}>
            <h3>Smart Team</h3>

            {Object.keys(team).length === 0 ? (
              <div>No team generated yet</div>
            ) : (
              Object.keys(team).map(skill => (
                <div key={skill} style={miniCard}>
                  <b>{skill}</b>

                  <div style={{ marginTop: 5 }}>
                    <b>Assigned:</b>{" "}
                    {team[skill]?.length
                      ? team[skill].map(e => e.name).join(", ")
                      : "None"}
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

/* ===== UI ===== */

const layout = {
  display: "flex",
  minHeight: "100vh",
  fontFamily: "Arial",
  background: "#0b1220",
  color: "white"
};

const sidebar = {
  width: "300px",
  padding: "20px",
  background: "#111827",
  borderRight: "1px solid #1f2937"
};

const main = {
  flex: 1,
  padding: "20px"
};

const card = {
  background: "#111827",
  padding: "15px",
  borderRadius: "12px",
  border: "1px solid #1f2937",
  marginBottom: "15px"
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "15px"
};

const miniCard = {
  padding: "10px",
  marginTop: "10px",
  background: "#0f172a",
  borderRadius: "10px",
  border: "1px solid #1f2937"
};

const input = {
  width: "100%",
  padding: "8px",
  margin: "5px 0",
  background: "#0f172a",
  border: "1px solid #334155",
  color: "white",
  borderRadius: "6px"
};

const btn = {
  padding: "8px 12px",
  marginRight: "5px",
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
};

const danger = {
  padding: "5px 8px",
  marginTop: "5px",
  background: "#dc2626",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
};
