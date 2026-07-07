import { useEffect, useMemo, useState } from "react";
import { supabase } from "./supabase";
const skillOptions = [
  "Networking",
  "Security",
  "Cloud",
  "DevOps",
  "AI",
  "Automation",
  "Business",
];

const defaultSkills = {
  Networking: 0,
  Security: 0,
  Cloud: 0,
  DevOps: 0,
  AI: 0,
  Automation: 0,
  Business: 0,
};

const skillKeywords = {
  Networking: [
    "network",
    "ccna",
    "ccnp",
    "encor",
    "enarsi",
    "ccie",
    "jncia",
    "jncis",
    "jncip",
    "hcia",
    "hcip",
    "hcie",
    "mtcna",
    "mtcre",
  ],
  Security: [
    "security",
    "cyber",
    "security+",
    "cysa",
    "casp",
    "ceh",
    "cissp",
    "cism",
    "fortinet",
    "fortigate",
    "nse",
    "fcp",
    "fcss",
    "pcnse",
    "palo alto",
    "checkpoint",
    "ccsa",
    "ccse",
    "sc-900",
    "sc-200",
    "sc-300",
    "sc-100",
    "az-500",
  ],
  Cloud: [
    "cloud",
    "azure",
    "aws",
    "gcp",
    "az-900",
    "az104",
    "az-104",
    "az305",
    "az-305",
    "az700",
    "az-700",
    "terraform",
    "openstack",
    "google cloud",
  ],
  DevOps: [
    "devops",
    "docker",
    "kubernetes",
    "k8s",
    "cka",
    "ckad",
    "terraform",
    "ansible",
    "jenkins",
    "gitlab",
    "github actions",
    "helm",
    "argocd",
    "grafana",
    "prometheus",
  ],
  AI: [
    "ai",
    "artificial intelligence",
    "machine learning",
    "ml",
    "deep learning",
    "data science",
    "python",
    "tensorflow",
    "pytorch",
    "openai",
    "llm",
    "genai",
    "prompt engineering",
    "chatbot",
  ],
  Automation: [
    "automation",
    "automate",
    "scripting",
    "script",
    "powershell",
    "python",
    "bash",
    "ansible",
    "rpa",
    "uipath",
    "power automate",
    "workflow",
    "orchestration",
    "ci/cd",
  ],
  Business: [
    "business",
    "business analysis",
    "ba",
    "requirements",
    "stakeholder",
    "process",
    "process improvement",
    "kpi",
    "reporting",
    "dashboard",
    "power bi",
    "excel",
    "presentation",
    "communication",
  ],
};




function hasSkillMatch(skill, text) {
  const lowerText = String(text || "").toLowerCase();
  return (skillKeywords[skill] || []).some((keyword) =>
    lowerText.includes(keyword.toLowerCase())
  );
}

function getMatchedKeywords(skill, text) {
  const lowerText = String(text || "").toLowerCase();
  return (skillKeywords[skill] || []).filter((keyword) =>
    lowerText.includes(keyword.toLowerCase())
  );
}

function Badge({ children }) {
  return <span className="badge">{children}</span>;
}

export default function App() {
  const [engineers, setEngineers] = useState([]);
  const [name, setName] = useState("");
  const [experience, setExperience] = useState("");
  const [courses, setCourses] = useState("");
  const [certifications, setCertifications] = useState("");
  const [capabilities, setCapabilities] = useState("");
  const [skills, setSkills] = useState({ ...defaultSkills });
  const [editingId, setEditingId] = useState(null);
  const [projectSkills, setProjectSkills] = useState([]);
  const [results, setResults] = useState([]);
  const [team, setTeam] = useState({});
  const [search, setSearch] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);

 useEffect(() => {
  loadEngineers();
}, []);

