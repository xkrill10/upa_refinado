import { Moon, Sun, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/components/ThemeProvider";
import { motion, AnimatePresence } from "motion/react";

interface ThemeToggleProps {
  position?: "top" | "bottom";
}

export function ThemeToggle({ position = "bottom" }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();

  // Invert transition effect directions based on position!
  const isTop = position === "top";
  const initialY = isTop ? -15 : 15;
  const exitY = isTop ? 15 : -15;
  const initialRotate = isTop ? -45 : 45;
  const exitRotate = isTop ? 45 : -45;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative h-12 w-12 rounded-xl bg-transparent hover:bg-primary/10 dark:hover:bg-white/10 border-2 border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-600 transition-all duration-300 overflow-hidden flex items-center justify-center shrink-0"
        >
          <AnimatePresence mode="wait" initial={false}>
            {theme === "dark" ? (
              <motion.div
                key="moon"
                initial={{ y: initialY, opacity: 0, rotate: initialRotate }}
                animate={{ y: 0, opacity: 1, rotate: 0 }}
                exit={{ y: exitY, opacity: 0, rotate: exitRotate }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="flex items-center justify-center text-white"
              >
                <Moon className="h-5 w-5 text-sky-400 dark:text-sky-400 stroke-[2.2px]" />
              </motion.div>
            ) : theme === "light" ? (
              <motion.div
                key="sun"
                initial={{ y: initialY, opacity: 0, rotate: initialRotate }}
                animate={{ y: 0, opacity: 1, rotate: 0 }}
                exit={{ y: exitY, opacity: 0, rotate: exitRotate }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="flex items-center justify-center"
              >
                <Sun className="h-5 w-5 text-amber-500 stroke-[2.2px]" />
              </motion.div>
            ) : (
              <motion.div
                key="system"
                initial={{ y: initialY, opacity: 0, rotate: initialRotate }}
                animate={{ y: 0, opacity: 1, rotate: 0 }}
                exit={{ y: exitY, opacity: 0, rotate: exitRotate }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="flex items-center justify-center text-white"
              >
                <Monitor className="h-5 w-5 text-indigo-400 dark:text-indigo-400 stroke-[2.2px]" />
              </motion.div>
            )}
          </AnimatePresence>
          <span className="sr-only">Alternar tema</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        side={isTop ? "bottom" : "top"}
        className="glass-card min-w-[130px] p-1 border border-border shadow-md"
      >
        <DropdownMenuItem 
          onClick={() => setTheme("light")}
          className="flex items-center gap-2.5 px-3 py-2 cursor-pointer transition-colors rounded-lg font-semibold text-xs text-foreground/90 hover:text-foreground hover:bg-secondary"
        >
          <Sun className="h-[18px] w-[18px] text-amber-500 stroke-[2px]" />
          <span>Claro</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("dark")}
          className="flex items-center gap-2.5 px-3 py-2 cursor-pointer transition-colors rounded-lg font-semibold text-xs text-foreground/90 hover:text-foreground hover:bg-secondary"
        >
          <Moon className="h-[18px] w-[18px] text-sky-400 stroke-[2px]" />
          <span>Escuro</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("system")}
          className="flex items-center gap-2.5 px-3 py-2 cursor-pointer transition-colors rounded-lg font-semibold text-xs text-foreground/90 hover:text-foreground hover:bg-secondary"
        >
          <Monitor className="h-[18px] w-[18px] text-indigo-400 stroke-[2px]" />
          <span>Sistema</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
