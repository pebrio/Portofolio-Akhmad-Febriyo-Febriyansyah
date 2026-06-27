const Footer = () => {
  return (
    <footer style={{
      textAlign: 'center',
      padding: '2rem',
      borderTop: '1px solid var(--color-border)',
      color: 'var(--color-text-muted)',
      fontSize: '0.875rem'
    }}>
      <p>&copy; {new Date().getFullYear()} Akhmad Febriyo Febriyansyah. Dibuat dengan 💙.</p>
    </footer>
  );
};

export default Footer;
