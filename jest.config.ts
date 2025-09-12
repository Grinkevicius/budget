import type { Config } from 'jest'
import nextJest from 'next/jest'

const createJestConfig = nextJest({ dir: './' })

const config: Config = {
    coverageProvider: 'v8',
    testEnvironment: 'jsdom',
    preset: 'ts-jest',
    transform: {
        '^.+\\.tsx?$': ['ts-jest', { tsconfig: './tsconfig.json' }],
    },
    setupFiles: ['<rootDir>/jest.env.cjs'],
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    transformIgnorePatterns: [
        'node_modules/(?!(lucide-react)/)'
    ],
    moduleNameMapper: {
        '^lucide-react$': '<rootDir>/node_modules/lucide-react/dist/cjs/lucide-react.js',
        '^@/(.*)$': '<rootDir>/src/$1',
    },
}

export default createJestConfig(config)
