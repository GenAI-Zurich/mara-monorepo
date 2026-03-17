import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="flex items-center justify-center w-[38px] h-[38px] rounded-full bg-card border border-border cursor-pointer transition-all text-foreground hover:border-gold hover:shadow-[var(--shadow-gold)]"
      title="Theme wechseln"
    >
      {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
    </button>
  );
};

export default ThemeToggle;
