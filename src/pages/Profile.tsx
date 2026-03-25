import React, { useContext } from 'react';
import { AuthContext } from "../shared/context/AuthContext"; 
import UserHistory from "./UserHistory";
import { motion } from "framer-motion";

const Profile = () => {
  const auth = useContext(AuthContext);
  const user = auth?.user;

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-32 pb-20 text-white font-sans">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* HEADER DE SECCIÓN */}
        <header className="mb-12 flex items-center gap-4">
            <span className="w-10 h-[1px] bg-pink-500"></span>
            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-pink-500">
                User Dashboard / v1.0
            </h2>
        </header>

        {/* BANNER DE USUARIO - ESTILO ID CARD */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bg-[#111111] rounded-[3.5rem] p-10 md:p-16 border border-white/5 mb-16 shadow-[0_40px_100px_rgba(0,0,0,0.4)]"
        >
          {/* Decoración de fondo (Glow) */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-pink-500/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
            {/* AVATAR CON ANILLO DE CARGA */}
            <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-tr from-pink-500 to-purple-500 rounded-full blur-xl opacity-40 group-hover:opacity-70 transition-opacity"></div>
                <div className="relative w-36 h-36 bg-[#0A0A0A] border-4 border-white/10 rounded-full flex items-center justify-center text-5xl font-black text-white overflow-hidden">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                    {/* Overlay sutil de textura */}
                    <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                </div>
            </div>

            <div className="text-center md:text-left space-y-2">
              <div className="flex flex-col md:flex-row md:items-center gap-3">
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none italic">
                    {user?.name || "Usuario"}
                </h1>
                <span className="md:mt-4 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[8px] font-black text-gray-500 uppercase tracking-widest self-center md:self-start">
                    Verified ID
                </span>
              </div>
              <p className="text-gray-500 font-bold uppercase tracking-widest text-[11px] flex items-center justify-center md:justify-start gap-2">
                <i className="fas fa-envelope text-pink-500"></i>
                {user?.email}
              </p>
            </div>

            {/* STATS RÁPIDAS */}
            <div className="md:ml-auto grid grid-cols-2 gap-4 w-full md:w-auto">
               <div className="bg-white/[0.03] p-6 rounded-[2rem] border border-white/5 text-center min-w-[140px]">
                  <p className="text-[9px] font-black uppercase text-gray-600 mb-2 tracking-widest">Membresía</p>
                  <p className="text-xs font-black text-pink-500 uppercase tracking-tighter">Musa AI Pro</p>
               </div>
               <div className="bg-white/[0.03] p-6 rounded-[2rem] border border-white/5 text-center min-w-[140px]">
                  <p className="text-[9px] font-black uppercase text-gray-600 mb-2 tracking-widest">Nivel</p>
                  <p className="text-xs font-black text-white uppercase tracking-tighter italic">Alpha Tester</p>
               </div>
            </div>
          </div>

          {/* BARRA INFERIOR DECORATIVA */}
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-pink-500/50 to-transparent"></div>
        </motion.div>

        {/* SECCIÓN DE HISTORIAL CON TÍTULO EDITORIAL */}
        <div className="space-y-8">
            <div className="flex items-end gap-6 mb-10">
                <h3 className="text-4xl font-black uppercase tracking-tighter leading-none">Activity Log</h3>
                <div className="h-[1px] flex-1 bg-white/5 mb-2"></div>
            </div>
            
            <div className="bg-[#111111] rounded-[3rem] p-8 md:p-12 border border-white/5 shadow-2xl">
                <UserHistory />
            </div>
        </div>
        
      </div>
    </div>
  );
};

export default Profile;