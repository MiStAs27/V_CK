'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Warehouse } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function AuthForm() {
  const router = useRouter();
  const [loginEmail, setLoginEmail] = React.useState('');
  const [loginPassword, setLoginPassword] = React.useState('');
  const [signupName, setSignupName] = React.useState('');
  const [signupEmail, setSignupEmail] = React.useState('');
  const [signupPassword, setSignupPassword] = React.useState('');

  React.useEffect(() => {
    // Set default values on the client to avoid hydration mismatch
    setLoginEmail('admin@example.com');
    setLoginPassword('password');
  }, []);

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

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-2">
          <Warehouse className="w-10 h-10 text-primary" />
        </div>
        <CardTitle className="text-2xl">Control de Stock</CardTitle>
        <CardDescription>
          Accede a tu cuenta o crea una nueva.
        </CardDescription>
      </CardHeader>
      <Tabs defaultValue="login" className="px-6 pb-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
          <TabsTrigger value="register">Añadir Usuario</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <form onSubmit={handleLoginSubmit}>
            <CardContent className="grid gap-4 p-0 py-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter className="p-0">
              <Button className="w-full" type="submit">
                Iniciar Sesión
              </Button>
            </CardFooter>
          </form>
        </TabsContent>
        <TabsContent value="register">
          <form onSubmit={handleSignupSubmit}>
            <CardContent className="grid gap-4 p-0 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  placeholder="Tu Nombre"
                  required
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="register-email">Correo Electrónico</Label>
                <Input
                  id="register-email"
                  type="email"
                  placeholder="tu@ejemplo.com"
                  required
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="register-password">Contraseña</Label>
                <Input
                  id="register-password"
                  type="password"
                  required
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter className="p-0">
              <Button className="w-full" type="submit">
                Añadir Usuario
              </Button>
            </CardFooter>
          </form>
        </TabsContent>
      </Tabs>
    </Card>
  );
}