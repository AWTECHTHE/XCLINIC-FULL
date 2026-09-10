

import React from 'react';
import Link from 'next/link';

export default function Sidebar() {
  return (
    <aside className="w-64  bg-[#4F6170]  text-white flex flex-col">
      {/* Cabeçalho da Sidebar */}
   <div className="p-6 flex flex-col items-center">
        {/*  Imagem/Avatar do Médico  */}
        <img
          src="/doctor-avatar.png"
          alt="Avatar do Médico"
          className="w-20 h-20 rounded-full mb-2"
        /> 
        <p className="text-lg">Bem vindo, Dr. Brenno!</p>
      </div>

      {/* Menu de Navegação */}
      <nav className="flex-1 px-4">
        <ul className="space-y-2">
          <li>
            <a
              href="#"
              className="block py-2 px-2 rounded hover:bg-blue-800 transition"
            >
              Home
            </a>
          </li>
          <li>
            <a
              href="#"
              className="block py-2 px-2 rounded hover:bg-blue-800 transition"
            >
              Modo consulta
            </a>
          </li>
          <li>
            <Link
              href="/patients"
              className="block py-2 px-2 rounded hover:bg-blue-800 transition"
            >
              Pacientes
            </Link>
          </li>
          <li>
            <Link
              href="/uploadPage"
              className="block py-2 px-2 rounded hover:bg-blue-800 transition"
            >
              Upload de Bioimpedância
            </Link>
          </li>
        </ul>
      </nav>

      {/* Botão de Sair */}
      <div className="p-4">
        <button className="w-full py-2 bg-red-600 hover:bg-red-700 rounded">
          Sair
        </button>
      </div>
    </aside>
  );
}
