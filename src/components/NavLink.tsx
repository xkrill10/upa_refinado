import { NavLink as RouterNavLink, NavLinkProps } from "react-router-dom";
import { cn } from "@/lib/utils";

interface ExtendedNavLinkProps extends NavLinkProps {
  activeClassName?: string;
}

export function NavLink({
  className,
  activeClassName,
  ...props
}: ExtendedNavLinkProps) {
  return (
    <RouterNavLink
      {...props}
      className={(navProps) =>
        cn(
          typeof className === "function" ? className(navProps) : className,
          navProps.isActive && activeClassName,
        )
      }
    />
  );
}
