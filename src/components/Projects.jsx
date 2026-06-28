import './Projects.css';
import { useState, useEffect, useRef } from 'react';

const Projects = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef(null);
  const projects = [
    {
      title: "Implementasi AR Remote Assist",
      category: "Immersive Technology",
      description: "Mengintegrasikan kacamata pintar AR dengan platform bantuan IT jarak jauh untuk memandu teknisi lapangan dalam menyelesaikan troubleshooting server fisik secara real-time.",
      tags: ["AR", "Smart Glasses", "WebRTC"],
      docLink: "https://drive.google.com/your-ar-assist-doc"
    },
    {
      title: "Simulasi Pelatihan VR Hardware",
      category: "Virtual Reality",
      description: "Merancang lingkungan laboratorium simulasi VR berbasis WebXR untuk pelatihan interaktif pemeliharaan dan troubleshooting kegagalan hardware bagi staf IT baru.",
      tags: ["VR", "WebXR", "Unity"],
      docLink: "https://drive.google.com/your-vr-training-doc"
    },
    {
      title: "Migrasi Sistem Windows 10 ke 11",
      category: "OS & Deployment",
      description: "Memimpin proses migrasi massal sistem operasi dari Windows 10 ke Windows 11 untuk 150+ unit komputer kantor, dengan meminimalisir waktu henti (downtime).",
      tags: ["Windows", "Active Directory", "Deployment"],
      docLink: "https://drive.google.com/your-windows-migration-doc"
    },
    {
      title: "Optimasi Jaringan Kantor Cabang",
      category: "Networking",
      description: "Melakukan re-konfigurasi topologi LAN dan implementasi VLAN untuk memisahkan lalu lintas data divisi, meningkatkan keamanan dan kecepatan jaringan.",
      tags: ["Cisco", "VLAN", "Mikrotik"],
      docLink: "https://drive.google.com/your-network-doc"
    }
  ];

  // Auto-scroll carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % projects.length);
    }, 5000); // Slide setiap 5 detik

    return () => clearInterval(interval);
  }, [projects.length]);

  // Scroll ke item yang aktif
  useEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = currentIndex * (container.scrollWidth / projects.length);
      container.scrollTo({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  }, [currentIndex, projects.length]);

  return (
    <section id="projects" className="section projects">
      <div className="container">
        <div className="section-header">
          <div>
            <h2 className="section-title">Proyek & Pencapaian</h2>
            <p className="section-subtitle">Beberapa inisiatif teknis yang telah saya kerjakan untuk meningkatkan efisiensi IT.</p>
          </div>
        </div>
        
        <div className="carousel-wrapper">
          <div className="projects-carousel" ref={scrollContainerRef}>
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
                  <a 
                    href={project.docLink} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="project-doc-link"
                  >
                    📄 Dokumentasi
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Indicator dots */}
        <div className="carousel-indicators">
          {projects.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to project ${index + 1}`}
            ></button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
