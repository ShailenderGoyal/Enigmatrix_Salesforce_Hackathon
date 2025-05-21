
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ThemeToggle from './ThemeToggle';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Link, useLocation } from 'react-router-dom';
import { useLearning } from '@/contexts/LearningContext';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { currentModule } = useLearning();
  const location = useLocation();

  return (
    <header className="w-full px-4 py-3 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 fixed top-0 left-0 z-20">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg text-primary">
              Socrates
            </span>
            {currentModule && (
              <span className="text-sm text-muted-foreground hidden md:inline-block ml-2">
                • {currentModule.title}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <nav className="mr-4">
            <ul className="flex items-center space-x-4">
              <li>
                <Link 
                  to="/" 
                  className={`text-sm font-medium transition-colors hover:text-primary ${location.pathname === '/' ? 'text-primary' : 'text-muted-foreground'}`}
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link 
                  to="/notes" 
                  className={`text-sm font-medium transition-colors hover:text-primary ${location.pathname === '/notes' ? 'text-primary' : 'text-muted-foreground'}`}
                >
                  My Notes
                </Link>
              </li>
            </ul>
          </nav>
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
