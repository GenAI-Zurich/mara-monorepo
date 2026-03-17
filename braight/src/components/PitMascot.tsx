import pit from "@/assets/pit.png";

interface PitMascotProps {
  mode: 'idle' | 'thinking' | 'excited';
}

const PitMascot = ({ mode }: PitMascotProps) => {
  const animClass =
    mode === 'thinking' ? 'animate-[pitThink_0.9s_ease-in-out_infinite]' :
    mode === 'excited' ? 'animate-[pitExcited_0.35s_ease-in-out_infinite]' :
    'animate-[pitFloat_3.5s_ease-in-out_infinite]';

  return (
    <div className="fixed bottom-[330px] right-[22px] z-[200] w-[128px] pointer-events-none max-[820px]:w-[90px] max-[820px]:bottom-[370px] max-[820px]:right-3">
      <img
        src={pit}
        alt="Pit"
        className={`w-full mix-blend-screen drop-shadow-[0_8px_20px_rgba(200,147,42,0.18)] brightness-105 origin-bottom ${animClass}`}
      />
    </div>
  );
};

export default PitMascot;
