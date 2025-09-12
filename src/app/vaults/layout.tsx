"use client";

export default function VaultsLayout({ children }: { children: React.ReactNode }) {
    return (
            <div className="mx-auto max-w-7xl px-4 w-full flex flex-col">
                {children}
            </div>
    );
}