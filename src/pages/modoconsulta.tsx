import { useState } from "react";
import Sidebar from "@/app/components/Sidebar";
import "../styles/globals.css";
import { User, FileText } from "lucide-react";

export default function MedicalDashboard() {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = ["Informações do Paciente", "Formulários Preenchidos"];

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      
      {/* Main Content */}
      <main className="flex-1 flex justify-center items-center p-8 overflow-hidden">
        <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-5xl overflow-x-auto whitespace-nowrap scrollbar-hide">
          <div className="flex transition-transform duration-300 w-[200%]" style={{ transform: `translateX(-${activeTab * 50}%)` }}>
            
            {/* Informações do Paciente */}
            <div className="w-full h-[500px] flex-shrink-0 p-4">
              <h3 className="text-lg font-semibold">Informações do Paciente:</h3>
              <p><strong>Idade:</strong> 34 anos</p>
              <p><strong>Peso:</strong> 70 kg</p>
              <p><strong>Data de nascimento:</strong> 02/05/1990</p>
              <p><strong>Altura:</strong> 1,75 m</p>
              <p><strong>CPF:</strong> 012.345.678-90</p>
              <p><strong>IMC:</strong> 22,9</p>
              <h3 className="mt-4 text-lg font-semibold">Histórico Médico:</h3>
              <p>Doenças Passadas: Asma (diagnosticada na infância), gastrite crônica.</p>
              <p>Alergias: Alergia a penicilina e frutos do mar.</p>
              <p>Cirurgias: Apendicectomia realizada em 2018.</p>
              <h3 className="mt-4 text-lg font-semibold">Exames Solicitados:</h3>
              <div className="grid grid-cols-2 gap-2">
                <p>Hemograma completo</p>
                <p>Glicemia em jejum</p>
                <p>Triglicerídeos</p>
                <p>Colesterol total e frações (LDL, HDL, VLDL)</p>
                <p>Creatinina</p>
              </div>
            </div>
            
            {/* Formulários Preenchidos */}
            <div className="w-full h-[500px] flex-shrink-0 p-4">
              <h3 className="text-lg font-semibold">Formulários preenchidos</h3>
              <div className="flex flex-col gap-2 mt-2">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-red-500" />
                  <a href="#" className="text-blue-500 hover:underline">formulário1.pdf</a>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-red-500" />
                  <a href="#" className="text-blue-500 hover:underline">formulário2.pdf</a>
                </div>
              </div>
            </div>
          </div>
          
          {/* Tab Navigation */}
          <div className="flex justify-center mt-4 gap-2">
            {tabs.map((tab, index) => (
              <button
                key={index}
                className={`w-4 h-4 rounded-full mx-1 ${activeTab === index ? "bg-blue-500" : "bg-gray-500"}`}
                onClick={() => setActiveTab(index)}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
