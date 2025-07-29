import { useState } from "react";
import { User, Settings, Monitor, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";

interface ProfileDropdownProps {
  onProfileEdit: () => void;
  onPasswordChange: () => void;
  onDeviceList: () => void;
}

const ProfileDropdown = ({ onProfileEdit, onPasswordChange, onDeviceList }: ProfileDropdownProps) => {
  const { signOut, user, profile } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="focus:outline-none">
          <Avatar className="w-10 h-10 border-2 border-stroke hover:border-primary transition-colors">
            <AvatarImage src="/lovable-uploads/32babd27-9246-43b1-8e03-8668c61a1739.png" alt="Profile" />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {profile?.display_name?.[0] || user?.email?.[0] || "?"}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 mt-2 bg-card border-2 border-stroke rounded-xl p-2">
        <div className="px-3 py-2 border-b border-stroke mb-2">
          <p className="font-semibold text-foreground">
            {profile?.display_name || user?.email?.split('@')[0] || "User"}
          </p>
        </div>
        <DropdownMenuItem 
          onClick={onProfileEdit}
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent cursor-pointer"
        >
          <User className="w-4 h-4" />
          <span>Ubah Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={onPasswordChange}
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent cursor-pointer"
        >
          <Settings className="w-4 h-4" />
          <span>Ubah Password</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={onDeviceList}
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent cursor-pointer"
        >
          <Monitor className="w-4 h-4" />
          <span>Daftar Perangkat</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={handleSignOut}
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent cursor-pointer text-destructive"
        >
          <LogOut className="w-4 h-4" />
          <span>Keluar</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileDropdown;