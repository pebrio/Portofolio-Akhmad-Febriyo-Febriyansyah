import './Skills.css';
import { useState, useEffect, useRef } from 'react';

const Skills = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef(null);
  const skills = [
    { name: 'Hardware & PC Troubleshooting', icon: '💻', docLink: "https://drive.google.com/your-hardware-doc" },
    { name: 'AR/VR Hardware Support & Setup', icon: '🥽', docLink: "https://drive.google.com/your-arvr-doc" },
    { name: '3D Motion Graphics Support', icon: '🎬', docLink: "https://drive.google.com/your-graphics-doc" },
    { name: 'OS Administration (Windows/Linux)', icon: '🐧', docLink: "https://drive.google.com/your-os-doc" },
    { name: 'Network Configuration (LAN/WLAN)', icon: '🌐', docLink: "https://drive.google.com/your-network-doc" },
    { name: 'Software Installation & Patching', icon: '⚙️', docLink: "https://drive.google.com/your-software-doc" },
    { name: 'Immersive Tech & WebXR Config', icon: '🕶️', docLink: "https://drive.google.com/your-webxr-doc" },
    { name: 'Remote Support (TeamViewer/AnyDesk)', icon: '📞', docLink: "https://drive.google.com/your-remote-doc" },
    { name: 'Hardware Maintenance & Upgrades', icon: '🔧', docLink: "https://drive.google.com/your-maintenance-doc" },
    { name: 'IT Security Basics & Antivirus', icon: '🛡️', docLink: "https://drive.google.com/your-security-doc" }
  ];

  // Auto-scroll carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % Math.ceil(skills.length / getItemsPerView()));
    }, 4000); // Slide setiap 4 detik

    return () => clearInterval(interval);
  }, [skills.length]);

  const getItemsPerView = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 768) return 1;
      if (window.innerWidth < 1024) return 2;
      return 3;
    }
    return 2;
  };

  // Scroll ke item yang aktif
  useEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = currentIndex * (container.scrollWidth / Math.ceil(skills.length / getItemsPerView()));
      container.scrollTo({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  }, [currentIndex, skills.length]);

  return (
    <section id="skills" className="section skills">
      <div className="container">
        <div className="section-header">
          <div>
            <h2 className="section-title">Keahlian Teknis</h2>
            <p className="section-subtitle">Beberapa teknologi dan area fokus yang saya tangani sehari-hari.</p>
          </div>
        </div>

        <div className="carousel-wrapper">
          <div className="skills-carousel" ref={scrollContainerRef}>
            {skills.map((skill, index) => (
              <div key={index} className="skill-card">
                <div className="skill-icon">{skill.icon}</div>
                <h4 className="skill-name">{skill.name}</h4>
                <a 
                  href={skill.docLink} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="skill-doc-link"
                >
                  📄 Doc
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Indicator dots */}
        <div className="carousel-indicators">
          {Array.from({ length: Math.ceil(skills.length / getItemsPerView()) }).map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to skills ${index + 1}`}
            ></button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
