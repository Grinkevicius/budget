import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Transaction from '@/components/transaction/transaction'
import { Transaction as TransactionProps } from '@/store/transactionsSlice'

jest.mock('next-themes', () => ({
    useTheme: () => ({ theme: 'light' })
}))

jest.mock('@/contexts/VaultContext', () => ({
    useVault: () => ({ setSelectedVaultRef: jest.fn() })
}))

jest.mock('next/navigation', () => ({
    useRouter: () => ({ push: jest.fn() })
}))

describe('<Transaction />', () => {
    const baseProps: TransactionProps = {
        referencecode: '123',
        notes: [],
        amount: 100,
        description: 'Salary',
        transaction_date: '2024-03-20T00:00:00Z',
        is_recurring: false,
        category_code: 'CAT123',
        vault_code: '',
        vault_description: '',
    }

    it('renders the formatted amount', () => {
        render(<Transaction color={''} {...baseProps} />)
        expect(screen.getByText('$100')).toBeInTheDocument()
    })

    it('renders the description', () => {
        render(<Transaction color={''} {...baseProps} />)
        expect(screen.getByText('Salary')).toBeInTheDocument()
    })

    it('renders the formatted date', () => {
        render(<Transaction color={''} {...baseProps} />)
        // Use a more flexible approach to handle timezone differences
        const dateElement = screen.getByText(/3\/\d{1,2}\/2024/)
        expect(dateElement).toBeInTheDocument()
    })


    it('shows recurring icon when transaction is recurring', () => {
        render(<Transaction color={''} {...baseProps} is_recurring={true}/>)
        expect(screen.getByTestId('recurring-icon')).toBeInTheDocument()
    })

    it('renders vault section when vault code is provided', () => {
        const propsWithVault = {
            ...baseProps,
            vault_code: 'VAULT123',
            vault_description: 'My Vault'
        }
        render(<Transaction color={''} {...propsWithVault} />)
        expect(screen.getByText('My Vault')).toBeInTheDocument()
    })

    it('applies correct color for NEEDS category', () => {
        render(<Transaction color={''} {...baseProps} category_code="CAT2025022222030415"/>)
        const badge = screen.getByText('$100')
        expect(badge).toHaveStyle({backgroundColor: 'rgb(219, 234, 254)'})
    })

    it('calls manageVault when vault section is clicked', () => {
        const router = {push: jest.fn()}
        const setSelectedVaultRef = jest.fn()
        jest.spyOn(require('next/navigation'), 'useRouter').mockReturnValue(router)
        jest.spyOn(require('@/contexts/VaultContext'), 'useVault').mockReturnValue({setSelectedVaultRef})

        const propsWithVault = {
            ...baseProps,
            vault_code: 'VAULT123',
            vault_description: 'My Vault'
        }
        render(<Transaction color={''} {...propsWithVault} />)
        screen.getByText('My Vault').click()

        expect(setSelectedVaultRef).toHaveBeenCalledWith('VAULT123')
        expect(router.push).toHaveBeenCalledWith('/vaults/manage')
    })
})
