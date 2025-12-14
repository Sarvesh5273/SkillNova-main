"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation" 
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Briefcase, Tag, HelpCircle, Info, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { LoginDialog } from "@/components/login-dialog" 
import { createClient } from "@/lib/supabase/client"

// 1. REMOVED "Dashboard" from center links
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
    const checkAuth = async () => {
      const supabase = createClient()
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
      setLoading(false)
    }
    checkAuth()

    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
      const scrollPosition = window.scrollY + 150
      let currentSection = "/" 

      for (const link of links) {
        if (link.href.startsWith("#")) {
          const section = document.querySelector(link.href) as HTMLElement | null
          if (section && section.offsetTop <= scrollPosition) {
            currentSection = link.href
          }
        }
      }
      if (window.scrollY < 100 && window.location.pathname === "/") {
         currentSection = "/"
      }
      setActiveLink(currentSection)
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

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setActiveLink(href)
    if (href.startsWith("#")) {
      e.preventDefault()
      const section = document.querySelector(href) as HTMLElement | null
      if (section) {
        window.scrollTo({ top: section.offsetTop - 100, behavior: "smooth" })
      }
    } else if (href === "/") {
       if (window.location.pathname !== "/") return
       e.preventDefault()
       window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  return (
    <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
      <header
        className={cn(
          "relative flex items-center justify-between transition-all duration-500 ease-out",
          "rounded-full border border-white/10 backdrop-blur-xl",
          scrolled
            ? "w-[90%] md:w-[700px] bg-black/80 py-3 px-4 shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
            : "w-[95%] md:w-[850px] bg-black/40 py-4 px-6 shadow-lg"
        )}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="relative h-8 w-8 overflow-hidden rounded-lg bg-gradient-to-br from-lime-400 to-lime-600 flex items-center justify-center">
             <span className="font-bold text-black text-lg">S</span>
          </div>
          <span className="font-bold text-lg tracking-tight hidden md:block">
            Skill<span className="text-lime-400">Nova</span>
          </span>
        </Link>

        {/* Desktop Nav (Center) */}
        <nav className="hidden md:flex items-center justify-center gap-1 absolute left-1/2 -translate-x-1/2">
          {links.map((l) => (
             <Link
                key={l.href}
                href={l.href}
                onClick={(e) => handleNavClick(e, l.href)}
                className={cn(
                  "relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                  activeLink === l.href 
                    ? "text-lime-400 bg-white/10 shadow-[0_0_10px_rgba(163,230,53,0.2)]"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                )}
              >
                {l.label}
              </Link>
          ))}
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden md:flex items-center gap-3">
            {loading ? (
               <div className="w-24 h-10 rounded-full bg-white/5 animate-pulse" />
            ) : user ? (
               // 2. LOGGED IN VIEW: ONLY Log Out (Red Button)
               <Button 
                  onClick={handleLogout}
                  className="rounded-full bg-red-600 hover:bg-red-700 text-white font-bold px-6 shadow-[0_0_15px_rgba(220,38,38,0.4)] transition-all hover:scale-105"
               >
                  <LogOut className="mr-2 h-4 w-4" /> Log Out
               </Button>
            ) : (
               // PUBLIC VIEW: Get Started (Green Button)
               <LoginDialog>
                  <Button className="rounded-full bg-lime-400 text-black hover:bg-lime-500 font-bold px-6 shadow-[0_0_20px_rgba(132,204,22,0.3)] transition-all hover:scale-105">
                    Get Started
                  </Button>
               </LoginDialog>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button size="icon" variant="ghost" className="text-white hover:bg-white/10 rounded-full h-10 w-10">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="top" className="bg-[#0a0a0a]/95 backdrop-blur-xl pt-16 border-b border-white/10 rounded-b-[2rem]">
                <nav className="flex flex-col gap-2 max-w-sm mx-auto pb-8">
                   {links.map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      className="flex items-center gap-4 px-4 py-4 rounded-xl text-lg font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                      onClick={(e) => handleNavClick(e, l.href)}
                    >
                      <l.icon className="h-5 w-5" />
                      {l.label}
                    </Link>
                   ))}
                   
                   <div className="h-px bg-white/10 my-4" />
                   
                   {/* Mobile Auth Buttons */}
                   {user ? (
                      <Button 
                        onClick={handleLogout} 
                        className="w-full rounded-xl bg-red-600 text-white hover:bg-red-700 font-bold h-12 text-lg shadow-lg"
                      >
                        <LogOut className="mr-2 h-5 w-5" /> Log Out
                     </Button>
                   ) : (
                     <LoginDialog>
                        <Button className="w-full rounded-xl bg-lime-400 text-black font-bold h-12 text-lg">
                          Get Started Now
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