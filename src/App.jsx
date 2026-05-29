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

  const [editingId, setEditingId] = useState(null);

  const [skills, setSkills] = useState({
    Networking: 0,
    Security: 0,
    DevOps: 0,
    Cloud: 0
  });

  const [projectSkills, setProjectSkills] = useState([]);
  const [results, setResults] = useState([]);
  const [bestPerSkill, setBestPerSkill] = useState([]);
  const [team, setTeam] = useState([]);

  useEffect(() => {
    localStorage.setItem("engineers", JSON.stringify(engineers));
  }, [engineers]);

  function resetForm() {
    setName("");
    setExperience("");
    setCourses("");
    setSkills({
      Networking: 0,
      Security: 0,
      DevOps: 0,
      Cloud: 0
    });
    setEditingId(null);
  }

  function addOrUpdateEngineer() {
    if (!name) return;

    const newEngineer = {
      id: editingId || Date.now(),
      name,
      experience,
      courses,
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
    setCourses(e.courses);
    setSkills(e.skills);
    setEditingId(e.id);
  }

  // 🔥 MATCHING
  function hasSkillMatch(skill, text) {
    const t = (text || "").toLowerCase();

    if (skill === "Networking") {
      return t.includes("network") || t.includes("ccna") || t.includes("ccnp");
    }

    if (skill === "Security") {
      return t.includes("security") || t.includes("cyber") || t.includes("firewall");
    }

    if (skill === "DevOps") {
      return t.includes("devops") || t.includes("docker") || t.includes("kubernetes");
    }

    if (skill === "Cloud") {
      return t.includes("cloud") || t.includes("aws") || t.includes("azure") || t.includes("gcp");
    }

    return false;
  }

  // 📊 MATCH ENGINEERS
  function matchEngineers() {
    const matched = engineers
      .map((e) => {
        const text = e.courses || "";

        let total = 0;
        let count = 0;
        let matchedSkills = [];

        projectSkills.forEach((skill) => {
          const skillValue = Number(e.skills?.[skill] || 0);
          const match =
            hasSkillMatch(skill, text) || skillValue >= 5;

          if (match) {
            total += skillValue;
            count++;
            matchedSkills.push(skill);
          }
        });

        if (count === 0) return null;

        const rate = Math.round((total / (count * 10)) * 100);

        return { ...e, rate, matchedSkills };
      })
      .filter(Boolean)
      .sort((a, b) => b.rate - a.rate);

    setResults(matched);
  }

  // 🎯 BEST PER SKILL (FIXED)
  function findBestPerSkill() {
    const best = skillOptions.map((skill) => {
      const valid = engineers.filter((e) =>
        hasSkillMatch(skill, e.courses || "") ||
        (e.skills?.[skill] || 0) >= 5
      );

      if (valid.length === 0) {
        return { skill, engineers: [] };
      }

      const sorted = valid.sort(
        (a, b) => (b.skills?.[skill] || 0) - (a.skills?.[skill] || 0)
      );

      return {
        skill,
        engineers: sorted
      };
    });

    setBestPerSkill(best);
  }

  // 🤖 SMART TEAM
  function buildSmartTeam() {
    const selected = [];
    const used = new Set();

    projectSkills.forEach((skill) => {
      const candidates = engineers
        .filter((e) => {
          const text = (e.courses || "").toLowerCase();

          return (
            hasSkillMatch(skill, text) ||
            Number(e.skills?.[skill] || 0) >= 5
          );
        })
        .sort((a, b) => (b.skills?.[skill] || 0) - (a.skills?.[skill] || 0));

      if (candidates.length === 0) return;

      const chosen = candidates.find((e) => !used.has(e.id));

      if (chosen) {
        selected.push({
          ...chosen,
          assignedSkill: skill
        });

        used.add(chosen.id);
      } else {
        selected.push({
          ...candidates[0],
          assignedSkill: skill
        });
      }
    });

    setTeam(selected);
  }

  return (
    <div style={page}>
      {/* LEFT */}
      <div style={left}>
        <h2>Add Engineer</h2>

        <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Name" style={input}/>
        <input value={experience} onChange={(e)=>setExperience(e.target.value)} placeholder="Experience" style={input}/>
        <input value={courses} onChange={(e)=>setCourses(e.target.value)} placeholder="Courses" style={input}/>

        <h4>Skills</h4>

        {skillOptions.map(s => (
          <div key={s}>
            {s}
            <select
              value={skills[s]}
              onChange={(e)=>setSkills({...skills,[s]:Number(e.target.value)})}
              style={input}
            >
              {[0,1,2,3,4,5,6,7,8,9,10].map(n => (
                <option key={n}>{n}</option>
              ))}
            </select>
          </div>
        ))}

        <button onClick={addOrUpdateEngineer} style={btn}>
          {editingId ? "Update ✏️" : "Add"}
        </button>

        <hr />

        <h3>Engineers</h3>

        {engineers.map(e => (
          <div key={e.id} style={card}>
            <b>{e.name}</b>
            <div>{e.courses}</div>

            <button onClick={()=>editEngineer(e)} style={btn}>Edit ✏️</button>
            <button onClick={()=>deleteEngineer(e.id)} style={btn}>Delete ❌</button>
          </div>
        ))}
      </div>

      {/* RIGHT */}
      <div style={right}>
        <h2>Project Requirements</h2>

        {skillOptions.map(s => (
          <label key={s}>
            <input
              type="checkbox"
              checked={projectSkills.includes(s)}
              onChange={(e)=>{
                if(e.target.checked){
                  setProjectSkills([...projectSkills,s])
                } else {
                  setProjectSkills(projectSkills.filter(x=>x!==s))
                }
              }}
            />
            {s}
          </label>
        ))}

        <br />

        <button onClick={matchEngineers} style={btn}>Match</button>
        <button onClick={buildSmartTeam} style={btn}>Smart Team 🤖</button>
        <button onClick={findBestPerSkill} style={btn}>Best Per Skill 🎯</button>

        <h3>Results</h3>
        {results.map(e=>(
          <div key={e.id} style={card}>
            <b>{e.name}</b> — {e.rate}%

            <div>
              {e.matchedSkills?.map((s)=>(
                <span key={s} style={{marginRight:6}}>
                  {s} ✔
                </span>
              ))}
            </div>
          </div>
        ))}

        <h3>Smart Team</h3>
        {team.map(e=>(
          <div key={e.id} style={card}>
            <b>{e.name}</b>
            <div>{e.assignedSkill}</div>
          </div>
        ))}

        <h3>Best Per Skill</h3>
        {bestPerSkill.map((b,i)=>(
          <div key={i} style={card}>
            <b>{b.skill}</b>

            {b.engineers.length === 0 ? (
              <div>None</div>
            ) : (
              b.engineers.map((e)=>(
                <div key={e.id}>
                  {e.name} — {e.skills?.[b.skill] || 0}%
                </div>
              ))
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const page = {
  display:"flex",
  fontFamily:"Arial",
  background:"#0f172a",
  color:"white",
  minHeight:"100vh"
};

const left = {
  width:"40%",
  padding:20,
  background:"#1e293b"
};

const right = {
  width:"60%",
  padding:20
};

const input = {
  display:"block",
  margin:"5px 0",
  padding:8,
  width:"100%",
  background:"#334155",
  color:"white"
};

const btn = {
  margin:"5px",
  padding:"8px",
  background:"#2563eb",
  color:"white",
  border:"none",
  cursor:"pointer"
};

const card = {
  padding:10,
  margin:"10px 0",
  background:"#1f2937",
  border:"1px solid #374151"
};
