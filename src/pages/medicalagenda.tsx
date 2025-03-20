import Sidebar from '@/app/components/Sidebar';
import '../styles/globals.css'

import React from 'react';

export default function Atendimentos() {
  // Lista de atendimentos de exemplo
  const atendimentos = [
    { id: 1, name: 'João da Cruz', type: 'Consulta', time: '08:00' },
    { id: 2, name: 'Maria Goes', type: 'Consulta', time: '09:00' },
    { id: 3, name: 'Thiago Silva', type: 'Retorno', time: '10:30' },
    { id: 4, name: 'José Gomes', type: 'Retorno', time: '11:00' },
    { id: 5, name: 'Pedro Lopes', type: 'Consulta', time: '13:00' },
    { id: 6, name: 'Raimunda A.', type: 'Retorno', time: '14:00' },
    { id: 7, name: 'João Teixeira', type: 'Consulta', time: '15:00' },
  ];

  return (
    <div className="flex min-h-screen">
      {/* SIDEBAR */}
      <Sidebar/>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1 bg-gray-100 p-6">
        <div className="bg-white rounded shadow p-4">
          <h1 className="text-xl font-bold mb-4">
            Atendimentos do dia: 18/01/2025
          </h1>
          <ul className="space-y-4">
            {atendimentos.map((atendimento) => (
              <li
                key={atendimento.id}
                className="flex items-center justify-between p-2 bg-gray-50 rounded"
              >
                {/* Nome do paciente */}
                <span className="text-gray-700 font-medium">
                  {atendimento.name}
                </span>

                {/* Badge de tipo (Consulta ou Retorno) */}
                <span
                  className={`px-3 py-1 rounded-full text-white font-semibold ${
                    atendimento.type === 'Consulta'
                      ? 'bg-green-500'
                      : 'bg-blue-500'
                  }`}
                >
                  {atendimento.type}
                </span>

                {/* Horário */}
                <span className="text-gray-500">
                  Horário: {atendimento.time}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}
