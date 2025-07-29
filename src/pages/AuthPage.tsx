import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { Eye, EyeOff, Brain } from "lucide-react";

interface AuthPageProps {
  onAuthSuccess: (user: User) => void;
}

const AuthPage = ({ onAuthSuccess }: AuthPageProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already logged in
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        onAuthSuccess(session.user);
      }
      setInitialLoading(false);
    };

    // Set up auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          onAuthSuccess(session.user);
        }
      }
    );

    checkSession();

    return () => subscription.unsubscribe();
  }, [onAuthSuccess]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        if (data.user) {
          toast({
            title: "Login berhasil!",
            description: "Selamat datang kembali!",
          });
        }
      } else {
        const redirectUrl = `${window.location.origin}/`;
        
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectUrl,
            data: {
              display_name: displayName || email.split('@')[0]
            }
          }
        });

        if (error) throw error;

        if (data.user) {
          toast({
            title: "Registrasi berhasil!",
            description: "Akun berhasil dibuat. Silakan login!",
          });
          setIsLogin(true);
        }
      }
    } catch (error: any) {
      let errorMessage = "Terjadi kesalahan";
      
      if (error.message.includes("Invalid login credentials")) {
        errorMessage = "Email atau password salah";
      } else if (error.message.includes("User already registered")) {
        errorMessage = "Email sudah terdaftar, silakan login";
      } else if (error.message.includes("Email not confirmed")) {
        errorMessage = "Silakan konfirmasi email Anda terlebih dahulu";
      } else {
        errorMessage = error.message;
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Brain className="w-16 h-16 text-mejakia-primary mx-auto animate-pulse" />
          <p className="text-foreground font-nunito">Memuat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 bg-card">
        <div className="text-center space-y-2 mb-8">
          <div className="w-20 h-20 bg-mejakia-gradient rounded-xl flex items-center justify-center mx-auto">
            <Brain className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-fredoka font-semibold text-foreground">MejaKita Quiz</h1>
          <p className="text-muted-foreground font-nunito">
            {isLogin ? "Masuk ke akun Anda" : "Buat akun baru"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="displayName">Nama Tampilan</Label>
              <Input
                id="displayName"
                type="text"
                placeholder="Masukkan nama Anda"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="mejakia-input"
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mejakia-input"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mejakia-input pr-12"
                minLength={6}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-12 w-12"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          <Button
            type="submit"
            variant="mejakia"
            size="lg"
            className="w-full h-12"
            disabled={loading}
          >
            {loading ? "Memproses..." : (isLogin ? "Masuk" : "Daftar")}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-muted-foreground">
            {isLogin ? "Belum punya akun?" : "Sudah punya akun?"}
          </p>
          <Button
            variant="ghost"
            className="mt-2 text-quiz-purple hover:text-quiz-purple/80"
            onClick={() => {
              setIsLogin(!isLogin);
              setEmail("");
              setPassword("");
              setDisplayName("");
            }}
          >
            {isLogin ? "Daftar di sini" : "Masuk di sini"}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AuthPage;