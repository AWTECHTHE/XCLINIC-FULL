
import Sidebar from '@/app/components/Sidebar';
import '../styles/globals.css'

import { User, Home, LogOut } from "lucide-react";

export default function MedicalDashboard() {
  return (
    <div className="flex h-screen bg-gray-100">
     <Sidebar/>
      {/* Main Content */}
      <main className="flex-1 flex justify-center items-center p-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-3xl">
          {/* Profile Section */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-300 rounded-full overflow-hidden">
              <User className="w-full h-full text-gray-700" />
            </div>
            <span className="text-lg font-semibold">Ana S. Silva</span>
          </div>
          
          {/* Patient Info */}
          <div className="bg-gray-200 p-4 mt-4 rounded-xl grid grid-cols-2 gap-4">
            <p><strong>Idade:</strong> 34 anos</p>
            <p><strong>Peso:</strong> 70 kg</p>
            <p><strong>Data de nascimento:</strong> 02/05/1990</p>
            <p><strong>Altura:</strong> 1,75 m</p>
            <p><strong>CPF:</strong> 012.345.678-90</p>
            <p><strong>IMC:</strong> 22,9</p>
          </div>
          
          {/* Medical History */}
          <div className="bg-gray-200 p-4 mt-4 rounded-xl">
            <h3 className="text-lg font-semibold">Histórico Médico:</h3>
            <p>Doenças Passadas: Asma (diagnosticada na infância), gastrite crônica.</p>
            <p>Alergias: Alergia a penicilina e frutos do mar.</p>
            <p>Cirurgias: Apendicectomia realizada em 2018.</p>
          </div>
          
          {/* Requested Exams */}
          <div className="bg-gray-200 p-4 mt-4 rounded-xl">
            <h3 className="text-lg font-semibold">Exames solicitados:</h3>
            <div className="grid grid-cols-2 gap-2">
              <p>Hemograma completo</p>
              <p>Glicemia em jejum</p>
              <p>Triglicerídeos</p>
              <p>Colesterol total e frações (LDL, HDL, VLDL)</p>
              <p>Creatinina</p>
            </div>
          </div>
          
          {/* Pagination */}
          <div className="flex justify-center mt-4">
            <span className="w-3 h-3 bg-gray-500 rounded-full mx-1"></span>
            <span className="w-3 h-3 bg-blue-500 rounded-full mx-1"></span>
            <span className="w-3 h-3 bg-gray-500 rounded-full mx-1"></span>
          </div>
        </div>
      </main>
    </div>
  );
}
