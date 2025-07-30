import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, ArrowLeft } from "lucide-react";

interface DeviceListPageProps {
  onBack: () => void;
}

const DeviceListPage = ({ onBack }: DeviceListPageProps) => {
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
                <div className="px-4 py-3 text-muted-foreground hover:bg-accent rounded-lg cursor-pointer">
                  Ubah Password
                </div>
                <div className="px-4 py-3 text-muted-foreground hover:bg-accent rounded-lg cursor-pointer">
                  Riwayat Transaksi
                </div>
                <div className="bg-primary/10 text-primary px-4 py-3 rounded-lg font-medium">
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
              <h1 className="text-3xl font-bold font-fredoka">Daftar Perangkat</h1>
              <p className="text-muted-foreground mt-2">Lihat daftar perangkat kamu yang terhubung ke akun Mejakita</p>
            </div>
          </div>

          <Card className="bg-card">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <span className="font-medium">Device:</span> browser none none
                </div>
                <div>
                  <span className="font-medium">Operating System:</span> Windows 10
                </div>
                <div>
                  <span className="font-medium">Browser:</span> Chrome 134
                </div>
                <Button 
                  variant="destructive" 
                  className="mt-4 flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Remove Device
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DeviceListPage;