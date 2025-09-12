interface SpinnerProps {
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
    text?: string;
    fullScreen?: boolean;
}

const Spinner = ({ 
    size = 'md', 
    className = '', 
    text,
    fullScreen = false 
}: SpinnerProps) => {
    const sizeClasses = {
        xs: 'h-4 w-4',
        sm: 'h-5 w-5',
        md: 'h-6 w-6',
        lg: 'h-8 w-8',
        xl: 'h-12 w-12'
    };

    const containerClasses = fullScreen 
        ? 'fixed inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center'
        : `flex items-center justify-center ${className}`;

    const minHeightClass = fullScreen ? '' : 'min-h-[100px]';

    return (
        <div className={`${containerClasses} ${minHeightClass}`}>
            <div className="text-center">
                {/* Simple spinner matching the session loading style */}
                <div className={`animate-spin rounded-full ${sizeClasses[size]} border-b-2 border-gray-900 dark:border-gray-100 mx-auto`}></div>
                
                {/* Optional loading text */}
                {text && (
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        {text}
                    </p>
                )}
            </div>
        </div>
    );
};

export default Spinner;