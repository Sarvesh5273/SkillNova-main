"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  BookOpen,
  Settings,
  Menu,
  X,
  ShieldAlert,
  Loader2,
  Lock,
  LogOut
} from "lucide-react";

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
  role?: string;
}

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPage, setSelectedPage] = useState("users");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUserEmail, setCurrentUserEmail] = useState("");
  
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      // 1. Get Current User
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserEmail(user.email || "");
      } else {
        // If not logged in, layout.tsx should have caught this, 
        // but as a failsafe, redirect to login
        router.push("/admin/login");
        return;
      }

      // 2. Fetch All Users for the Table
      // Since you are an admin (verified by layout.tsx), RLS allows this.
      const { data: usersData, error } = await supabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && usersData) {
        setUsers(usersData);
      }
      
      setIsLoading(false);
    };

    fetchData();
  }, [supabase, router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  const filteredUsers = users.filter(user => 
    user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-lime-400 animate-spin" />
          <p className="text-neutral-500 text-sm">Loading Dashboard Data...</p>
        </div>
      </div>
    );
  }

  const sidebarItems = [
    { id: "users", name: "User Management", icon: Users },
    { id: "tracks", name: "Career Tracks", icon: BookOpen },
    { id: "settings", name: "System Settings", icon: Settings },
  ];

  const renderContent = () => {
    switch (selectedPage) {
      case "users":
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white">User Management</h2>
                <p className="text-neutral-400">Total Users: <span className="text-lime-400">{users.length}</span></p>
              </div>
              <div className="flex gap-2">
                <Input 
                  placeholder="Search users..." 
                  className="bg-[#1a1a1a] border-neutral-800 text-white w-full sm:w-64 focus:border-lime-500/50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <Card className="bg-[#1a1a1a] border-neutral-800 overflow-hidden">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-neutral-400">
                    <thead className="bg-neutral-900 text-neutral-200 uppercase font-medium border-b border-neutral-800">
                      <tr>
                        <th className="px-6 py-4">User</th>
                        <th className="px-6 py-4">Email</th>
                        <th className="px-6 py-4">Joined</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Role</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800">
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-neutral-800/50 transition-colors">
                          <td className="px-6 py-4 font-medium text-white">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-xs font-bold text-lime-400">
                                    {user.full_name?.[0]?.toUpperCase() || "U"}
                                </div>
                                {user.full_name || "Anonymous"}
                            </div>
                          </td>
                          <td className="px-6 py-4">{user.email}</td>
                          <td className="px-6 py-4">
                            {new Date(user.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4">
                            <Badge className="bg-lime-500/10 text-lime-400 border-lime-500/20">
                              Active
                            </Badge>
                          </td>
                          <td className="px-6 py-4 uppercase text-xs font-bold tracking-wider">
                            {user.role || 'USER'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "tracks":
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6">
            <div className="w-20 h-20 bg-neutral-900 rounded-3xl flex items-center justify-center border border-neutral-800 shadow-xl">
              <BookOpen className="w-10 h-10 text-lime-500" />
            </div>
            <div className="max-w-md space-y-2">
                <h3 className="text-2xl font-bold text-white">Track CMS</h3>
                <p className="text-neutral-400">
                This module will allow you to create new career paths (e.g. "DevOps", "Mobile") and manage learning nodes dynamically.
                </p>
            </div>
            <Button className="bg-lime-500 text-black hover:bg-lime-400 font-semibold px-8 rounded-full">
              Coming Soon
            </Button>
          </div>
        );

      case "settings":
        return (
            <div className="space-y-6 max-w-4xl">
                <div>
                    <h2 className="text-2xl font-bold text-white">System Settings</h2>
                    <p className="text-neutral-400">Manage admin access and configurations.</p>
                </div>
                <Card className="bg-[#1a1a1a] border-neutral-800">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <Lock className="w-5 h-5 text-lime-400" />
                            Security Status
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="p-4 bg-green-900/10 border border-green-900/30 rounded-lg">
                            <p className="text-green-400 text-sm font-medium">✓ Database Access Confirmed</p>
                            <p className="text-neutral-500 text-xs mt-1">
                                You are viewing this page because your database role is set to <strong>'admin'</strong>.
                            </p>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-sm text-neutral-500 uppercase tracking-wider font-semibold">Your Session</span>
                            <div className="flex items-center justify-between p-3 bg-neutral-900 rounded-lg border border-neutral-800">
                                <span className="text-white font-mono">{currentUserEmail}</span>
                                <Badge className="bg-lime-500 text-black font-bold">ADMIN</Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );

      default:
        return <div className="text-white">Select a menu item</div>;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex font-sans selection:bg-lime-500/30">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72 bg-[#0f0f0f] border-r border-neutral-800 p-4 shadow-2xl">
             <div className="flex justify-between items-center mb-8 px-2">
                <span className="text-xl font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-8 bg-lime-500 rounded-full"/> SkillNova Admin
                </span>
                <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
                  <X className="w-5 h-5" />
                </Button>
             </div>
             <div className="space-y-1">
                {sidebarItems.map((item) => (
                    <button
                    key={item.id}
                    onClick={() => { setSelectedPage(item.id); setSidebarOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                        selectedPage === item.id 
                        ? "bg-lime-500 text-black font-bold shadow-[0_0_15px_rgba(132,204,22,0.3)]" 
                        : "text-neutral-400 hover:bg-white/5 hover:text-white"
                    }`}
                    >
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                    </button>
                ))}
             </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex w-64 bg-[#0f0f0f] border-r border-neutral-800 flex-col fixed left-0 top-0 h-full z-40">
        <div className="p-6 border-b border-neutral-800 flex items-center gap-3">
          <div className="w-8 h-8 bg-lime-500 rounded-lg flex items-center justify-center shadow-[0_0_10px_rgba(132,204,22,0.4)]">
            <span className="text-black font-bold">SN</span>
          </div>
          <span className="text-lg font-bold tracking-tight">SkillNova <span className="text-lime-400">Admin</span></span>
        </div>

        <div className="flex-1 p-4 space-y-1 mt-4">
          <p className="text-xs font-bold text-neutral-600 uppercase px-3 mb-3">Main Menu</p>
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedPage(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${
                selectedPage === item.id
                  ? "bg-white/5 text-white border-l-2 border-lime-500 pl-[10px]"
                  : "text-neutral-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <item.icon className={`w-5 h-5 ${selectedPage === item.id ? "text-lime-400" : ""}`} />
              <span>{item.name}</span>
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-neutral-800">
          <div className="mb-4 px-3">
             <p className="text-xs text-neutral-500">Logged in as</p>
             <p className="text-sm text-white truncate font-mono">{currentUserEmail}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:ml-64 transition-all duration-300">
        {/* Header */}
        <div className="h-16 border-b border-neutral-800 flex items-center justify-between px-6 sticky top-0 bg-[#0a0a0a]/80 backdrop-blur-md z-30">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-5 h-5" />
            </Button>
            <h1 className="text-lg font-semibold capitalize tracking-tight flex items-center gap-2">
                {sidebarItems.find(i => i.id === selectedPage)?.icon && 
                    (() => {
                        const Icon = sidebarItems.find(i => i.id === selectedPage)!.icon;
                        return <Icon className="w-5 h-5 text-lime-400" />
                    })()
                }
                {sidebarItems.find(i => i.id === selectedPage)?.name}
            </h1>
          </div>
          <div className="flex items-center gap-4">
             <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-lime-900/20 border border-lime-500/20">
                <div className="w-2 h-2 rounded-full bg-lime-500 animate-pulse" />
                <span className="text-xs font-medium text-lime-400">System Secure</span>
             </div>
             <div className="w-8 h-8 bg-neutral-800 rounded-full flex items-center justify-center border border-white/10">
                <ShieldAlert className="w-4 h-4 text-neutral-400" />
             </div>
          </div>
        </div>

        {/* Dynamic Content */}
        <div className="p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}