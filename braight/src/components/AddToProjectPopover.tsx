import { useState } from "react";
import { Minus, Plus, ClipboardList } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { ProjectWithItems } from "@/hooks/useProjects";
import { useLanguage } from "@/contexts/LanguageContext";

interface AddToProjectPopoverProps {
  projects: ProjectWithItems[];
  getProjectColor: (index: number) => string;
  onAddToProject: (projectId: number, qty: number) => void;
  onCreateProject: () => void;
  children: React.ReactNode;
}

const AddToProjectPopover = ({
  projects, getProjectColor, onAddToProject, onCreateProject, children,
}: AddToProjectPopoverProps) => {
  const [qty, setQty] = useState(1);
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent
        className="w-56 p-3 bg-card border border-border rounded-xl shadow-xl z-[600]"
        onClick={e => e.stopPropagation()}
        side="top"
        sideOffset={8}
      >
        <div className="text-[9px] tracking-[0.14em] uppercase text-muted-foreground mb-2 font-medium">
          {t('add_to_project_title')}
        </div>

        {/* Quantity */}
        <div className="flex items-center gap-1.5 mb-3">
          <button onClick={() => setQty(Math.max(1, qty - 1))}
            className="w-7 h-7 rounded-full bg-secondary border border-border flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
            <Minus size={11} />
          </button>
          <input
            type="number" min={1} value={qty}
            onChange={e => setQty(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-12 h-7 text-center text-[12px] text-foreground bg-secondary border border-border rounded-md outline-none focus:border-gold font-sans [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
          <button onClick={() => setQty(qty + 1)}
            className="w-7 h-7 rounded-full bg-secondary border border-border flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
            <Plus size={11} />
          </button>
        </div>

        {/* Project list */}
        <div className="flex flex-col gap-1">
          {projects.map((p, i) => (
            <button
              key={p.id}
              onClick={() => { onAddToProject(p.id, qty); setOpen(false); setQty(1); }}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-border hover:border-gold text-left cursor-pointer transition-all hover:bg-secondary/50"
            >
              <ClipboardList size={13} style={{ color: getProjectColor(i) }} />
              <span className="text-[11px] text-foreground truncate flex-1">{p.project_name}</span>
              <span className="text-[9px] text-muted-foreground">{p.items.length}</span>
            </button>
          ))}
          <button
            onClick={() => { onCreateProject(); setOpen(false); }}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-dashed border-border hover:border-gold text-left cursor-pointer transition-all text-muted-foreground hover:text-gold"
          >
            <Plus size={13} />
            <span className="text-[11px]">{t('new_order_list')}</span>
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AddToProjectPopover;
