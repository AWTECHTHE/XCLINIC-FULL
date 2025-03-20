'use client';
import '../styles/globals.css'


import { useState } from 'react';

const doctors = [
  {
    id: 1,
    name: 'Dr Brenno',
    status: 'disponível para o próximo paciente',
    avatar: '🧑‍⚕️',
    bgColor: 'bg-green-500'
  },
  {
    id: 2,
    name: 'Dr Fernando',
    status: 'em atendimento com paciente João da Silva',
    avatar: '🩺',
    bgColor: 'bg-blue-500'
  },
  {
    id: 3,
    name: 'Dra Sabrina',
    status: 'em atendimento com paciente José da Silva',
    avatar: '👩‍⚕️',
    bgColor: 'bg-blue-500'
  },
  {
    id: 4,
    name: 'Aviso',
    status: 'Favor cancelar as consultas do dia e remarcar para semana que vem',
    avatar: '💬',
    bgColor: 'bg-red-500'
  }
];

export default function DoctorsList() {
  return (
    <div className="min-h-screen flex">
      <aside className="w-1/5 bg-gray-900 text-white p-5">
        <nav>
          <ul>
            <li className="mb-4"><a href="#" className="text-yellow-400">Home</a></li>
            <li className="mb-4"><a href="#">Marcar consultas</a></li>
            <li className="mt-20"><a href="#" className="text-red-400">Sair</a></li>
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-10">
        <h1 className="text-xl font-bold mb-5">Médicos do sistema:</h1>
        <div className="space-y-4">
          {doctors.map((doctor) => (
            <div key={doctor.id} className="flex items-center p-4 rounded-lg shadow bg-white">
              <div className={`w-12 h-12 flex items-center justify-center rounded-full text-white text-xl ${doctor.bgColor} mr-4`}>
                {doctor.avatar}
              </div>
              <p className="text-gray-800 font-medium">{doctor.name} está {doctor.status}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
