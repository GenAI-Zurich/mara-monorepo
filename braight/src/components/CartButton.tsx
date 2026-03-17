import { ShoppingCart } from "lucide-react";

interface CartButtonProps {
  count: number;
  onClick: () => void;
}

const CartButton = ({ count, onClick }: CartButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="relative flex items-center justify-center w-[38px] h-[38px] rounded-full bg-card border border-border cursor-pointer transition-all text-foreground hover:border-gold hover:shadow-[var(--shadow-gold)]"
      title="Warenkorb"
    >
      <ShoppingCart size={15} />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 w-[17px] h-[17px] rounded-full bg-gold text-primary-foreground text-[10px] flex items-center justify-center font-medium font-body">
          {count}
        </span>
      )}
    </button>
  );
};

export default CartButton;
