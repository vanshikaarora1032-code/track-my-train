import { motion } from 'framer-motion';

const Preloader = () => {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-bg-primary overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-accent/20 rounded-full blur-[80px]"></div>
      
      {/* Central Animation */}
      <div className="relative flex flex-col items-center">
        {/* Animated Rings */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="w-24 h-24 rounded-full border-2 border-accent border-t-transparent border-b-transparent shadow-[0_0_15px_rgba(200,241,53,0.3)]"
        />
        
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
        >
          <div className="h-4 w-4 bg-accent rounded-full shadow-[0_0_20px_rgba(200,241,53,1)]"></div>
        </motion.div>

        {/* Text Animation */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-8 text-center"
        >
          <h2 className="text-xl font-bold text-white tracking-widest uppercase">
            Track the Train
          </h2>
          <div className="flex justify-center gap-1 mt-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                className="w-1.5 h-1.5 rounded-full bg-accent"
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Footer Branding */}
      <div className="absolute bottom-10 left-0 right-0 text-center">
        <p className="text-[10px] text-text-muted uppercase tracking-[0.3em] font-medium opacity-50">
          Advanced Railway Tracking System
        </p>
      </div>
    </div>
  );
};

export default Preloader;
