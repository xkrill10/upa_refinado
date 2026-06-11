import {
  CircleCheck,
  Info,
  LoaderCircle,
  OctagonX,
  TriangleAlert,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <CircleCheck className="h-4 w-4" />,
        info: <Info className="h-4 w-4" />,
        warning: <TriangleAlert className="h-4 w-4" />,
        error: <OctagonX className="h-4 w-4" />,
        loading: <LoaderCircle className="h-4 w-4 animate-spin" />,
      }}
      toastOptions={{
        classNames: {
          toast:
            "group toast glass-card-premium rounded-2xl group-[.toaster]:text-foreground group-[.toaster]:border-white/40 dark:group-[.toaster]:border-white/10 group-[.toaster]:shadow-[0_8px_30px_rgb(0,0,0,0.12)]",
          error:
            "group-[.toaster]:bg-red-500/10 dark:group-[.toaster]:bg-red-500/15 group-[.toaster]:text-red-600 dark:group-[.toaster]:text-red-400 group-[.toaster]:border-red-500/30",
          success:
            "group-[.toaster]:bg-emerald-500/10 dark:group-[.toaster]:bg-emerald-500/15 group-[.toaster]:text-emerald-600 dark:group-[.toaster]:text-emerald-400 group-[.toaster]:border-emerald-500/30",
          warning:
            "group-[.toaster]:bg-amber-500/10 dark:group-[.toaster]:bg-amber-500/15 group-[.toaster]:text-amber-600 dark:group-[.toaster]:text-amber-400 group-[.toaster]:border-amber-500/30",
          info: "group-[.toaster]:bg-blue-500/10 dark:group-[.toaster]:bg-blue-500/15 group-[.toaster]:text-blue-600 dark:group-[.toaster]:text-blue-400 group-[.toaster]:border-blue-500/30",
          description: "group-[.toast]:opacity-80",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
