import './About.css';

const About = () => {
  return (
    <section id="about" className="section about">
      <div className="container">
        <h2 className="section-title">Tentang Saya</h2>
        <div className="about-content">
          <div className="about-text">
            <p>
              Halo <strong>Akhmad Febriyo Febriyansyah</strong>. Saya adalah seorang IT Support yang berdedikasi tinggi dalam memecahkan masalah teknis dan mengelola infrastruktur IT.
              Fokus utama saya adalah memastikan perangkat keras, perangkat lunak, dan jaringan di lingkungan kerja beroperasi tanpa hambatan.
            </p>
            <p>
              Dengan pengalaman menangani berbagai skenario *troubleshooting* mulai dari masalah ringan hingga manajemen *server* dasar, saya mengerti pentingnya respons cepat dan komunikasi yang baik untuk membantu pengguna (*end-user*) agar tetap produktif.
            </p>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <h3>3+</h3>
              <p>Tahun Pengalaman</p>
            </div>
            <div className="stat-card">
              <h3>500+</h3>
              <p>Tiket Terselesaikan</p>
            </div>
            <div className="stat-card">
              <h3>100%</h3>
              <p>Komitmen</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
