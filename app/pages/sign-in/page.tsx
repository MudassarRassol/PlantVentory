'use client';
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SignUp, SignIn } from '@/app/actions/user.action';
import { Toaster, toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function AuthPage(props) {
  const router = useRouter();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    setIsLoading(true);
    try {
      const response = await SignUp(email, password);
      if (response?.success) {
        toast.success("Account created successfully");
      } else {
        toast.error(response?.message || "Failed to create account");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      const response = await SignIn(email, password);
      if (response?.success) {
        localStorage.setItem('login', 'true');
        localStorage.setItem('role' ,  'user' )
        toast.success("Logged in successfully");
        window.location.href = '/'; // Redirect to home page
      } else {
        toast.error(response?.message || "Login failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen ">
      <Toaster position="top-center" />
      <div className="w-full max-w-md p-8 space-y-8  rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center">Welcome</h1>
        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="signin" className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button 
              className="w-full" 
              onClick={handleSignIn}
              disabled={isLoading}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </TabsContent>
          
          <TabsContent value="signup" className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Button 
              className="w-full" 
              onClick={handleSignUp}
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </Button>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}