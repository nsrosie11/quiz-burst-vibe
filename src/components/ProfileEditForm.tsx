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
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex">
        {/* Sidebar Navigation */}
        <div className="w-80 mr-8">
          <Card className="bg-card">
            <CardContent className="p-0">
              <div className="space-y-1">
                <div className="bg-primary/10 text-primary px-4 py-3 rounded-lg font-medium">
                  Ubah Profile
                </div>
                <div className="px-4 py-3 text-muted-foreground hover:bg-accent rounded-lg cursor-pointer">
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
              <h1 className="text-3xl font-bold font-fredoka">Profile Kamu</h1>
              <p className="text-muted-foreground mt-2">Yuk, Tunjukin Siapa Kamu</p>
            </div>
          </div>

          <div className="flex gap-8">
            {/* Avatar Section */}
            <div className="flex-shrink-0">
              <Avatar className="w-40 h-40 border-2 border-stroke">
                <AvatarImage src="/lovable-uploads/32babd27-9246-43b1-8e03-8668c61a1739.png" alt="Profile" />
                <AvatarFallback className="bg-primary/10 text-primary text-4xl font-semibold">
                  {name?.[0] || email?.[0] || "?"}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Form Section */}
            <div className="flex-1 space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Masukkan nama kamu"
                  className="mejakia-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <Input
                  value={email}
                  disabled
                  className="mejakia-input bg-muted"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  onClick={handleSave}
                  disabled={loading}
                  className="bg-profile-gradient hover:bg-profile-gradient-hover shadow-profile hover:shadow-profile-hover"
                >
                  {loading ? "Menyimpan..." : "Simpan"}
                </Button>
                <Button variant="outline">
                  Batal
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditForm;