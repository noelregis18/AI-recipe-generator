
import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Culinary Photo Genius</h3>
            <p className="text-sm text-gray-600 mb-4">
              Turn your ingredients into delicious recipes with AI technology.
            </p>
            <div className="flex space-x-4">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                <Github size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                <Twitter size={20} />
              </a>
              <a href="mailto:noel.regis04@gmail.com" className="social-icon">
                <Mail size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/recipe" className="hover:text-primary transition-colors">Recipe Generator</Link>
              </li>
              <li>
                <a href="#contact" className="hover:text-primary transition-colors">Contact Us</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <MapPin size={18} className="mr-2 mt-0.5 flex-shrink-0 text-primary" />
                <a 
                  href="https://www.google.com/maps/place/Asansol,+West+Bengal,+India" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  Asansol, West Bengal, India
                </a>
              </li>
              <li className="flex items-start">
                <Mail size={18} className="mr-2 mt-0.5 flex-shrink-0 text-primary" />
                <a 
                  href="mailto:noel.regis04@gmail.com" 
                  className="hover:text-primary transition-colors"
                >
                  noel.regis04@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-8 text-center text-sm text-gray-600">
          <p>&copy; {new Date().getFullYear()} Culinary Photo Genius. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
