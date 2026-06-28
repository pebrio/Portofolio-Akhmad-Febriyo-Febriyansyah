import './Hero.css';
import FotoSaya from '../assets/img.png'; // Perhatikan perubahan path dan tanda kutip

const Hero = () => {
  // Ganti URL ini dengan link Google Drive CV Anda
  const cvLink = "https://drive.google.com/your-cv-link";

  return (
    <section id="home" className="hero section">
      <div className="container hero-container">
        <div className="hero-content">
          <h1 className="title">Akhmad Febriyo Febriyansyah.</h1>
          <h2 className="subtitle">Saya mengoptimalkan & mendukung ekosistem IT Anda.</h2>
          <p className="description">
            Sebagai seorang <strong>IT Support Profesional</strong> dengan sgpesialisasi sistem teknologi imersif, saya mengelola, memelihara, dan menyelesaikan masalah infrastruktur IT tingkat lanjut, termasuk workstation <strong>AR/VR dan Motion Graphics</strong>.
          </p>
          <div className="cta-group">
            <a href={cvLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary">Download CV</a>
            <a href="#projects" className="btn btn-secondary">Lihat Pekerjaan Saya</a>
            <a href="#contact" className="btn btn-secondary">Hubungi Saya</a>
          </div>
        </div>
        <div className="hero-visual">
          <div className="shape shape-1"></div>
          <div className="hero-photo-wrapper">
            <img src={FotoSaya} alt="Akhmad Febriyo Febriyansyah" className="hero-photo" />
          </div>
          <div className="shape shape-2"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;