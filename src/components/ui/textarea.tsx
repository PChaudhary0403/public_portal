"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextareaProps
    extends React.TextareaHTMLAttributes<HTMLTextAreaElement> { }

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, ...props }, ref) => {
        return (
            <textarea
                className={cn(
                    "flex min-h-[120px] w-full rounded-xl border-2 border-slate-200 bg-white/50 backdrop-blur-sm px-4 py-3 text-sm ring-offset-white placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:border-indigo-300 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 resize-none dark:border-slate-700 dark:bg-slate-900/50 dark:ring-offset-slate-950 dark:placeholder:text-slate-500 dark:focus-visible:ring-indigo-400",
                    className
                )}
                ref={ref}
                {...props}
            />
        )
    }
)
Textarea.displayName = "Textarea"

export { Textarea }
