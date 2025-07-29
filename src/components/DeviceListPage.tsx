import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2 } from "lucide-react";

const DeviceListPage = () => {
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-center font-fredoka">Daftar Perangkat</h1>
            <p className="text-muted-foreground text-center mt-2">Lihat daftar perangkat kamu yang terhubung ke akun Mejakita</p>
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