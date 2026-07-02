"use client"
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiSun, FiMoon, FiLogIn, FiUser, FiMenu, FiX } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';
import { useState } from 'react';

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

export default function Navbar() {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const colors = isDarkMode ? COLORS.dark : COLORS.light;

  return (
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
              onClick={toggleDarkMode}
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
              href="/register"
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
                href="/register"
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
  );
}
