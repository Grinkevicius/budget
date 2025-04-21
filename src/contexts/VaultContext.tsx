import { createContext, useContext, useState } from 'react';

const VaultContext = createContext<{
    selectedVaultRef: string | null;
    setSelectedVaultRef: (ref: string) => void;
}>({
    selectedVaultRef: null,
    setSelectedVaultRef: () => {},
});

export const VaultProvider = ({ children }: { children: React.ReactNode }) => {
    const [selectedVaultRef, setSelectedVaultRef] = useState<string | null>(null);
    return (
        <VaultContext.Provider value={{ selectedVaultRef, setSelectedVaultRef }}>
            {children}
        </VaultContext.Provider>
    );
};

export const useVault = () => useContext(VaultContext);