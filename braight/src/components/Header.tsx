import { useNavigate } from "react-router-dom";
import logo from "@/assets/logo_braight.png";
import { User, Plus, ClipboardList } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import WishlistFlag from "./WishlistFlag";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import type { WishlistWithItems } from "@/hooks/useWishlists";
import type { ProjectWithItems } from "@/hooks/useProjects";

interface HeaderProps {
  wishlists: WishlistWithItems[];
  projects: ProjectWithItems[];
  onOpenWishlist: (wishlist: WishlistWithItems) => void;
  onCreateWishlist: () => void;
  onOpenProject: (project: ProjectWithItems) => void;
  onCreateProject: () => void;
  getProjectColor: (index: number) => string;
}

const Header = ({
  wishlists, projects, onOpenWishlist, onCreateWishlist,
  onOpenProject, onCreateProject, getProjectColor,
}: HeaderProps) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 flex items-start justify-between px-5 pt-5 z-[400] pointer-events-none">
      <img src={logo} alt="brAight" className="h-[52px] object-contain object-left-top pointer-events-auto dark:invert dark:brightness-75" />
      <div className="flex gap-2.5 items-center pointer-events-auto">
        {user && (
          <>
            {/* Wishlists */}
            <div className="flex items-center gap-1.5">
              {wishlists.map(w => (
                <button key={w.id} onClick={() => onOpenWishlist(w)}
                  className="relative flex items-center justify-center w-[38px] h-[38px] rounded-full bg-card border border-border cursor-pointer transition-all hover:border-gold hover:shadow-[var(--shadow-gold)]"
                  title={w.name}>
                  <WishlistFlag color={w.color} size={18} count={w.article_ids.length} />
                </button>
              ))}
              <button onClick={onCreateWishlist}
                className="relative flex items-center justify-center w-[38px] h-[38px] rounded-full bg-card border border-border cursor-pointer transition-all hover:border-gold hover:shadow-[var(--shadow-gold)] text-muted-foreground hover:text-gold"
                title={t('new_wishlist')}>
                <Plus size={15} />
              </button>
            </div>

            {/* Divider */}
            <div className="w-px h-5 bg-border" />

            {/* Projects */}
            <div className="flex items-center gap-1.5">
              {projects.map((p, i) => {
                const color = getProjectColor(i);
                const count = p.items.reduce((s, it) => s + it.quantity, 0);
                return (
                  <button key={p.id} onClick={() => onOpenProject(p)}
                    className="relative flex items-center justify-center w-[38px] h-[38px] rounded-full bg-card border border-border cursor-pointer transition-all hover:border-gold hover:shadow-[var(--shadow-gold)]"
                    title={p.project_name}>
                    <ClipboardList size={15} style={{ color }} />
                    {count > 0 && (
                      <span className="absolute -top-1 -right-1 w-[17px] h-[17px] rounded-full bg-gold text-primary-foreground text-[10px] flex items-center justify-center font-medium font-body">
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
              <button onClick={onCreateProject}
                className="relative flex items-center justify-center w-[38px] h-[38px] rounded-full bg-card border border-border cursor-pointer transition-all hover:border-gold hover:shadow-[var(--shadow-gold)] text-muted-foreground hover:text-gold"
                title={t('new_order_list')}>
                <Plus size={15} />
              </button>
            </div>

            {/* Divider */}
            <div className="w-px h-5 bg-border" />
          </>
        )}

        <ThemeToggle />

        {user && (
          <button onClick={() => navigate("/profile")}
            className="relative flex items-center justify-center w-[38px] h-[38px] rounded-full bg-card border border-border cursor-pointer transition-all text-foreground hover:border-gold hover:shadow-[var(--shadow-gold)]"
            title={t('my_account')}>
            <User size={15} />
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
