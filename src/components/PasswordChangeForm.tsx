import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PasswordChangeFormProps {
  onBack: () => void;
}

const PasswordChangeForm = ({ onBack }: PasswordChangeFormProps) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Password baru dan konfirmasi tidak cocok");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password baru minimal 6 karakter");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;
      
      toast.success("Password berhasil diubah!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error("Gagal mengubah password");
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex">
        {/* Sidebar Navigation */}
        <div className="w-80 mr-8">
          <Card className="bg-card">
            <CardContent className="p-0">
              <div className="space-y-1">
                <div className="px-4 py-3 text-muted-foreground hover:bg-accent rounded-lg cursor-pointer">
                  Ubah Profile
                </div>
                <div className="bg-primary/10 text-primary px-4 py-3 rounded-lg font-medium">
                  Ubah Password
                </div>
                <div className="px-4 py-3 text-muted-foreground hover:bg-accent rounded-lg cursor-pointer">
                  Riwayat Transaksi
                </div>
                <div className="px-4 py-3 text-muted-foreground hover:bg-accent rounded-lg cursor-pointer">
                  Daftar Perangkat
                </div>
                <div className="px-4 py-3 text-destructive hover:bg-accent rounded-lg cursor-pointer">
                  Keluar
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="mb-8 relative">
            <Button 
              variant="back" 
              size="icon" 
              onClick={onBack}
              className="absolute left-0 top-0 w-10 h-10"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="text-center">
              <h1 className="text-3xl font-bold font-fredoka">Ubah Password</h1>
              <p className="text-muted-foreground mt-2">Ubah password kamu untuk keamanan akun</p>
            </div>
          </div>

          <div className="max-w-lg space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Password Lama</label>
              <div className="relative">
                <Input
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Masukkan password lama kamu"
                  className="mejakia-input pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password Baru</label>
              <div className="relative">
                <Input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Masukkan password baru kamu"
                  className="mejakia-input pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Konfirmasi Password Baru</label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Masukkan password baru kamu"
                  className="mejakia-input pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button
              onClick={handleChangePassword}
              disabled={loading || !currentPassword || !newPassword || !confirmPassword}
              className="w-full bg-profile-gradient hover:bg-profile-gradient-hover shadow-profile hover:shadow-profile-hover"
            >
              {loading ? "Mengubah Password..." : "Ubah Password"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordChangeForm;