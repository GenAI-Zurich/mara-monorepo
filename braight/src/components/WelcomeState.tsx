import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

interface WelcomeStateProps {
  visible: boolean;
}

const WelcomeState = ({ visible }: WelcomeStateProps) => {
  const { t } = useLanguage();

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center flex-col gap-3 z-[5] pointer-events-none"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-display text-foreground text-center leading-[1.1]" style={{ fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 300 }}>
            Find your<br /><span className="text-gold italic">perfect light</span>
          </h1>
          <p className="text-[13px] tracking-[0.12em] uppercase text-muted-foreground">
            {t('welcome_subtitle')}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeState;
