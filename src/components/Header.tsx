
import React from 'react';
import { Link } from 'react-router-dom';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/lib/auth';
import LogoutButton from './LogoutButton';
import { Heart } from 'lucide-react';

const Header = () => {
  const { user } = useAuth();
  
  return (
    <header className="bg-white shadow-sm py-4 px-6">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-primary">
          Culinary Photo Genius
        </Link>
        
        <NavigationMenu>
          <NavigationMenuList className="flex items-center space-x-4">
            <NavigationMenuItem>
              <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
                Home
              </Link>
            </NavigationMenuItem>
            
            {user && (
              <>
                <NavigationMenuItem>
                  <Link to="/recipe" className="text-sm font-medium hover:text-primary transition-colors">
                    Recipe Generator
                  </Link>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <Link to="/saved" className="text-sm font-medium hover:text-primary transition-colors flex items-center">
                    <Heart className="h-4 w-4 mr-1" /> Saved
                  </Link>
                </NavigationMenuItem>
              </>
            )}
            
            <NavigationMenuItem>
              <a 
                href="#contact" 
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Contact
              </a>
            </NavigationMenuItem>
            
            {!user ? (
              <NavigationMenuItem>
                <Link to="/auth">
                  <Button variant="default" size="sm">
                    Sign In
                  </Button>
                </Link>
              </NavigationMenuItem>
            ) : (
              <LogoutButton />
            )}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  );
};

export default Header;
