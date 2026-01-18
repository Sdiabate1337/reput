import { cn } from "@/lib/utils"

interface LogoProps {
    className?: string
    iconOnly?: boolean
    theme?: 'light' | 'dark'
    iconSize?: string
}

export function Logo({ className, iconOnly = false, theme = 'light', iconSize = "w-8 h-8" }: LogoProps) {
    const textColor = theme === 'dark' ? "text-white" : "text-zinc-900"

    return (
        <div className={cn("flex items-center gap-2.5 select-none", className)}>
            {/* Brand Icon: Solid Geometric Bubble + Star */}
            <div className="relative flex items-center justify-center">
                <svg
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={cn("text-[#E85C33]", iconSize)}
                >
                    {/* Flat Solid Bubble */}
                    <path
                        d="M16 2.5C8.8 2.5 3 7.8 3 14.2C3 17.8 4.7 21 7.5 23V28.5L13.2 25.2C14.1 25.5 15 25.6 16 25.6C23.2 25.6 29 20.2 29 13.8C29 7.4 23.2 2.5 16 2.5Z"
                        className="fill-current"
                    />

                    {/* Centered White Star */}
                    <path
                        d="M16 7.5L18.2 11.8L23 12.5L19.5 15.8L20.3 20.5L16 18.2L11.7 20.5L12.5 15.8L9 12.5L13.8 11.8L16 7.5Z"
                        fill="white"
                    />
                </svg>
            </div>

            {!iconOnly && (
                <div className={cn("flex flex-col justify-center leading-none", textColor)}>
                    <div className="flex items-baseline tracking-tight">
                        <span className="font-bold text-xl font-display">Review</span>
                        <span className="font-extrabold text-xl font-display ml-[1px]">Me</span>
                    </div>
                </div>
            )}
        </div>
    )
}
