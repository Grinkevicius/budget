"use client";

import React, { useEffect, useState } from "react";
import { getVault } from "@/app/actions/get/getVault";
import { useSession } from "next-auth/react";
import MobileBottomBar from "@/components/mobile/mobileBottomBar";
import Breadcrumbs from "@/components/breadcrumbs";
import type { BreadcrumbItem } from "@/components/breadcrumbs";
import { useVault } from "@/app/contexts/VaultContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
    Camera, 
    Plus, 
    Image,
    FileText, 
    ChevronRight,
    Grid,
    List
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import type { TooltipItem } from 'chart.js';
import CompTransaction from "@/components/transaction/transaction";
import { Transaction } from "@/store/transactionsSlice";
import {useTheme} from "next-themes";


interface Vault {
    image: string;
    referencecode: string;
    user_id?: number | null;
    name: string;
    description?: string | null;
    notes?: string | null;
    created_at?: string;
    total_amount: number;
    target: number;
    transactions: [];
}

export default function ManageVault() {
    const { selectedVaultRef } = useVault();
    const { data: session } = useSession();
    const [vault, setVault] = useState<null | Vault>();
    // const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const { theme } = useTheme();

    console.log(selectedVaultRef);

    ChartJS.register(ArcElement, Tooltip, Legend);

    const breadcrumbs: BreadcrumbItem[] = [
        { label: "Dashboard", href: "/dashboard", separator: true },
        { label: "Vaults", href: "/vaults", separator: true },
        { label: "Manage", href: `/vaults/manage`, separator: false },
    ];

    useEffect(() => {
        async function fetchVault() {
            if (session?.user) {
                const data: Vault = await getVault(session.user.id, selectedVaultRef);
                setVault(data);
            }
        }
        fetchVault();
    }, [session?.user, selectedVaultRef]);

    const VaultDoughnutChart = ({ vault }: { vault: Vault }) => {
        const remaining = Math.max(vault.target - vault.total_amount, 0);

        const data = {
            labels: ['Saved', 'Remaining'],
            datasets: [{
                data: [vault.total_amount, remaining],
                backgroundColor: [
                    '#3b82f6',
                    '#1f2937',
                ],
                borderColor: [
                    '#2563eb',
                    '#111827',
                ],
                borderWidth: 1,
                cutout: '75%'
            }]
        };

        const options = {
            plugins: {
                legend: {
                    display: false,
                },
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem: TooltipItem<"doughnut">) {
                            const value = tooltipItem.raw as number;
                            const percentage = ((value / vault.target) * 100).toFixed(1);
                            return `${tooltipItem.label}: ${value} (${percentage}%)`;
                        }
                    }
                }
            },
            responsive: true,
            maintainAspectRatio: true
        };

        return (
            <div className="absolute top-5 right-5 w-full max-w-[75px] mx-auto ">
                <Doughnut data={data} options={options} />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                        <div className="text-1xl font-bold text-white">
                            {((vault.total_amount / vault.target) * 100).toFixed(1)}%
                        </div>
                        {/*<div className="text-sm text-gray-300">Complete</div>*/}
                    </div>
                </div>
            </div>
        );
    };



    if (!session) return null;

    return (
            <div className="flex flex-col space-y-6 ">
                <Breadcrumbs items={breadcrumbs} />

                {vault ? (
                    <>
                    <div className="relative h-[115px] md:h-auto rounded-lg overflow-hidden">
                        <div
                            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                            style={{
                                backgroundImage: `url('${vault.image ? vault.image : 'https://www.thedaviscompanies.com/wp-content/uploads/2018/05/Union-Trust-Bank-Vault-Cropped.jpg'}')`
                            }}
                        />
                        <div className="absolute inset-0 bg-black/50"/>

                        <div className="relative p-6 space-y-6">
                            <div
                                className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div className="space-y-1">
                                    <h1 className="text-3xl font-bold text-white">{vault.name}</h1>
                                    <p className="text-gray-200">
                                        {vault.description || "No description provided"}
                                    </p>
                                </div>

                                <div className="mt-6">
                                    <VaultDoughnutChart vault={vault} />
                                </div>


                                {/*<div className="flex gap-2">*/}
                                {/*    <Button variant="outline" size="sm">*/}
                                {/*        <Share2 className="h-4 w-4 mr-2" />*/}
                                {/*        Share*/}
                                {/*    </Button>*/}
                                {/*    <Button variant="outline" size="sm">*/}
                                {/*        <Settings className="h-4 w-4 mr-2" />*/}
                                {/*        Settings*/}
                                {/*    </Button>*/}
                                {/*</div>*/}
                            </div>

                            {/* Add this after the description part in your current JSX */}
                            {/*<div className="w-full space-y-2">*/}
                            {/*    <div className="flex justify-between text-sm text-gray-200">*/}
                            {/*        <span>Progress</span>*/}
                            {/*        <span>{vault.total_amount} / {vault.target}</span>*/}
                            {/*    </div>*/}
                            {/*    <Progress*/}
                            {/*        value={(vault.total_amount / vault.target) * 100}*/}
                            {/*        className="w-full"*/}
                            {/*        indicatorColor={`${*/}
                            {/*            (vault.total_amount / vault.target) * 100 >= 100*/}
                            {/*                ? "bg-green-500"*/}
                            {/*                : (vault.total_amount / vault.target) * 100 >= 75*/}
                            {/*                ? "bg-yellow-500"*/}
                            {/*                : "bg-blue-500"*/}
                            {/*        }`}*/}
                            {/*    />*/}
                            {/*    <div className="text-sm text-gray-200">*/}
                            {/*        {((vault.total_amount / vault.target) * 100).toFixed(1)}% Complete*/}
                            {/*    </div>*/}
                            {/*</div>*/}

                            {/* Quick Actions */}
                            <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-4 ">
                                <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer dark:bg-[#18181b]">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                                <Camera className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                                            </div>
                                            <span>Take Photo</span>
                                        </div>
                                        <ChevronRight className="h-5 w-5 text-gray-400" />
                                    </div>
                                </Card>
                                <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer dark:bg-[#18181b]">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                                                <Image className="h-5 w-5 text-green-600 dark:text-green-300" />
                                            </div>
                                            <span>Upload Images</span>
                                        </div>
                                        <ChevronRight className="h-5 w-5 text-gray-400" />
                                    </div>
                                </Card>
                                <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer dark:bg-[#18181b]">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                                                <FileText className="h-5 w-5 text-purple-600 dark:text-purple-300" />
                                            </div>
                                            <span>Add Notes</span>
                                        </div>
                                        <ChevronRight className="h-5 w-5 text-gray-400" />
                                    </div>
                                </Card>
                            </div>


                        </div>
                    </div>


                        {/* Content Tabs */}
                        <Tabs defaultValue="items" className="w-full">
                            <div className="flex justify-between items-center">
                                <TabsList>
                                    <TabsTrigger value="items">Items</TabsTrigger>
                                    <TabsTrigger value="activity">Activity</TabsTrigger>
                                    <TabsTrigger value="notes">Notes</TabsTrigger>
                                </TabsList>
                                <div className="flex gap-2">
                                    {/*<Button*/}
                                    {/*    variant="ghost"*/}
                                    {/*    size="icon"*/}
                                    {/*    onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}*/}
                                    {/*>*/}
                                    {/*    {viewMode === 'grid' ? */}
                                    {/*        <List className="h-4 w-4" /> : */}
                                    {/*        <Grid className="h-4 w-4" />*/}
                                    {/*    }*/}
                                    {/*</Button>*/}
                                    {/*<Button>*/}
                                    {/*    <Plus className="h-4 w-4 mr-2" />*/}
                                    {/*    Add Item*/}
                                    {/*</Button>*/}
                                </div>
                            </div>

                            <TabsContent value="items" className="mt-6">
                                {/*<div className={`grid ${viewMode === 'grid' ? */}
                                {/*    'grid-cols-1 md:grid-cols-3 lg:grid-cols-4' : */}
                                {/*    'grid-cols-1'} gap-4`}>*/}
                                {/*    /!* Example Item Card *!/*/}
                                {/*    <Card className="overflow-hidden">*/}
                                {/*        <div className="aspect-square bg-gray-100 dark:bg-gray-800" />*/}
                                {/*        <div className="p-3 dark:bg-[#18181b]">*/}
                                {/*            <h3 className="font-medium">Item Name</h3>*/}
                                {/*            <p className="text-sm text-gray-500">Added recently</p>*/}
                                {/*        </div>*/}
                                {/*    </Card>*/}
                                {/*</div>*/}
                            </TabsContent>

                            <TabsContent value="activity">
                                <div className="space-y-4">
                                    {
                                        vault.transactions.map((t : Transaction) => (
                                            <>
                                                <CompTransaction key={t.referencecode} description={t.description} amount={t.amount}
                                                     transaction_date={t.transaction_date} is_recurring={false}
                                                     category_code={""} color={ theme === "dark" ? "#629584" : "rgb(220, 252, 231)"} />
                                            </>
                                        ))
                                    }
                                </div>
                            </TabsContent>

                            <TabsContent value="notes">
                                <Card className="p-4">
                                    <p>{vault.notes || "No notes added yet."}</p>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </>
                ) : (
                    <Card className="p-6">
                        <div className="flex items-center justify-center h-32">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100" />
                        </div>
                    </Card>
                )}

                <div className="h-[60px]" />
                <MobileBottomBar session={session} />
            </div>
    );
}