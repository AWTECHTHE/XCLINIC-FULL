"use client"
import { motion } from 'framer-motion';

const fadeInUp = {
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const features = [
  {
    title: 'Agendamento Inteligente',
    description: 'Sistema de marcação online integrado com confirmação automática',
    icon: '📅'
  },
  {
    title: 'Prontuário Eletrônico',
    description: 'Armazenamento seguro em nuvem com acesso multiplataforma',
    icon: '🏥'
  },
  {
    title: 'Gestão Financeira',
    description: 'Controle completo de pagamentos e fluxo de caixa',
    icon: '💳'
  }
];

export default function FeaturesSection({ colors, isDarkMode }: { colors: any, isDarkMode: boolean }) {
  return (
    <motion.section
      initial="initial"
      whileInView="animate"
      variants={fadeInUp}
      viewport={{ once: true }}
      className="py-20"
      style={{ backgroundColor: colors.background }}>
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16"
          style={{ color: colors.primary }}>
          Recursos Principais
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -10 }}
              className="p-8 rounded-2xl shadow-lg transition-all duration-300"
              style={{
                backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
                border: `1px solid ${colors.border}`
              }}>
              <div className="text-4xl mb-6">{feature.icon}</div>
              <h3 className="text-2xl font-semibold mb-4"
                style={{ color: colors.primary }}>{feature.title}</h3>
              <p className="opacity-90">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
