'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { User, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';

export function AuthForm() {
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const router = useRouter();
  const [isRegistering, setIsRegistering] = React.useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = React.useState('');
  const [loginPassword, setLoginPassword] = React.useState('');

  // Signup form state
  const [signupName, setSignupName] = React.useState('');
  const [signupEmail, setSignupEmail] = React.useState('');
  const [signupPassword, setSignupPassword] = React.useState('');

  const handleLoginSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // In a real app, you'd handle authentication here.
    // For this demo, we'll just redirect to the dashboard.
    router.push('/dashboard');
  };

  const handleSignupSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // In a real app, you'd handle user creation here.
    // For this demo, we'll just redirect to the dashboard.
    console.log('Creating user:', { name: signupName, email: signupEmail });
    router.push('/dashboard');
  };

  if (!isClient) {
    return (
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-2 text-center">
          <Skeleton className="h-8 w-3/4 mx-auto" />
          <Skeleton className="h-4 w-1/2 mx-auto" />
        </div>
        <div className="space-y-4 p-8">
          <div className="grid gap-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="grid gap-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
           <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-20" />
            </div>
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="h-4 w-3/4 mx-auto" />
      </div>
    );
  }

  if (isRegistering) {
    return (
      <div className="w-full max-w-sm space-y-6 rounded-lg bg-card p-8 shadow-sm">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Registrarse</h1>
          <p className="text-muted-foreground">Crea tu cuenta para empezar.</p>
        </div>
        <form onSubmit={handleSignupSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nombre</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="name"
                placeholder="Tu Nombre"
                required
                value={signupName}
                onChange={(e) => setSignupName(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="register-email">Correo Electrónico</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="register-email"
                type="email"
                placeholder="tu@ejemplo.com"
                required
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="register-password">Contraseña</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="register-password"
                type="password"
                required
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Button className="w-full" type="submit">
            Crear Cuenta
          </Button>
        </form>
        <p className="text-center text-sm text-muted-foreground">
          ¿Ya tienes una cuenta?{' '}
          <button
            onClick={() => setIsRegistering(false)}
            className="font-semibold text-primary hover:underline focus:outline-none"
          >
            Iniciar Sesión
          </button>
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm space-y-6 rounded-lg bg-card p-8 shadow-sm">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Iniciar Sesión</h1>
      </div>
      <form onSubmit={handleLoginSubmit} className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Usuario o correo electrónico</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="tu@ejemplo.com"
              required
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Contraseña</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="password"
              type="password"
              required
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox id="remember-me" />
            <Label htmlFor="remember-me" className="text-sm font-normal">
              Recuérdame
            </Label>
          </div>
          <a href="#" className="text-sm text-primary hover:underline">
            ¿Olvidaste tu contraseña?
          </a>
        </div>
        <Button className="w-full" type="submit">
          Iniciar Sesión
        </Button>
      </form>
      <p className="text-center text-sm text-muted-foreground">
        ¿Eres nuevo aquí?{' '}
        <button
          onClick={() => setIsRegistering(true)}
          className="font-semibold text-primary hover:underline focus:outline-none"
        >
          Crear una cuenta
        </button>
      </p>
    </div>
  );
}
