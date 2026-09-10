"use client"
import Image from "next/image";
import Link from 'next/link';
import { motion } from 'framer-motion';

const fadeInUp = {
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function HeroSection({ colors }: { colors: any }) {
  return (
    <motion.section
      initial="initial"
      animate="animate"
      variants={fadeInUp}
      className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32"
    >
      <div className="flex flex-col lg:flex-row items-center gap-16">
        <div className="flex-1 space-y-8">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight"
            style={{ color: colors.primary }}>
            Gestão Completa para sua Clínica Médica
          </h1>
          <p className="text-xl lg:text-2xl opacity-90 leading-relaxed">
            Otimize o gerenciamento da sua clínica com nossa solução integrada de agendamentos,
            prontuários eletrônicos e gestão financeira.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/register"
              className="px-8 py-4 rounded-lg text-lg font-semibold text-center transition-all duration-300 
              hover:scale-105 shadow-lg hover:shadow-xl"
              style={{
                backgroundColor: colors.primary,
                color: '#ffffff',
              }}>
              Agendar Demonstração
            </Link>
          </div>
        </div>
        <div className="flex-1 relative">
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}>
            <Image
              src="https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?auto=format&fit=crop&w=900&q=80"
              alt="Dashboard XClinic"
              width={800}
              height={600}
              className="rounded-3xl shadow-2xl"
              unoptimized
              priority
            />
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
