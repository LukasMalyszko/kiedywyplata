import Link from 'next/link';
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
            <Link
              href="/sejm/interpelacje"
              className="footer__link"
              title="Interpelacje Sejmu RP o emeryturach"
            >
              Interpelacje o emeryturach
            </Link>
            <a
              href="https://www.katalogseo.net.pl"
              title="Katalog SEO"
              className="footer__link"
              target="_blank"
              rel="noopener noreferrer"
            >
              Katalog SEO
            </a>
            <a
              href="https://katalog.stronwww.eu/"
              title="Katalog Stron WWW"
              className="footer__link"
              target="_blank"
              rel="noopener noreferrer"
            >
              Katalog Stron WWW
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
