import './Skills.css';

const Skills = () => {
  const skills = [
    { name: 'Hardware & PC Troubleshooting', icon: '💻' },
    { name: 'AR/VR Hardware Support & Setup', icon: '🥽' },
    { name: '3D Motion Graphics Support', icon: '🎬' },
    { name: 'OS Administration (Windows/Linux)', icon: '🐧' },
    { name: 'Network Configuration (LAN/WLAN)', icon: '🌐' },
    { name: 'Software Installation & Patching', icon: '⚙️' },
    { name: 'Immersive Tech & WebXR Config', icon: '🕶️' },
    { name: 'Remote Support (TeamViewer/AnyDesk)', icon: '📞' },
    { name: 'Hardware Maintenance & Upgrades', icon: '🔧' },
    { name: 'IT Security Basics & Antivirus', icon: '🛡️' }
  ];


  return (
    <section id="skills" className="section skills">
      <div className="container">
        <h2 className="section-title">Keahlian Teknis</h2>
        <p className="section-subtitle">Beberapa teknologi dan area fokus yang saya tangani sehari-hari.</p>

        <div className="skills-grid">
          {skills.map((skill, index) => (
            <div key={index} className="skill-card">
              <div className="skill-icon">{skill.icon}</div>
              <h4 className="skill-name">{skill.name}</h4>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
