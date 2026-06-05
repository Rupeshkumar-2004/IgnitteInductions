import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="w-full py-stack-lg px-container-padding flex flex-col md:flex-row justify-between items-center gap-gutter bg-surface border-t border-surface-container-highest mt-auto">
      <Link to="/" className="font-headline-sm text-headline-sm font-bold text-primary-container hover:opacity-90 transition-opacity">
        Ignitte
      </Link>
      <div className="flex flex-wrap justify-center gap-6">
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="font-label-md text-label-md text-on-surface-variant hover:text-primary-container transition-colors">
          Instagram
        </a>
        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="font-label-md text-label-md text-on-surface-variant hover:text-primary-container transition-colors">
          LinkedIn
        </a>
        <a href="mailto:ignitte@nitt.edu" className="font-label-md text-label-md text-on-surface-variant hover:text-primary-container transition-colors">
          Email Us
        </a>
        <a href="https://kt.ignitte.org/" target="_blank" rel="noopener noreferrer" className="font-label-md text-label-md text-on-surface-variant hover:text-primary-container transition-colors">
          Kalvithadam
        </a>
        <Link to="#" className="font-label-md text-label-md text-on-surface-variant hover:text-primary-container transition-colors">
          Privacy Policy
        </Link>
      </div>
      <div className="font-label-md text-label-md text-on-surface-variant">
        © {new Date().getFullYear()} Ignitte. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;