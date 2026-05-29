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

  function addEngineer() {
    if (!name) return;

    setEngineers([
      ...engineers,
      {
        id: Date.now(),
        name,
        experience,
        courses,
        skills
      }
    ]);

    setName("");
    setExperience("");
    setCourses("");
    setSkills({
      Networking: 0,
      Security: 0,
      DevOps: 0,
      Cloud: 0
    });
  }

  function deleteEngineer(id) {
    setEngineers(engineers.filter((e) => e.id !== id));
  }

  function hasSkillMatch(skill, text) {
    if (skill === "Networking") {
      return (
        text.includes("network") ||
        text.includes("ccna") ||
        text.includes("ccnp")
      );
    }

    if (skill === "Security") {
      return (
        text.includes("security") ||
        text.includes("cyber") ||
        text.includes("firewall")
      );
    }

    if (skill === "DevOps") {
      return (
        text.includes("devops") ||
        text.includes("docker") ||
        text.includes("kubernetes")
      );
    }

    if (skill === "Cloud") {
      return (
        text.includes("cloud") ||
        text.includes("aws") ||
        text.includes("azure") ||
        text.includes("gcp")
      );
    }

    return false;
  }

  function matchEngineers() {
    const matched = engineers
      .map((e) => {
        const text = (e.courses || "").toLowerCase();

        let score = 0;
        let count = 0;

        projectSkills.forEach((skill) => {
          if (hasSkillMatch(skill, text)) {
            score += Number(e.skills[skill] || 0);
            count++;
          }
        });

        if (count === 0) return null;

        const rate = Math.round((score / (count * 10)) * 100);

        return { ...e, rate };
      })
      .filter(Boolean)
      .sort((a, b) => b.rate - a.rate);

    setResults(matched);
  }

  // 🔥 BEST PER SKILL (FIXED)
  function findBestPerSkill() {
    const best = skillOptions.map((skill) => {
      const valid = engineers.filter((e) => {
        const text = (e.courses || "").toLowerCase();
        return hasSkillMatch(skill, text);
      });

      if (valid.length === 0) return { skill, engineer: null };

      const top = valid.sort(
        (a, b) => b.skills[skill] - a.skills[skill]
      )[0];

      return { skill, engineer: top };
    });

    setBestPerSkill(best);
  }

  // 🤖 SMART TEAM (MULTI MEMBERS PER SKILL)
  function buildSmartTeam() {
    const selected = [];
    const used = new Set();

    const TOP_N = 2; // 👈 عدد المهندسين لكل skill

    projectSkills.forEach((skill) => {
      const candidates = engineers
        .filter((e) => {
          const text = (e.courses || "").toLowerCase();
          return hasSkillMatch(skill, text);
        })
        .sort(
          (a, b) => b.skills[skill] - a.skills[skill]
        )
        .slice(0, TOP_N);

      candidates.forEach((e) => {
        if (!used.has(e.id)) {
          selected.push({
            ...e,
            assignedSkill: skill
          });
          used.add(e.id);
        }
      });
    });

    setTeam(selected);
  }

  return (
    <div style={page}>
      {/* LEFT */}
      <div style={left}>
        <h2>Add Engineer</h2>

        <input placeholder="Name" value={name} onChange={(e)=>setName(e.target.value)} style={input}/>
        <input placeholder="Experience" value={experience} onChange={(e)=>setExperience(e.target.value)} style={input}/>
        <input placeholder="Courses (ccna, aws, docker...)" value={courses} onChange={(e)=>setCourses(e.target.value)} style={input}/>

        <h4>Skills</h4>

        {skillOptions.map((s)=>(
          <div key={s}>
            {s}
            <select
              value={skills[s]}
              onChange={(e)=>
                setSkills({...skills,[s]:Number(e.target.value)})
              }
              style={input}
            >
              {[0,1,2,3,4,5,6,7,8,9,10].map(n=><option key={n}>{n}</option>)}
            </select>
          </div>
        ))}

        <button onClick={addEngineer} style={btn}>Add</button>

        <hr />

        <h3>Engineers</h3>

        {engineers.map((e)=>(
          <div key={e.id} style={card}>
            <b>{e.name}</b>
            <div>{e.courses}</div>
            <button onClick={()=>deleteEngineer(e.id)} style={btn}>Delete</button>
          </div>
        ))}
      </div>

      {/* RIGHT */}
      <div style={right}>
        <h2>Project Requirements</h2>

        {skillOptions.map((s)=>(
          <label key={s}>
            <input
              type="checkbox"
              checked={projectSkills.includes(s)}
              onChange={(e)=>{
                if(e.target.checked){
                  setProjectSkills([...projectSkills,s])
                }else{
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
            {e.name} — {e.rate}%
          </div>
        ))}

        <h3>Smart Team</h3>
        {team.map((e)=>(
          <div key={e.id} style={card}>
            <b>{e.name}</b>
            <div>Role: {e.assignedSkill}</div>
          </div>
        ))}

        <h3>Best Per Skill</h3>
        {bestPerSkill.map((b,i)=>(
          <div key={i} style={card}>
            <b>{b.skill}</b> : {b.engineer?.name || "None"}
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