import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, placeholder, ...props }, ref) => {
    // Garante que o pseudo-seletor :placeholder-shown funcione sempre
    const activePlaceholder = placeholder || " ";

    // Detecta se o campo tem valor (tanto controlado como default)
    const hasValue = !!(props.value || props.defaultValue);

    // Tipos de input que não disparam :placeholder-shown no navegador mesmo vazios
    const isSpecialEmptyInput = ["date", "time", "datetime-local", "month", "week"].includes(type || "") && !hasValue;

    return (
      <input
        type={type}
        placeholder={activePlaceholder}
        className={cn(
          "flex h-10 w-full rounded-md border border-input px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm transition-all duration-200",
          "bg-white dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-950 focus-visible:bg-white dark:focus-visible:bg-slate-950",
          isSpecialEmptyInput
            ? "bg-slate-50/50 dark:bg-slate-900/50"
            : "placeholder-shown:bg-slate-50/50 dark:placeholder-shown:bg-slate-900/50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
