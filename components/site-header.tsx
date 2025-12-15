"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { Menu, Briefcase, Tag, HelpCircle, Info, LogOut, User as UserIcon, Settings, CreditCard } from "lucide-react"
import { cn } from "@/lib/utils"
import { LoginDialog } from "@/components/login-dialog"
import { createClient } from "@/lib/supabase/client"

// ... (keep links array same as before)
const links = [
  { href: "/", label: "Home", icon: Briefcase },
  { href: "#pricing", label: "Pricing", icon: Tag },
  { href: "#faq", label: "FAQ", icon: HelpCircle },
  { href: "#about", label: "About", icon: Info },
]

export function SiteHeader() {
  const [activeLink, setActiveLink] = useState("/")
  const [scrolled, setScrolled] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // ... (Keep existing scroll and auth check logic)
    const checkAuth = async () => {
      const supabase = createClient()
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
      setLoading(false)
    }
    checkAuth()

    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setUser(null)
    router.push("/")
    router.refresh()
  }

  return (
    <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
      <header
        className={cn(
          "relative flex items-center justify-between transition-all duration-500 ease-out",
          "rounded-full border border-white/10 backdrop-blur-xl",
          scrolled
            ? "w-[90%] md:w-[700px] bg-black/80 py-2 px-4 shadow-2xl"
            : "w-[95%] md:w-[850px] bg-black/40 py-3 px-6 shadow-lg"
        )}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0 group">
          <div className="relative h-8 w-8 overflow-hidden rounded-lg bg-gradient-to-br from-lime-400 to-lime-600 flex items-center justify-center group-hover:scale-105 transition-transform">
             <span className="font-bold text-black text-lg">S</span>
          </div>
          <span className="font-bold text-lg tracking-tight hidden md:block">
            Skill<span className="text-lime-400">Nova</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center justify-center gap-1 absolute left-1/2 -translate-x-1/2">
          {links.map((l) => (
             <Link
                key={l.href}
                href={l.href}
                onClick={() => setActiveLink(l.href)}
                className={cn(
                  "relative px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300",
                  activeLink === l.href 
                    ? "text-lime-400 bg-white/10"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                )}
              >
                {l.label}
              </Link>
          ))}
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden md:flex items-center gap-2">
            {loading ? (
               <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse" />
            ) : user ? (
               //  IMPROVED: Dropdown Menu 
               <DropdownMenu>
                 <DropdownMenuTrigger asChild>
                   <Button variant="ghost" className="relative h-9 w-9 rounded-full border border-white/10 hover:border-lime-400/50 transition-colors p-0 overflow-hidden">
                     <Avatar className="h-full w-full">
                       <AvatarImage src={user.user_metadata?.avatar_url} />
                       <AvatarFallback className="bg-lime-900 text-lime-400 text-xs font-bold">
                         {user.email?.[0].toUpperCase()}
                       </AvatarFallback>
                     </Avatar>
                   </Button>
                 </DropdownMenuTrigger>
                 <DropdownMenuContent className="w-56 bg-[#0a0a0a] border-white/10 text-white" align="end">
                   <DropdownMenuLabel className="font-normal">
                     <div className="flex flex-col space-y-1">
                       <p className="text-sm font-medium leading-none">My Account</p>
                       <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                     </div>
                   </DropdownMenuLabel>
                   <DropdownMenuSeparator className="bg-white/10" />
                   
                   <DropdownMenuItem asChild className="focus:bg-white/10 focus:text-white cursor-pointer">
                     <Link href="/profile">
                       <UserIcon className="mr-2 h-4 w-4" />
                       <span>Profile</span>
                     </Link>
                   </DropdownMenuItem>
                   
                   <DropdownMenuItem asChild className="focus:bg-white/10 focus:text-white cursor-pointer">
                     <Link href="/dashboard">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                     </Link>
                   </DropdownMenuItem>

                   <DropdownMenuItem asChild className="focus:bg-white/10 focus:text-white cursor-pointer">
                     <Link href="#pricing">
                        <CreditCard className="mr-2 h-4 w-4" />
                        <span>Billing</span>
                     </Link>
                   </DropdownMenuItem>
                   
                   <DropdownMenuSeparator className="bg-white/10" />
                   
                   <DropdownMenuItem 
                     onClick={handleLogout}
                     className="text-red-400 focus:text-red-400 focus:bg-red-500/10 cursor-pointer"
                   >
                     <LogOut className="mr-2 h-4 w-4" />
                     <span>Log out</span>
                   </DropdownMenuItem>
                 </DropdownMenuContent>
               </DropdownMenu>
            ) : (
               <LoginDialog>
                  <Button className="rounded-full bg-lime-400 text-black hover:bg-lime-500 font-bold px-5 h-9 text-sm shadow-[0_0_15px_rgba(132,204,22,0.3)] transition-all hover:scale-105">
                    Sign In
                  </Button>
               </LoginDialog>
            )}
          </div>
          
          {/* Keep existing Mobile Menu code ... */}
          <div className="md:hidden">
            <Sheet>
               {/* ... (Existing sheet trigger and content) */}
                <SheetTrigger asChild>
                <Button size="icon" variant="ghost" className="text-white hover:bg-white/10 rounded-full h-10 w-10">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="top" className="bg-[#0a0a0a]/95 backdrop-blur-xl pt-16 border-b border-white/10 rounded-b-[2rem]">
                 {/* Mobile menu content same as before */}
                 <nav className="flex flex-col gap-2 max-w-sm mx-auto pb-8">
                   {links.map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      className="flex items-center gap-4 px-4 py-4 rounded-xl text-lg font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <l.icon className="h-5 w-5" />
                      {l.label}
                    </Link>
                   ))}
                   
                   <div className="h-px bg-white/10 my-4" />
                   
                   {user ? (
                      <>
                        <Link href="/profile">
                          <Button 
                            variant="ghost" 
                            className="w-full justify-start px-4 py-4 rounded-xl text-lg font-medium text-white hover:bg-white/5"
                          >
                             <UserIcon className="mr-4 h-5 w-5 text-lime-400" /> My Profile
                          </Button>
                        </Link>
                         <Button 
                          onClick={handleLogout} 
                          className="w-full mt-2 rounded-xl bg-white/5 text-gray-400 hover:text-white hover:bg-red-500/20 font-bold h-12 text-lg border border-white/5"
                        >
                          <LogOut className="mr-2 h-5 w-5" /> Log Out
                       </Button>
                      </>
                   ) : (
                     <LoginDialog>
                        <Button className="w-full rounded-xl bg-lime-400 text-black font-bold h-12 text-lg">
                          Sign In
                        </Button>
                     </LoginDialog>
                   )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </div>
  )
}