async function loadEngineers() {
  const { data, error } = await supabase
    .from("engineers")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  setEngineers(data || []);
}

  useEffect(() => {
    if (!isAddOpen) return;

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        closeAddModal();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isAddOpen]);

  const filteredEngineers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return engineers.filter((engineer) => {
      const text = `${engineer.name || ""} ${engineer.courses || ""} ${
        engineer.certifications || ""
      } ${engineer.capabilities || ""}`.toLowerCase();

      return text.includes(query);
    });
  }, [engineers, search]);

  const seniorProfiles = useMemo(() => {
    return engineers.filter((engineer) => Number(engineer.experience) >= 10).length;
  }, [engineers]);

  function resetForm() {
    setName("");
    setExperience("");
    setCourses("");
    setCertifications("");
    setCapabilities("");
    setSkills({ ...defaultSkills });
    setEditingId(null);
  }

  function openAddModal() {
    resetForm();
    setIsAddOpen(true);
  }

  function closeAddModal() {
    setIsAddOpen(false);
    resetForm();
  }

  function addOrUpdateEngineer() {
    if (!name.trim()) return;

    const engineer = {
      id: editingId || Date.now(),
      name: name.trim(),
      experience,
      courses,
      certifications,
      capabilities,
      skills,
    };

    if (editingId) {
      setEngineers((current) =>
        current.map((item) => (item.id === editingId ? engineer : item))
      );
    } else {
      setEngineers((current) => [...current, engineer]);
    }

    setIsAddOpen(false);
    resetForm();
  }

  function deleteEngineer(id) {
    setEngineers((current) => current.filter((engineer) => engineer.id !== id));
    setResults((current) => current.filter((engineer) => engineer.id !== id));
  }

  function editEngineer(engineer) {
    setName(engineer.name || "");
    setExperience(engineer.experience || "");
    setCourses(engineer.courses || "");
    setCertifications(engineer.certifications || "");
    setCapabilities(engineer.capabilities || "");
    setSkills({ ...defaultSkills, ...(engineer.skills || {}) });
    setEditingId(engineer.id);
    setIsAddOpen(true);
  }

  function toggleProjectSkill(skill) {
    setProjectSkills((current) =>
      current.includes(skill)
        ? current.filter((item) => item !== skill)
        : [...current, skill]
    );
  }

  function updateSkill(skill, value) {
    setSkills((current) => ({
      ...current,
      [skill]: Number(value),
    }));
  }

  function scoreEngineer(engineer, selectedSkills = projectSkills) {
    const text = `${engineer.courses || ""} ${engineer.certifications || ""} ${
      engineer.capabilities || ""
    }`;
    const experienceYears = Number(engineer.experience) || 0;
    const matchedSkills = [];
    const reasons = [];
    let totalScore = 0;

    selectedSkills.forEach((skill) => {
      const level = engineer.skills?.[skill] || 0;
      const matchedKeywords = getMatchedKeywords(skill, text);
      let skillScore = 0;

      if (level > 0) {
        skillScore += Math.min(level * 5, 50);
      }

      if (matchedKeywords.length > 0) {
        skillScore += Math.min(matchedKeywords.length * 10, 30);
      }

      if (experienceYears >= 10) {
        skillScore += 10;
      } else if (experienceYears >= 5) {
        skillScore += 6;
      } else if (experienceYears >= 1) {
        skillScore += 3;
      }

      if (level >= 8) {
        skillScore += 10;
      }

      if (skillScore > 0 && (level >= 5 || matchedKeywords.length > 0)) {
        matchedSkills.push(skill);

        if (matchedKeywords.length > 0) {
          reasons.push(
            `${skill}: ${matchedKeywords.slice(0, 3).join(", ")}`
          );
        }
      }

      totalScore += skillScore;
    });

    const averageScore =
      selectedSkills.length > 0
        ? Math.round(Math.min(totalScore / selectedSkills.length, 100))
        : 0;

    return {
      matchedSkills,
      reasons,
      score: averageScore,
    };
  }

  function matchEngineers() {
    const matched = engineers
      .map((engineer) => {
        const match = scoreEngineer(engineer);
        return match.matchedSkills.length ? { ...engineer, ...match } : null;
      })
      .filter(Boolean)
      .sort((a, b) => b.score - a.score);

    setResults(matched);
  }

  function buildSmartTeam() {
    const grouped = {};

    projectSkills.forEach((skill) => {
      const candidates = engineers
        .map((engineer) => {
          const match = scoreEngineer(engineer, [skill]);
          return match.matchedSkills.length ? { ...engineer, ...match } : null;
        })
        .filter(Boolean)
        .sort((a, b) => b.score - a.score);

      grouped[skill] = {
        best: candidates[0] || null,
        candidates: candidates.slice(1, 4),
      };
    });

    setTeam(grouped);
  }

  return (
    <div className="app">
      <style>{css}</style>

      <header className="header">
        <div className="brand">
          <div className="logo">
            <img src="/vodafone-logo.png" alt="" />
            <span>V</span>
          </div>
          <div>
            <h1>Vodafone Talent Portal</h1>
            <p>Talent Matching Platform</p>
          </div>
        </div>
        <div className="header-chip">Engineering Capability Hub</div>
      </header>

      <main className="main">
        <section className="dashboard">
          <div className="stat stat-red">
            <span>Total Engineers</span>
            <strong>{engineers.length}</strong>
          </div>
          <div className="stat">
            <span>Project Skills</span>
            <strong>{projectSkills.length}</strong>
          </div>
          <div className="stat stat-green">
            <span>Match Results</span>
            <strong>{results.length}</strong>
          </div>
          <div className="stat">
            <span>Senior Profiles</span>
            <strong>{seniorProfiles}</strong>
          </div>
        </section>

        <div className="add-engineer-bar">
          <span>Manage engineer profiles</span>
          <button className="primary" onClick={openAddModal}>
            + Add Engineer
          </button>
        </div>

        <div className="card">
          <div className="section-title">
            <h2>Project Requirements</h2>
            <p>Select required skills, then match or build a team.</p>
          </div>

          <div className="requirements">
            {skillOptions.map((skill) => {
              const active = projectSkills.includes(skill);

              return (
                <button
                  className={active ? "requirement active" : "requirement"}
                  key={skill}
                  type="button"
                  onClick={() => toggleProjectSkill(skill)}
                >
                  <span>{skill}</span>
                  <strong>{active ? "Selected" : "Add"}</strong>
                </button>
              );
            })}
          </div>

          <div className="actions">
            <button className="primary" onClick={matchEngineers}>
              Match
            </button>
            <button className="dark" onClick={buildSmartTeam}>
              Smart Team
            </button>
          </div>
        </div>

        <section className="content-grid">
          <div className="card engineers-card">
            <div className="section-title">
              <h2>Engineers ({filteredEngineers.length})</h2>
              <p>Search and manage all profiles.</p>
            </div>

            <input
              className="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name, course, certification, or capability..."
            />

            <div className="list">
              {filteredEngineers.length === 0 ? (
                <div className="empty">No engineers found.</div>
              ) : (
                filteredEngineers.map((engineer) => (
                  <article className="engineer" key={engineer.id}>
                    <div className="engineer-head">
                      <div>
                        <h3>{engineer.name}</h3>
                        <p>{engineer.experience || 0} years experience</p>
                      </div>
                      <div className="row-actions">
                        <button
                          className="small"
                          onClick={() => editEngineer(engineer)}
                        >
                          Edit
                        </button>
                        <button
                          className="danger"
                          onClick={() => deleteEngineer(engineer.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    <div className="details">
                      <p>
                        <b>Courses:</b> {engineer.courses || "None"}
                      </p>
                      <p>
                        <b>Certifications:</b>{" "}
                        {engineer.certifications || "None"}
                      </p>
                      <p>
                        <b>Capabilities:</b> {engineer.capabilities || "None"}
                      </p>
                    </div>

                    <div className="badges">
                      {skillOptions.map((skill) => (
                        <Badge key={skill}>
                          {skill}: {engineer.skills?.[skill] || 0}
                        </Badge>
                      ))}
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>

          <div className="card">
            <div className="section-title">
              <h2>Match Results</h2>
              <p>Engineers matching selected requirements.</p>
            </div>

            <div className="list">
              {results.length === 0 ? (
                <div className="empty">No matching engineers yet.</div>
              ) : (
                results.map((engineer) => (
                  <article className="compact" key={engineer.id}>
                    <h3>{engineer.name}</h3>
                    <div className="badges">
                      {engineer.matchedSkills.map((skill) => (
                        <Badge key={skill}>{skill}</Badge>
                      ))}
                    </div>
                    <p className="match-courses">
                      <b>Courses:</b> {engineer.courses || "None"}
                    </p>
                    <ul className="reason-list">
                      {engineer.reasons.slice(0, 4).map((reason) => (
                        <li key={reason}>{reason}</li>
                      ))}
                    </ul>
                  </article>
                ))
              )}
            </div>
          </div>

          <div className="card">
            <div className="section-title">
              <h2>Smart Team</h2>
              <p>Suggested engineers grouped by skill.</p>
            </div>

            <div className="list">
              {Object.keys(team).length === 0 ? (
                <div className="empty">No team generated.</div>
              ) : (
                Object.keys(team).map((skill) => (
                  <article className="compact" key={skill}>
                    <h3>{skill}</h3>
                    {team[skill].best ? (
                      <>
                        <p className="team-names">
                          <b>Best Fit:</b> {team[skill].best.name}
                        </p>
                        <p className="match-courses">
                          <b>Courses:</b> {team[skill].best.courses || "None"}
                        </p>
                        <ul className="reason-list">
                          {team[skill].best.reasons.slice(0, 3).map((reason) => (
                            <li key={reason}>{reason}</li>
                          ))}
                        </ul>
                        {team[skill].candidates.length > 0 && (
                          <p className="team-names">
                            Alternatives:{" "}
                            {team[skill].candidates
                              .map((engineer) => engineer.name)
                              .join(", ")}
                          </p>
                        )}
                      </>
                    ) : (
                      <p className="team-names">No engineers</p>
                    )}
                  </article>
                ))
              )}
            </div>
          </div>
        </section>
      </main>

      {isAddOpen && (
        <div className="modal-overlay" onClick={closeAddModal}>
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <h2>{editingId ? "Edit Engineer" : "Add Engineer"}</h2>
                <p>Add engineer profile, skills, courses, and certifications.</p>
              </div>
              <button
                className="modal-close"
                onClick={closeAddModal}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="form-grid">
                <label>
                  <span>Full Name</span>
                  <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Engineer name"
                  />
                </label>

                <label>
                  <span>Experience</span>
                  <input
                    type="number"
                    min="0"
                    value={experience}
                    onChange={(event) => setExperience(event.target.value)}
                    placeholder="Years"
                  />
                </label>

                <label className="wide">
                  <span>Courses</span>
                  <textarea
                    value={courses}
                    onChange={(event) => setCourses(event.target.value)}
                    placeholder="CCNA, Azure, Kubernetes..."
                  />
                </label>

                <label className="wide">
                  <span>Certifications</span>
                  <textarea
                    value={certifications}
                    onChange={(event) => setCertifications(event.target.value)}
                    placeholder="CCNP, AZ-104, Security+..."
                  />
                </label>

                <label className="wide">
                  <span>Capabilities</span>
                  <textarea
                    value={capabilities}
                    onChange={(event) => setCapabilities(event.target.value)}
                    placeholder="Routing, firewall policies, cloud migration..."
                  />
                </label>
              </div>

              <div className="skill-grid">
                {skillOptions.map((skill) => (
                  <label className="skill-control" key={skill}>
                    <span>{skill}</span>
                    <div>
                      <input
                        type="range"
                        min="0"
                        max="10"
                        value={skills[skill] || 0}
                        onChange={(event) => updateSkill(skill, event.target.value)}
                      />
                      <strong>{skills[skill] || 0}</strong>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="modal-footer">
              <button className="secondary" onClick={closeAddModal}>
                Cancel
              </button>
              <button className="primary" onClick={addOrUpdateEngineer}>
                {editingId ? "Update Engineer" : "Add Engineer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const css = `
* {
  box-sizing: border-box;
}

body {
  margin: 0;
}

.app {
  min-height: 100vh;
  background: #f4f6f8;
  color: #1f2937;
  font-family: Inter, "Segoe UI", Roboto, Arial, sans-serif;
}

.header {
  min-height: 88px;
  padding: 18px 32px;
  background: linear-gradient(135deg, #e60000, #a90018);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  box-shadow: 0 14px 28px rgba(94, 0, 0, 0.2);
}

.brand {
  display: flex;
  align-items: center;
  gap: 16px;
}

.logo {
  width: 56px;
  height: 56px;
  border-radius: 8px;
  background: #fff;
  display: grid;
  place-items: center;
  overflow: hidden;
  position: relative;
  flex: 0 0 auto;
}

.logo img {
  width: 44px;
  height: 44px;
  object-fit: contain;
  position: relative;
  z-index: 2;
}

.logo span {
  position: absolute;
  color: #e60000;
  font-weight: 900;
  font-size: 30px;
}

.brand h1 {
  margin: 0;
  font-size: 26px;
  line-height: 1.1;
}

.brand p {
  margin: 5px 0 0;
  color: rgba(255, 255, 255, 0.86);
  font-size: 14px;
}

.header-chip {
  padding: 9px 12px;
  border: 1px solid rgba(255, 255, 255, 0.32);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.12);
  font-size: 13px;
  font-weight: 700;
}

.main {
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.dashboard,
.top-grid,
.content-grid {
  display: grid;
  gap: 18px;
}

.dashboard {
  grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
}

.top-grid {
  grid-template-columns: minmax(0, 1.35fr) minmax(300px, 0.65fr);
}

.content-grid {
  grid-template-columns: minmax(360px, 1.3fr) minmax(260px, 0.85fr) minmax(260px, 0.85fr);
  align-items: start;
}

.stat,
.card {
  background: #fff;
  border: 1px solid #e1e7ef;
  border-radius: 8px;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.07);
}

.stat {
  padding: 18px;
  border-top: 4px solid #2f3a45;
}

.stat-red {
  border-top-color: #e60000;
}

.stat-green {
  border-top-color: #0f9d58;
}

.stat span {
  display: block;
  color: #667085;
  font-size: 13px;
  font-weight: 800;
  text-transform: uppercase;
}

.stat strong {
  display: block;
  margin-top: 8px;
  color: #101828;
  font-size: 30px;
}

.card {
  padding: 20px;
}

.section-title {
  margin-bottom: 16px;
}

.section-title h2 {
  margin: 0;
  color: #101828;
  font-size: 20px;
}

.section-title p {
  margin: 6px 0 0;
  color: #667085;
  font-size: 13px;
}

.add-engineer-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 16px;
  border: 1px solid #e1e7ef;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 6px 16px rgba(15, 23, 42, 0.05);
}

.add-engineer-bar span {
  color: #475467;
  font-size: 13px;
  font-weight: 700;
}

.add-engineer-bar .primary {
  flex: 0 0 auto;
  white-space: nowrap;
  min-height: 36px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 150px;
  gap: 14px;
}

label {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

label span {
  color: #344054;
  font-size: 13px;
  font-weight: 800;
}

.wide {
  grid-column: 1 / -1;
}

input,
textarea {
  width: 100%;
  border: 1px solid #cfd6df;
  border-radius: 8px;
  background: #fff;
  color: #111827;
  font: inherit;
  font-size: 14px;
  outline: none;
}

input {
  height: 42px;
  padding: 0 12px;
}

textarea {
  min-height: 72px;
  padding: 12px;
  resize: vertical;
}

.skill-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  gap: 14px;
  margin-top: 18px;
  padding-top: 18px;
  border-top: 1px solid #edf0f3;
}

.skill-control div {
  display: grid;
  grid-template-columns: 1fr 34px;
  align-items: center;
  gap: 10px;
}

.skill-control input {
  height: auto;
  padding: 0;
  accent-color: #e60000;
}

.skill-control strong {
  color: #e60000;
  text-align: right;
}

.requirements {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
}

.requirement {
  min-height: 74px;
  border: 1px solid #d9dfe7;
  border-radius: 8px;
  background: #f9fafb;
  color: #1f2937;
  padding: 14px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 6px;
  cursor: pointer;
  font-weight: 800;
}

.requirement.active {
  border-color: #e60000;
  background: #fff1f1;
  color: #b00020;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 18px;
}

button {
  min-height: 40px;
  border-radius: 8px;
  padding: 0 15px;
  border: 0;
  font: inherit;
  font-weight: 800;
  cursor: pointer;
}

.primary {
  background: #e60000;
  color: #fff;
}

.secondary,
.small {
  border: 1px solid #cfd6df;
  background: #fff;
  color: #344054;
}

.dark {
  background: #242b33;
  color: #fff;
}

.danger {
  background: #b42318;
  color: #fff;
}

.small,
.danger {
  min-height: 34px;
  padding: 0 12px;
}

.search {
  margin-bottom: 14px;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.engineer,
.compact,
.empty {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #fbfcfe;
  padding: 15px;
}

.empty {
  min-height: 76px;
  display: grid;
  place-items: center;
  color: #667085;
  font-weight: 700;
  text-align: center;
  border-style: dashed;
}

.engineer-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.engineer h3,
.compact h3 {
  margin: 0;
  color: #101828;
  font-size: 16px;
}

.engineer-head p {
  margin: 4px 0 0;
  color: #667085;
  font-size: 13px;
}

.row-actions {
  display: flex;
  gap: 8px;
  flex: 0 0 auto;
}

.details {
  margin-top: 12px;
  color: #475467;
  font-size: 13px;
  line-height: 1.55;
}

.details p {
  margin: 5px 0;
}

.badges {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.badge {
  min-height: 26px;
  padding: 5px 9px;
  border-radius: 8px;
  background: #eef2f6;
  color: #344054;
  font-size: 12px;
  font-weight: 800;
}

.team-names {
  margin: 10px 0 0;
  color: #475467;
  line-height: 1.5;
}

.match-courses {
  margin: 10px 0 0;
  color: #475467;
  font-size: 13px;
  line-height: 1.5;
}

.reason-list {
  margin: 10px 0 0;
  padding-left: 18px;
  color: #667085;
  font-size: 12px;
  line-height: 1.5;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(16, 24, 40, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  z-index: 50;
}

.modal {
  width: 100%;
  max-width: 640px;
  max-height: 88vh;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 24px 48px rgba(15, 23, 42, 0.28);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 20px 22px;
  border-bottom: 1px solid #edf0f3;
}

.modal-header h2 {
  margin: 0;
  color: #101828;
  font-size: 20px;
}

.modal-header p {
  margin: 6px 0 0;
  color: #667085;
  font-size: 13px;
}

.modal-close {
  min-height: 32px;
  width: 32px;
  padding: 0;
  border-radius: 8px;
  background: #f2f4f7;
  color: #344054;
  font-size: 20px;
  line-height: 1;
  flex: 0 0 auto;
}

.modal-body {
  padding: 20px 22px;
  overflow-y: auto;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 16px 22px;
  border-top: 1px solid #edf0f3;
}

@media (max-width: 980px) {
  .top-grid,
  .content-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 620px) {
  .header,
  .main {
    padding: 18px;
  }

  .brand h1 {
    font-size: 21px;
  }

  .form-grid,
  .requirements {
    grid-template-columns: 1fr;
  }

  .engineer-head {
    flex-direction: column;
  }

  .modal-overlay {
    padding: 12px;
  }
}
`;
