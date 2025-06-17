'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Menu, Calendar, Search, Settings } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'

const Header = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [userEmail, setUserEmail] = useState<string | null>(null)

    const navItems = [
        { name: 'Home', href: '/', icon: Calendar },
        { name: 'Browse Sessions', href: '/members/sessions', icon: Search },
        { name: 'My Schedule', href: '/members/schedule', icon: Calendar },
        { name: 'Admin', href: '/admin', icon: Settings },
    ]

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setUserEmail(user?.email ?? null)
        }
        getUser()
        // Listen for auth state changes
        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUserEmail(session?.user?.email ?? null)
        })
        return () => {
            listener.subscription.unsubscribe()
        }
    }, [])

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        setUserEmail(null)
        window.location.href = '/'
    }

    return (
        <header className="border-b bg-white/75 backdrop-blur-sm sticky top-0 z-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <Calendar className="h-8 w-8 text-blue-600" />
                        <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            EventSchedule
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-1">
                        {navItems.map((item) => (
                            <Link key={item.name} href={item.href}>
                                <Button variant="ghost" className="flex items-center space-x-2">
                                    <item.icon className="h-4 w-4" />
                                    <span>{item.name}</span>
                                </Button>
                            </Link>
                        ))}
                    </nav>

                    {/* Desktop Auth Buttons */}
                    <div className="hidden md:flex items-center space-x-2">
                        {userEmail ? (
                            <>
                                <span className="text-gray-700 px-2">{userEmail}</span>
                                <Button variant="outline" onClick={handleSignOut}>Sign Out</Button>
                            </>
                        ) : (
                            <>
                                <Link href="/auth/signin">
                                    <Button variant="outline">Sign In</Button>
                                </Link>
                                <Link href="/auth/signup">
                                    <Button>Sign Up</Button>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild className="md:hidden">
                            <Button variant="ghost" size="icon">
                                <Menu className="h-6 w-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-80">
                            <div className="flex flex-col space-y-4 mt-8">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <Button variant="ghost" className="w-full justify-start">
                                            <item.icon className="h-4 w-4 mr-2" />
                                            {item.name}
                                        </Button>
                                    </Link>
                                ))}
                                <div className="pt-4 border-t">
                                    {userEmail ? (
                                        <>
                                            <span className="block text-gray-700 px-2 mb-2">{userEmail}</span>
                                            <Button variant="outline" className="w-full mb-2" onClick={handleSignOut}>
                                                Sign Out
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Link href="/auth/signin" onClick={() => setIsOpen(false)}>
                                                <Button variant="outline" className="w-full mb-2">
                                                    Sign In
                                                </Button>
                                            </Link>
                                            <Link href="/auth/signup" onClick={() => setIsOpen(false)}>
                                                <Button className="w-full">Sign Up</Button>
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    )
}

export default Header 