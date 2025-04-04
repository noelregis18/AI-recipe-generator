
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';

const LogoutButton = () => {
  const { signOut, user } = useAuth();
  
  if (!user) return null;
  
  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Failed to log out');
    }
  };
  
  return (
    <Button 
      variant="outline"
      size="sm"
      onClick={handleLogout}
      className="ml-4"
    >
      <LogOut className="mr-2 h-4 w-4" />
      Logout
    </Button>
  );
};

export default LogoutButton;
