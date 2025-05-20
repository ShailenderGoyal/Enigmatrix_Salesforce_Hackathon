
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ThemeToggle from './ThemeToggle';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useLearning } from '@/contexts/LearningContext';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import favicon from './public/favicon.png'
const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { currentModule } = useLearning();

  return (
    <header className="w-full px-4 py-3 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 fixed top-0 left-0 z-10">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
  <img src="/favicon.png" alt="Socrates logo" style={{ height: '24px', width: '24px' }} />
  <span style={{ fontWeight: 'bold', fontSize: '1.25rem', color: '#123456' /* your primary color */ }}>
    Socrates
  </span>
</div>
          {currentModule && (
            <span className="text-sm text-muted-foreground hidden md:inline-block">
              • {currentModule.title}
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-3">
          <ThemeToggle />
          
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative rounded-full h-8 w-8 p-0">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.photoURL} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuLabel className="font-normal text-sm text-muted-foreground">
                  {user.email}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout()}>
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
