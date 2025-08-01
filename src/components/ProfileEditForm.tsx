import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

interface ProfileEditFormProps {
  onBack: () => void;
}

const ProfileEditForm = ({ onBack }: ProfileEditFormProps) => {
  const { user, profile } = useAuth();
  const [name, setName] = useState(profile?.display_name || "");
  const [email] = useState(user?.email || "");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          display_name: name,
        });

      if (error) throw error;
      
      toast.success("Profile berhasil diperbarui!");
    } catch (error) {
      toast.error("Gagal memperbarui profile");
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8 relative">
          <Button 
            variant="back" 
            size="icon" 
            onClick={onBack}
            className="absolute left-0 top-2 w-10 h-10"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-3xl font-bold font-fredoka text-foreground">Profile Kamu</h1>
            <p className="text-muted-foreground mt-2">Yuk, Tunjukin Siapa Kamu</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card className="bg-card border-2 border-stroke">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="bg-mejakia-gradient text-white px-4 py-3 rounded-xl font-semibold">
                    Ubah Profile
                  </div>
                  <div className="px-4 py-3 text-muted-foreground hover:bg-accent/50 rounded-xl cursor-pointer transition-colors">
                    Ubah Password
                  </div>
                  <div className="px-4 py-3 text-muted-foreground hover:bg-accent/50 rounded-xl cursor-pointer transition-colors">
                    Riwayat Transaksi
                  </div>
                  <div className="px-4 py-3 text-muted-foreground hover:bg-accent/50 rounded-xl cursor-pointer transition-colors">
                    Daftar Perangkat
                  </div>
                  <div className="px-4 py-3 text-destructive hover:bg-destructive/10 rounded-xl cursor-pointer transition-colors">
                    Keluar
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="bg-card border-2 border-stroke">
              <CardHeader className="pb-6">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                  {/* Avatar Section */}
                  <div className="flex-shrink-0">
                    <Avatar className="w-32 h-32 border-4 border-stroke shadow-lg">
                      <AvatarImage src="/lovable-uploads/32babd27-9246-43b1-8e03-8668c61a1739.png" alt="Profile" />
                      <AvatarFallback className="bg-mejakia-gradient text-white text-4xl font-bold">
                        {name?.[0] || email?.[0] || "?"}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  
                  {/* User Info */}
                  <div className="flex-1 text-center md:text-left">
                    <h2 className="text-2xl font-bold text-foreground mb-2">{name || "User"}</h2>
                    <p className="text-muted-foreground text-sm">{email}</p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Form Section */}
                <div className="grid gap-6">
                  <div>
                    <label className="block text-sm font-semibold mb-3 text-foreground">Nama Lengkap</label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Masukkan nama lengkap kamu"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-3 text-foreground">Email</label>
                    <Input
                      value={email}
                      disabled
                      className="bg-muted/50 cursor-not-allowed"
                    />
                    <p className="text-xs text-muted-foreground mt-2">Email tidak dapat diubah</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-stroke">
                  <Button
                    onClick={handleSave}
                    disabled={loading}
                    className="bg-mejakia-gradient hover:bg-mejakia-gradient-hover shadow-mejakia hover:shadow-mejakia-hover text-white font-semibold"
                  >
                    {loading ? "Menyimpan..." : "Simpan Perubahan"}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={onBack}
                    className="border-2 border-stroke hover:bg-accent/50"
                  >
                    Batal
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditForm;