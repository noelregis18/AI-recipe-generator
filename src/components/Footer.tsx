
import React from 'react';
import { Github, Linkedin, Mail, MapPin, Phone, Twitter } from 'lucide-react';
import { Separator } from "@/components/ui/separator";

const SocialLink = ({ 
  href, 
  icon: Icon, 
  label 
}: { 
  href: string; 
  icon: React.ElementType; 
  label: string 
}) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer"
    className="flex items-center gap-2 social-icon"
    aria-label={label}
  >
    <Icon className="h-5 w-5" />
    <span>{label}</span>
  </a>
);

const Footer = () => {
  return (
    <footer className="bg-culinary-peach/30 py-10 mt-10">
      <div className="container px-4">
        <h2 className="text-2xl font-semibold mb-6 text-center">Reach Out to Me</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <SocialLink 
            href="https://www.linkedin.com/in/noel-regis-aa07081b1/" 
            icon={Linkedin} 
            label="LinkedIn"
          />
          
          <SocialLink 
            href="https://github.com/noelregis18" 
            icon={Github} 
            label="GitHub"
          />
          
          <SocialLink 
            href="https://x.com/NoelRegis8" 
            icon={Twitter} 
            label="Twitter"
          />
          
          <SocialLink 
            href="http://topmate.io/noel_regis" 
            icon={Mail} 
            label="Topmate"
          />
        </div>
        
        <Separator className="my-6" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            <a 
              href="mailto:noel.regis04@gmail.com"
              className="hover:text-primary transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              noel.regis04@gmail.com
            </a>
          </div>
          
          <div className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-primary" />
            <a 
              href="tel:+917319546900"
              className="hover:text-primary transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              +91 7319546900
            </a>
          </div>
          
          <div className="flex items-center gap-2 md:col-span-2">
            <MapPin className="h-5 w-5 text-primary flex-shrink-0" />
            <a 
              href="https://maps.google.com/?q=Asansol,West+Bengal,India" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              Asansol, West Bengal, India
            </a>
          </div>
        </div>
        
        <div className="text-center text-sm text-muted-foreground mt-8">
          © {new Date().getFullYear()} Culinary Photo Genius. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
