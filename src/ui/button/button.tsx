import { type Component, type JSX, splitProps } from "solid-js";
import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

// Definição dos Estilos
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-blue-600 text-white shadow-lg shadow-blue-900/20 hover:bg-blue-500 border border-transparent",
        outline:
          "border border-neutral-700 bg-transparent hover:bg-neutral-800 text-neutral-300 hover:text-white",
        ghost: "hover:bg-neutral-800 text-neutral-400 hover:text-white",
        destructive:
          "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 hover:border-red-500/30",
        link: "text-blue-400 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-lg px-8",
        icon: "h-9 w-9",
        "icon-sm": "h-8 w-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

interface ButtonProps
  extends JSX.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button: Component<ButtonProps> = (props) => {
  const [local, rest] = splitProps(props, ["class", "variant", "size", "children"]);

  return (
    <button
      type={props.type || "button"}
      class={twMerge(buttonVariants({ variant: local.variant, size: local.size }), local.class)}
      {...rest}
    >
      {local.children}
    </button>
  );
};
