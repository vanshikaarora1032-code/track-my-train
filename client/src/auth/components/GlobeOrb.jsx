import { motion } from 'framer-motion';

const GlobeOrb = () => {
  return (
    <div className="flex justify-center mb-6">
      <motion.div
        animate={{
          y: [-6, 6, -6],
          scale: [1, 1.05, 1],
        }}
        transition={{
          y: {
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          },
          scale: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
        className="w-[90px] h-[90px] rounded-full relative"
        style={{
          background: "radial-gradient(circle, #4ade80 0%, #0a1208 100%)",
          boxShadow: "0 0 40px #4ade8066",
        }}
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/20 to-transparent pointer-events-none"></div>
      </motion.div>
    </div>
  );
};

export default GlobeOrb;
