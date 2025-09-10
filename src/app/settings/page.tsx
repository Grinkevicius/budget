'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sun, Moon, Palette, Database, Settings, ChevronRight, Mail, Shield, Bell, CreditCard } from "lucide-react";
import Income from '@/components/income';
import Allocations from '@/components/setAllocations';

import MobileBottomBar from "@/components/mobile/mobileBottomBar";



export default function SettingsPage() {
    const { data: session } = useSession();
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!session) return null;

    const handleThemeChange = (newTheme: string) => {
        setTheme(newTheme);
    };

    return (
        <>
            {/* Modern Header */}
            <div className="mx-auto max-w-7xl px-4 py-6 border-sidebar-border">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                                <Settings className="h-5 w-5 text-white" />
                            </div>
                            <h1 className="text-2xl font-semibold text-sidebar-foreground">
                                Settings
                            </h1>
                        </div>
                        <p className="text-sidebar-muted-foreground text-sm">
                            Manage your account, preferences, and budget configuration
                        </p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="mx-auto max-w-7xl px-4 py-6">
                {/* Settings Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Mobile Profile Summary - Only visible on mobile */}
                    <div className="lg:hidden">
                        <Card className="bg-sidebar border-sidebar-border">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-12 w-12 ring-2 ring-border">
                                        <AvatarImage src={`https://www.gravatar.com/avatar/?d=mp`} />
                                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                                            {session.user.name?.charAt(0) || 'U'}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <h3 className="font-semibold">{session.user.name}</h3>
                                        <p className="text-sm text-muted-foreground">{session.user.email}</p>
                                    </div>
                                    <Badge variant="secondary" className="text-xs">
                                        Free
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Left Column - Profile & Appearance - Hidden on mobile */}
                    <div className="hidden lg:block lg:col-span-1 space-y-6">

                        {/* Profile Card */}
                        <Card className="bg-sidebar border-sidebar-border">
                            <CardHeader className="">
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-16 w-16 ring-2 ring-border">
                                        <AvatarImage src={`https://www.gravatar.com/avatar/?d=mp`} />
                                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-lg">
                                            {session.user.name?.charAt(0) || 'U'}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <CardTitle className="text-xl">{session.user.name}</CardTitle>
                                        <CardDescription className="flex items-center gap-1 mt-1">
                                            <Mail className="h-3 w-3" />
                                            {session.user.email}
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            {/* <CardContent className="pt-0">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="flex items-center gap-2 p-3 bg-sidebar-accent/30 rounded-lg">
                                        <Shield className="h-4 w-4 text-green-500" />
                                        <span>Verified</span>
                                    </div>
                                    <div className="flex items-center gap-2 p-3 bg-sidebar-accent/30 rounded-lg">
                                        <CreditCard className="h-4 w-4 text-blue-500" />
                                        <span>Free Plan</span>
                                    </div>
                                </div>
                            </CardContent> */}
                        </Card>

                        {/* Appearance Card */}
                        <Card className="bg-sidebar border-sidebar-border">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Palette className="h-5 w-5 text-purple-500" />
                                    Appearance
                                </CardTitle>
                                <CardDescription>
                                    Customize your visual experience
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {mounted && (
                                    <div className="grid grid-cols-2 gap-3">
                                        <Button
                                            variant={theme === "light" ? "default" : "outline"}
                                            onClick={() => handleThemeChange("light")}
                                            className="flex flex-col items-center gap-2 h-16"
                                        >
                                            <Sun className="h-4 w-4" />
                                            <span className="text-xs">Light</span>
                                        </Button>

                                        <Button
                                            variant={theme === "dark" ? "default" : "outline"}
                                            onClick={() => handleThemeChange("dark")}
                                            className="flex flex-col items-center gap-2 h-16"
                                        >
                                            <Moon className="h-4 w-4" />
                                            <span className="text-xs">Dark</span>
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <Card className="bg-sidebar border-sidebar-border">
                            <CardHeader>
                                <CardTitle className="text-lg">Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Button variant="ghost" className="w-full justify-between h-12 hover:bg-sidebar-accent/50">
                                    <div className="flex items-center gap-3">
                                        <Bell className="h-4 w-4 text-blue-500" />
                                        <span>Notifications</span>
                                    </div>
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" className="w-full justify-between h-12 hover:bg-sidebar-accent/50">
                                    <div className="flex items-center gap-3">
                                        <Shield className="h-4 w-4 text-green-500" />
                                        <span>Privacy & Security</span>
                                    </div>
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Content - Full width on mobile, 2/3 on desktop */}
                    <div className="lg:col-span-2 space-y-6 lg:space-y-0">

                        {/* Mobile Theme Selector */}
                        <div className="lg:hidden">
                            <Card className="bg-sidebar border-sidebar-border">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Palette className="h-5 w-5 text-purple-500" />
                                        Appearance
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {mounted && (
                                        <div className="grid grid-cols-2 gap-3">
                                            <Button
                                                variant={theme === "light" ? "default" : "outline"}
                                                onClick={() => handleThemeChange("light")}
                                                className="flex flex-col items-center gap-2 h-16"
                                            >
                                                <Sun className="h-4 w-4" />
                                                <span className="text-xs">Light</span>
                                            </Button>

                                            <Button
                                                variant={theme === "dark" ? "default" : "outline"}
                                                onClick={() => handleThemeChange("dark")}
                                                className="flex flex-col items-center gap-2 h-16"
                                            >
                                                <Moon className="h-4 w-4" />
                                                <span className="text-xs">Dark</span>
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                        <Card className="bg-sidebar border-sidebar-border">
                            <CardHeader className="px-6 py-4">
                                <CardTitle className="flex items-center gap-2">
                                    <Database className="h-5 w-5 text-emerald-500" />
                                    Budget Configuration
                                </CardTitle>
                                <CardDescription>
                                    Set up your default income and spending allocations for new budgets
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="px-6 pb-6 pt-0 space-y-6">
                                <div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></div>
                                        <h3 className="font-semibold text-sidebar-foreground">Monthly Income</h3>
                                    </div>
                                    <Income userId={session.user.id} />
                                </div>

                                <Separator />

                                <div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full"></div>
                                        <h3 className="font-semibold text-sidebar-foreground">Spending Allocations</h3>
                                    </div>
                                    <Allocations userId={session.user.id} />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <div className="h-[60px]" />
                <MobileBottomBar session={session} />
            </div>
        </>
    );
}
