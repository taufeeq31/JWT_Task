import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export default function Sidebar({ user, onLogout }) {
    const initials =
        (user?.name || user?.email || '')
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 2)
            .map((s) => s[0]?.toUpperCase())
            .join('') || 'U';

    return (
        <div className="h-full flex flex-col">
            {user && (
                <div className="flex items-center gap-3 mb-6">
                    <Avatar className="bg-[#5069FF]">
                        <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <div>
                        <div className="font-medium text-[#0B1930]">{user.name}</div>
                        <div className="text-xs opacity-70">{user.email}</div>
                    </div>
                </div>
            )}

            <Separator className="mb-4" />

            <nav className="flex flex-col gap-2 text-sm flex-1">
                <Button variant="ghost" className="justify-start text-[#0B1930]">
                    Overview
                </Button>
                <Button variant="ghost" className="justify-start opacity-80">
                    Tasks
                </Button>
                <Button variant="ghost" className="justify-start opacity-80">
                    Settings
                </Button>
            </nav>

            <Button
                onClick={onLogout}
                disabled={!onLogout}
                className="mt-4 bg-[#5069FF] hover:bg-[#3C54E0] text-white"
            >
                Logout
            </Button>
        </div>
    );
}
