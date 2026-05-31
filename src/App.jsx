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
    localStorage.setItem(
      "engineers",
      JSON.stringify(engineers)
    );
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
      setEngineers(
        engineers.map((e) =>
          e.id === editingId ? newEngineer : e
        )
      );
    } else {
      setEngineers([...engineers, newEngineer]);
    }

    resetForm();
  }

  function deleteEngineer(id) {
    setEngineers(
      engineers.filter((e) => e.id !== id)
    );
  }

  function editEngineer(e) {
    setName(e.name);
    setExperience(e.experience);
    setCourses(e.courses);
    setSkills(e.skills);
    setEditingId(e.id);
  }

  function hasSkillMatch(skill, text) {
    const t = (text || "").toLowerCase();

    if (skill === "Networking") {
      return [
        "network",
        "ccna",
        "ccnp",
        "routing",
        "switching"
      ].some((k) => t.includes(k));
    }

    if (skill === "Security") {
      return [
        "security",
        "cyber",
        "firewall",
        "network security",
        "ethical hacking",
        "soc"
      ].some((k) => t.includes(k));
    }

    if (skill === "DevOps") {
      return [
        "devops",
        "docker",
        "kubernetes",
        "jenkins"
      ].some((k) => t.includes(k));
    }

    if (skill === "Cloud") {
      return [
        "cloud",
        "aws",
        "azure",
        "gcp"
      ].some((k) => t.includes(k));
    }

    return false;
  }

  function matchEngineers() {
    const matched = engineers
      .map((e) => {
        const matchedSkills = [];

        projectSkills.forEach((skill) => {
          const value = Number(
            e.skills?.[skill] || 0
          );

          const match =
            hasSkillMatch(skill, e.courses) ||
            value >= 5;

          if (match) {
            matchedSkills.push(skill);
          }
        });

        if (
          matchedSkills.length === 0
        )
          return null;

        return {
          ...e,
          matchedSkills
        };
      })
      .filter(Boolean);

    setResults(matched);
  }

  function findBestPerSkill() {
    const best = skillOptions.map(
      (skill) => {
        const valid =
          engineers.filter((e) => {
            return (
              hasSkillMatch(
                skill,
                e.courses
              ) ||
              Number(
                e.skills?.[skill] || 0
              ) >= 5
            );
          });

        return {
          skill,
          engineers: valid
        };
      }
    );

    setBestPerSkill(best);
  }

  function buildSmartTeam() {
    const selected = [];

    projectSkills.forEach((skill) => {
      const candidates =
        engineers.filter((e) => {
          return (
            hasSkillMatch(
              skill,
              e.courses
            ) ||
            Number(
              e.skills?.[skill] || 0
            ) >= 5
          );
        });

      candidates.forEach((e) => {
        selected.push({
          ...e,
          assignedSkill: skill
        });
      });
    });

    setTeam(selected);
  }

  return (
    <div style={page}>
      <div style={left}>
        <h2>Add Engineer</h2>

        <input
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          placeholder="Name"
          style={input}
        />

        <input
          value={experience}
          onChange={(e) =>
            setExperience(
              e.target.value
            )
          }
          placeholder="Experience"
          style={input}
        />

        <input
          value={courses}
          onChange={(e) =>
            setCourses(
              e.target.value
            )
          }
          placeholder="Courses"
          style={input}
        />

        <h4>Skills</h4>

        {skillOptions.map((s) => (
          <div key={s}>
            {s}

            <select
              value={skills[s]}
              onChange={(e) =>
                setSkills({
                  ...skills,
                  [s]: Number(
                    e.target.value
                  )
                })
              }
              style={input}
            >
              {[0,1,2,3,4,5,6,7,8,9,10].map(
                (n) => (
                  <option key={n}>
                    {n}
                  </option>
                )
              )}
            </select>
          </div>
        ))}

        <button
          onClick={
            addOrUpdateEngineer
          }
          style={btn}
        >
          {editingId
            ? "Update ✏️"
            : "Add"}
        </button>

        <hr />

        <h3>Engineers</h3>

        {engineers.map((e) => (
          <div
            key={e.id}
            style={card}
          >
            <b>{e.name}</b>

            <div>
              {e.courses}
            </div>

            <button
              onClick={() =>
                editEngineer(e)
              }
              style={btn}
            >
              Edit ✏️
            </button>

            <button
              onClick={() =>
                deleteEngineer(
                  e.id
                )
              }
              style={btn}
            >
              Delete ❌
            </button>
          </div>
        ))}
      </div>

      <div style={right}>
        <h2>
          Project Requirements
        </h2>

        {skillOptions.map((s) => (
          <label
            key={s}
            style={{
              marginRight: 10
            }}
          >
            <input
              type="checkbox"
              checked={projectSkills.includes(
                s
              )}
              onChange={(e) => {
                if (
                  e.target.checked
                ) {
                  setProjectSkills([
                    ...projectSkills,
                    s
                  ]);
                } else {
                  setProjectSkills(
                    projectSkills.filter(
                      (x) =>
                        x !== s
                    )
                  );
                }
              }}
            />
            {s}
          </label>
        ))}

        <br />

        <button
          onClick={matchEngineers}
          style={btn}
        >
          Match
        </button>

        <button
          onClick={buildSmartTeam}
          style={btn}
        >
          Smart Team 🤖
        </button>

        <button
          onClick={
            findBestPerSkill
          }
          style={btn}
        >
          Best Per Skill 🎯
        </button>

        <h3>Results</h3>

        {results.map((e) => (
          <div
            key={e.id}
            style={card}
          >
            <b>{e.name}</b>

            <div>
              {e.matchedSkills.map(
                (s) => (
                  <span
                    key={s}
                    style={{
                      marginRight: 6
                    }}
                  >
                    {s} ✔
                  </span>
                )
              )}
            </div>
          </div>
        ))}

        <h3>Smart Team</h3>

        {team.map((e, i) => (
          <div
            key={e.id + i}
            style={card}
          >
            <b>{e.name}</b>

            <div>
              {e.assignedSkill}
            </div>
          </div>
        ))}

        <h3>Best Per Skill</h3>

        {bestPerSkill.map(
          (b, i) => (
            <div
              key={i}
              style={card}
            >
              <b>{b.skill}</b>

              {b.engineers
                .length ===
              0 ? (
                <div>
                  None
                </div>
              ) : (
                b.engineers.map(
                  (e) => (
                    <div
                      key={e.id}
                    >
                      {
                        e.name
                      }
                    </div>
                  )
                )
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
}

const page = {
  display: "flex",
  fontFamily: "Arial",
  background: "#0f172a",
  color: "white",
  minHeight: "100vh"
};

const left = {
  width: "40%",
  padding: 20,
  background: "#1e293b"
};

const right = {
  width: "60%",
  padding: 20
};

const input = {
  display: "block",
  margin: "5px 0",
  padding: 8,
  width: "100%",
  background: "#334155",
  color: "white"
};

const btn = {
  margin: "5px",
  padding: "8px",
  background: "#2563eb",
  color: "white",
  border: "none",
  cursor: "pointer"
};

const card = {
  padding: 10,
  margin: "10px 0",
  background: "#1f2937",
  border: "1px solid #374151"
};
