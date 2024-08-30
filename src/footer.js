
import React from 'react';
import './footer.css'; 
import {FaFacebook, FaTwitter, FaInstagram} from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
       
        <p>© 2024 Meteo Cloud. Tutti i diritti riservati.</p>
        <p>
          Dati meteo forniti da <a href="https://openweathermap.org/" target="_blank" rel="noopener noreferrer">OpenWeatherMap</a>.
        </p>
        <div className="footer-links">
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebook className="social-icon" /></a>
          <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter className="social-icon" /></a>
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer"> <FaInstagram className="social-icon" /></a>
        </div>
        <p className="disclaimer">
          Le informazioni meteo fornite sono indicative e potrebbero subire variazioni. Utilizzare l'app a proprio rischio e pericolo.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
