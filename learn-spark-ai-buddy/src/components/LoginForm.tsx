
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const LoginForm: React.FC = () => {
  const { login, isLoading } = useAuth();

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Socrates</CardTitle>
          <CardDescription className="text-center">
            Your AI-powered learning assistant
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center">
            <img 
              src="/placeholder.png" 
              alt="App Logo" 
              className="w-24 h-24 rounded-full bg-primary/10 p-2" 
            />
          </div>
          <p className="text-center text-sm text-muted-foreground">
            Sign in to start your personalized learning journey with our AI assistant.
          </p>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={login} 
            disabled={isLoading} 
            className="w-full"
          >
            {isLoading ? 'Signing in...' : 'Sign in with Google'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginForm;
