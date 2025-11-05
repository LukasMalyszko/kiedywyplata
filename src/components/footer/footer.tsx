import './footer.scss';

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__content">
          <p className="footer__text">
            © {year} Kiedy Wypłata - Informacje o terminach wypłat świadczeń w
            Polsce
          </p>
          <div className="footer__links">
            <a
              href="https://www.katalogseo.net.pl"
              title="Katalog SEO"
              className="footer__link"
              target="_blank"
              rel="noopener noreferrer"
            >
              Katalog SEO
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
