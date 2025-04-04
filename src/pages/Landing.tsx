
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/lib/auth';

const Landing = () => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container px-4 py-8">
        <section className="py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Turn Your Food Photos Into Delicious Recipes
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Culinary Photo Genius uses AI to analyze food photos and suggest recipes you can make with ingredients you already have at home.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              {user ? (
                <Link to="/recipe">
                  <Button size="lg" className="px-8">
                    Go to Recipe Generator
                  </Button>
                </Link>
              ) : (
                <Link to="/auth">
                  <Button size="lg" className="px-8">
                    Get Started
                  </Button>
                </Link>
              )}
              <a href="#how-it-works">
                <Button variant="outline" size="lg" className="px-8">
                  Learn More
                </Button>
              </a>
            </div>
          </div>
        </section>
        
        <Separator className="my-12" />
        
        <section id="how-it-works" className="py-12">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-10 text-center">How It Works</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6 bg-secondary rounded-lg">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Upload a Photo</h3>
                <p>Take a picture of your ingredients or your refrigerator contents</p>
              </div>
              
              <div className="text-center p-6 bg-secondary rounded-lg">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">AI Analysis</h3>
                <p>Our AI identifies ingredients and suggests what you can cook with them</p>
              </div>
              
              <div className="text-center p-6 bg-secondary rounded-lg">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Get Recipes</h3>
                <p>Choose from several recipe options with detailed instructions</p>
              </div>
            </div>
          </div>
        </section>
        
        <Separator className="my-12" />
        
        <section id="contact" className="py-12">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Get in Touch
          </h2>
          <ContactForm />
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Landing;
