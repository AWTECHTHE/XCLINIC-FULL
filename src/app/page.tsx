"use client"
import Image from "next/image";
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { FiSun, FiMoon, FiUser, FiLogIn, FiMenu, FiX } from 'react-icons/fi';

const COLORS = {
  light: {
    primary: '#2563eb',
    secondary: '#475569',
    accent: '#dc2626',
    background: '#f8fafc',
    text: '#1e293b',
    border: '#e2e8f0'
  },
  dark: {
    primary: '#3b82f6',
    secondary: '#94a3b8',
    accent: '#ef4444',
    background: '#0f172a',
    text: '#f8fafc',
    border: '#334155'
  }
};

const fadeInUp = {
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const colors = isDarkMode ? COLORS.dark : COLORS.light;

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

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${isDarkMode ? 'dark' : ''}`}
      style={{
        backgroundColor: colors.background,
        color: colors.text
      }}>
      {/* Navigation */}
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-between"
        >
          <div className="text-2xl font-bold" style={{ color: colors.primary }}>
            XClinic
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex gap-8">
              <Link href="/recursos" className="hover:opacity-75 transition-opacity duration-300"
                style={{ color: colors.text }}>
                Recursos
              </Link>
              <Link href="/precos" className="hover:opacity-75 transition-opacity duration-300"
                style={{ color: colors.text }}>
                Preços
              </Link>
              <Link href="/contato" className="hover:opacity-75 transition-opacity duration-300"
                style={{ color: colors.text }}>
                Contato
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 rounded-full hover:bg-opacity-10 transition-colors duration-300"
                style={{ color: colors.text }}>
                {isDarkMode ? <FiSun size={24} /> : <FiMoon size={24} />}
              </button>

              <Link
                href="/login"
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-opacity-10 transition-colors duration-300"
                style={{ color: colors.primary }}>
                <FiLogIn size={20} />
                Entrar
              </Link>
              <Link
                href="/cadastro"
                className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-colors duration-300"
                style={{
                  borderColor: colors.primary,
                  color: colors.primary,
                }}>
                <FiUser size={20} />
                Cadastre-se
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            style={{ color: colors.text }}>
            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </motion.div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 p-4 rounded-lg" style={{
            backgroundColor: isDarkMode ? COLORS.dark.background : '#ffffff',
            border: `1px solid ${colors.border}`
          }}>
            <div className="flex flex-col gap-4">
              <Link href="/recursos" className="py-2" onClick={() => setIsMenuOpen(false)}>
                Recursos
              </Link>
              <Link href="/precos" className="py-2" onClick={() => setIsMenuOpen(false)}>
                Preços
              </Link>
              <Link href="/contato" className="py-2" onClick={() => setIsMenuOpen(false)}>
                Contato
              </Link>
              <div className="border-t pt-4 mt-2" style={{ borderColor: colors.border }}>
                <Link
                  href="/login"
                  className="flex items-center gap-2 py-2"
                  onClick={() => setIsMenuOpen(false)}>
                  <FiLogIn size={20} />
                  Entrar
                </Link>
                <Link
                  href="/cadastro"
                  className="flex items-center gap-2 py-2"
                  onClick={() => setIsMenuOpen(false)}>
                  <FiUser size={20} />
                  Cadastre-se
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
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
                href="/demo"
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
                src="https://blog.carefy.com.br/wp-content/uploads/2022/09/A-importa%CC%82ncia-de-um-me%CC%81dico-especialista-.jpg"
                alt="Dashboard XClinic"
                width={800}
                height={600}
                className="rounded-3xl shadow-2xl"
                priority
              />
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Seção de Diferenciais */}
      <motion.section
        initial="initial"
        whileInView="animate"
        variants={fadeInUp}
        viewport={{ once: true }}
        className="bg-white py-20 dark:bg-gray-800"
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16" style={{ color: colors.primary }}>
            Vantagens Competitivas
          </h2>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                title: 'Redução de Custos',
                content: 'Reduza em até 40% os custos operacionais com automação inteligente de processos administrativos',
                icon: '💸'
              },
              {
                title: 'Segurança de Dados',
                content: 'Certificação HIPAA nível 3 e criptografia AES-256 para máxima proteção de dados sensíveis',
                icon: '🛡️'
              },
              {
                title: 'Integração Total',
                content: 'Conecte-se facilmente com os principais sistemas de saúde e prontuários eletrônicos do mercado',
                icon: '🔗'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -10 }}
                className="p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 bg-white/50 dark:bg-gray-700 backdrop-blur-sm"
              >
                <div className="text-4xl mb-6">{item.icon}</div>
                <h3 className="text-2xl font-semibold mb-4" style={{ color: colors.primary }}>{item.title}</h3>
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">{item.content}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Seção de Funcionalidades */}
      <motion.section
        initial="initial"
        whileInView="animate"
        variants={fadeInUp}
        viewport={{ once: true }}
        className="py-20 bg-[#f8fafc] dark:bg-gray-900"
      >
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                Tecnologia que Transforma
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                Nossa plataforma combina recursos avançados com uma interface intuitiva, oferecendo:
              </p>
              <div className="space-y-6">
                {[
                  'Agendamento Inteligente com IA preditiva',
                  'Prontuário Eletrônico Certificado (PEP)',
                  'Gestão Financeira Integrada',
                  'Business Intelligence em Tempo Real',
                  'Comunicação Multi-canal com Pacientes',
                  'Controle de Estoque Médico'
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ x: 10 }}
                    className="flex items-center gap-4 p-4 rounded-xl hover:bg-white dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-600 text-white">
                      ✓
                    </div>
                    <span className="text-xl text-gray-700 dark:text-gray-300">{item}</span>
                  </motion.div>
                ))}
              </div>
            </div>
            <motion.div
              whileHover={{ rotate: -2 }}
              className="relative"
            >
              <Image
                src="https://usercontent.one/wp/nagaredesignstudio.com/wp-content/uploads/2023/02/1000-City-guide-app.jpg?media=1698074710"
                alt="Aplicativo Mobile"
                width={600}
                height={600}
                className="rounded-3xl shadow-2xl"
              />
              <div className="absolute -bottom-8 -right-8 bg-white p-6 rounded-2xl shadow-lg border-2 border-blue-600">
                <span className="block text-sm text-gray-600">Prêmio Melhor Plataforma</span>
                <span className="text-2xl font-bold text-blue-600">2024</span>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Seção de Depoimentos */}
      <motion.section
        initial="initial"
        whileInView="animate"
        variants={fadeInUp}
        viewport={{ once: true }}
        className="py-20 bg-white dark:bg-gray-800"
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16" style={{ color: colors.primary }}>
            Histórias de Sucesso
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <motion.div
                key={item}
                whileHover={{ scale: 1.05 }}
                className="bg-white dark:bg-gray-700 p-8 rounded-2xl shadow-lg"
              >
                <p className="text-lg text-gray-600 dark:text-gray-300 italic mb-6">
                  "Implementamos o XClinic e em 3 meses reduzimos 40% do tempo administrativo.
                  A integração com nossos sistemas existentes foi perfeita."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    👩⚕️
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Dra. Carla Mendes</h4>
                    <p className="text-sm text-gray-500">Clínica Saúde Integral</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Seção de Preços */}
      <motion.section
        initial="initial"
        whileInView="animate"
        variants={fadeInUp}
        viewport={{ once: true }}
        className="py-20 bg-[#f8fafc] dark:bg-gray-900"
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16" style={{ color: colors.primary }}>
            Planos Sob Medida
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Clínica Individual',
                price: 'R$299/mês',
                features: ['Até 5 profissionais', '100GB armazenamento', 'Suporte prioritário'],
                bestFor: 'Profissionais autônomos'
              },
              {
                title: 'Clínica Premium',
                price: 'R$799/mês',
                features: ['Até 20 profissionais', 'Prontuário ilimitado', 'BI integrado'],
                bestFor: 'Clínicas de médio porte',
                popular: true
              },
              {
                title: 'Enterprise',
                price: 'Personalizado',
                features: ['Gestão multi-unidades', 'Treinamento dedicado', 'Suporte 24/7'],
                bestFor: 'Redes e grandes clínicas'
              }
            ].map((plan, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                className={`p-8 rounded-2xl relative shadow-xl transition-all duration-300 ${plan.popular ? 'border-2 border-blue-600' : 'border border-gray-200'}`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-blue-600 text-white px-4 py-1 rounded-bl-lg rounded-tr-lg text-sm">
                    Mais Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-2" style={{ color: colors.primary }}>{plan.title}</h3>
                <p className="text-gray-500 mb-4">{plan.bestFor}</p>
                <div className="text-4xl font-bold mb-6 text-gray-800 dark:text-gray-100">{plan.price}</div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                      <span className="text-blue-600">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/cadastro"
                  className="block text-center py-3 rounded-lg font-semibold transition-all duration-300 
                  hover:scale-105 shadow-md hover:shadow-lg"
                  style={{
                    backgroundColor: plan.popular ? colors.primary : colors.secondary,
                    color: 'white'
                  }}
                >
                  Começar Agora
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
      {/* Features Section */}


      {/* Footer */}
      <footer className="py-20" style={{
        backgroundColor: isDarkMode ? '#1e293b' : '#e2e8f0',
        color: colors.text
      }}>
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold" style={{ color: colors.primary }}>XClinic</h3>
              <p className="text-sm opacity-90">
                Transformando a gestão em saúde através de tecnologia inovadora
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold" style={{ color: colors.primary }}>Links Rápidos</h4>
              <nav className="flex flex-col space-y-2">
                <Link href="/sobre" className="opacity-90 hover:opacity-100 transition-opacity">
                  Sobre Nós
                </Link>
                <Link href="/blog" className="opacity-90 hover:opacity-100 transition-opacity">
                  Blog
                </Link>
                <Link href="/carreiras" className="opacity-90 hover:opacity-100 transition-opacity">
                  Carreiras
                </Link>
              </nav>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold" style={{ color: colors.primary }}>Legal</h4>
              <nav className="flex flex-col space-y-2">
                <Link href="/privacidade" className="opacity-90 hover:opacity-100 transition-opacity">
                  Privacidade
                </Link>
                <Link href="/termos" className="opacity-90 hover:opacity-100 transition-opacity">
                  Termos
                </Link>
                <Link href="/suporte" className="opacity-90 hover:opacity-100 transition-opacity">
                  Suporte
                </Link>
              </nav>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold" style={{ color: colors.primary }}>Contato</h4>
              <div className="space-y-2 text-sm opacity-90">
                <p>contato@xclinic.com</p>
                <p>(11) 9999-9999</p>
                <p>São Paulo - SP</p>
              </div>
            </div>
          </div>

          <div className="border-t mt-12 pt-8 text-center text-sm opacity-90"
            style={{ borderColor: colors.border }}>
            <p>&copy; {new Date().getFullYear()} XClinic. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}