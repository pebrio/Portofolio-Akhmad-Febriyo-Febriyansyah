import './Projects.css';

const Projects = () => {
  const projects = [
    {
      title: "Implementasi AR Remote Assist",
      category: "Immersive Technology",
      description: "Mengintegrasikan kacamata pintar AR dengan platform bantuan IT jarak jauh untuk memandu teknisi lapangan dalam menyelesaikan troubleshooting server fisik secara real-time.",
      tags: ["AR", "Smart Glasses", "WebRTC"]
    },
    {
      title: "Simulasi Pelatihan VR Hardware",
      category: "Virtual Reality",
      description: "Merancang lingkungan laboratorium simulasi VR berbasis WebXR untuk pelatihan interaktif pemeliharaan dan troubleshooting kegagalan hardware bagi staf IT baru.",
      tags: ["VR", "WebXR", "Unity"]
    },
    {
      title: "Migrasi Sistem Windows 10 ke 11",
      category: "OS & Deployment",
      description: "Memimpin proses migrasi massal sistem operasi dari Windows 10 ke Windows 11 untuk 150+ unit komputer kantor, dengan meminimalisir waktu henti (downtime).",
      tags: ["Windows", "Active Directory", "Deployment"]
    },
    {
      title: "Optimasi Jaringan Kantor Cabang",
      category: "Networking",
      description: "Melakukan re-konfigurasi topologi LAN dan implementasi VLAN untuk memisahkan lalu lintas data divisi, meningkatkan keamanan dan kecepatan jaringan.",
      tags: ["Cisco", "VLAN", "Mikrotik"]
    }
  ];


  return (
    <section id="projects" className="section projects">
      <div className="container">
        <h2 className="section-title">Proyek & Pencapaian</h2>
        <p className="section-subtitle">Beberapa inisiatif teknis yang telah saya kerjakan untuk meningkatkan efisiensi IT.</p>
        
        <div className="projects-grid">
          {projects.map((project, index) => (
            <div key={index} className="project-card">
              <div className="project-content">
                <span className="project-category">{project.category}</span>
                <h3 className="project-title">{project.title}</h3>
                <p className="project-desc">{project.description}</p>
                <div className="project-tags">
                  {project.tags.map((tag, i) => (
                    <span key={i} className="tag">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
