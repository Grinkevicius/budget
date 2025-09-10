interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

const Spinner = ({ size = 'md', className = '' }: SpinnerProps) => {
    const sizeClasses = {
        sm: 'w-4 h-4 border-2',
        md: 'w-8 h-8 border-4',
        lg: 'w-12 h-12 border-8'
    };

    return (
        <div className={`flex items-center justify-center min-h-[100px] ${className}`}>
            <div className={`${sizeClasses[size]} border-gray-300 border-t-blue-600 rounded-full animate-spin dark:border-gray-600 dark:border-t-blue-400`} />
        </div>
    );
};

export default Spinner;