import '@testing-library/jest-dom'

// polyfills...
import { TextEncoder, TextDecoder } from 'util'
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

// stub out the App Router hooks
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        pathname: '/',
        route: '/',
        asPath: '/',
        push: jest.fn(),
        replace: jest.fn(),
        back: jest.fn(),
        forward: jest.fn(),
        prefetch: jest.fn().mockResolvedValue(undefined),
        refresh: jest.fn(),
    }),
    usePathname: () => '/',
    useSearchParams: () => new URLSearchParams(),
}))