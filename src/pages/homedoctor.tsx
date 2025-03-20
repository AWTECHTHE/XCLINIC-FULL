import '../styles/globals.css'
import Sidebar from '@/app/components/Sidebar';

import React from 'react';
import {
  CircularProgressbar,
  buildStyles,
} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default function HomeMedico() {
  // Valores de exemplo para as barras de progresso
  const atendimentosDoDia = 70; // 70%
  const capacidadeSemanal = 90; // 90%

  return (
    <div className="flex min-h-screen">
      {/* SIDEBAR */}
   <Sidebar/>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1 bg-gray-100 p-6">
        <div className="bg-white rounded shadow p-4 mb-6">
          <h1 className="text-2xl font-bold">Home - Visão Geral</h1>
        </div>

        {/* Cards com barras de progresso */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Card 1: Atendimentos do dia */}
          <div className="bg-white rounded shadow p-4 flex flex-col items-center">
            <h2 className="text-xl font-semibold mb-4">Atendimentos do dia</h2>
            <div className="w-32 h-32">
              <CircularProgressbar
                value={atendimentosDoDia}
                text={`${atendimentosDoDia}%`}
                styles={buildStyles({
                  textSize: '16px',
                  pathColor: '#3b82f6', // azul
                  textColor: '#333',
                  trailColor: '#d6d6d6',
                })}
              />
            </div>
          </div>

          {/* Card 2: Capacidade semanal de atendimentos */}
          <div className="bg-white rounded shadow p-4 flex flex-col items-center">
            <h2 className="text-xl font-semibold mb-4">
              Capacidade semanal de atendimentos
            </h2>
            <div className="w-32 h-32">
              <CircularProgressbar
                value={capacidadeSemanal}
                text={`${capacidadeSemanal}%`}
                styles={buildStyles({
                  textSize: '16px',
                  pathColor: '#10b981', // verde
                  textColor: '#333',
                  trailColor: '#d6d6d6',
                })}
              />
            </div>
          </div>
        </div>

        {/* Seção de mensagem e botões */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Envio de mensagem para a recepção */}
          <div className="bg-white rounded shadow p-4">
            <h2 className="text-xl font-semibold mb-4">
              Envio de mensagem para a recepção
            </h2>
            <textarea
              className="w-full border border-gray-300 rounded p-2 mb-2"
              rows={5}
              placeholder="Digite sua mensagem aqui..."
            ></textarea>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Enviar
            </button>
          </div>

          {/* Botões de ação */}
          <div className="bg-white rounded shadow p-4 flex flex-col justify-center items-center">
            <button className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded mb-4">
              Próximo
            </button>
            <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded mb-4">
              Aguarde
            </button>
            <button className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
              Cancelar
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
