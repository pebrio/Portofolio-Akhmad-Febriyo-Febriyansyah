import './Contact.css';

const Contact = () => {
  return (
    <section id="contact" className="section contact">
      <div className="container contact-container">
        <h2 className="section-title">Mari Berkolaborasi</h2>
        <p className="contact-text">
          Apakah infrastruktur IT Anda membutuhkan pemeliharaan, atau Anda sedang mencari tenaga IT Support yang handal? 
          Saya selalu terbuka untuk mendiskusikan bagaimana saya dapat membantu operasional teknis Anda.
        </p>
        
        <a href="mailto:halo@emailanda.com" className="email-link">
          halo@emailanda.com
        </a>

        <div className="social-links">
          <a href="#" aria-label="LinkedIn">LinkedIn</a>
          <a href="#" aria-label="GitHub">GitHub</a>
          <a href="#" aria-label="WhatsApp">WhatsApp</a>
        </div>
      </div>
    </section>
  );
};

export default Contact;
