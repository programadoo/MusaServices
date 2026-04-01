import React, { useContext, useState } from 'react';
import { AuthContext } from "../shared/context/AuthContext"; 
import UserHistory from "./UserHistory";
import { motion } from "framer-motion";
import { CreditCard, Zap, Loader2, Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const auth = useContext(AuthContext);
  const user = auth?.user;
  const navigate = useNavigate();
  const [loadingPayment, setLoadingPayment] = useState<string | null>(null);

  // --- FUNCIÓN: COMPRAR CRÉDITOS ---
  const buyCredits = async (amount: number, credits: number) => {
    setLoadingPayment(`${credits}`);
    console.log(`[LUMEN PAY] Iniciando proceso: ${credits} créditos por $${amount}`);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/credits/buy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth?.token}`
        },
        body: JSON.stringify({ amount, creditsToBuy: credits })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || "Error en el servidor de pagos");
      }

      if (data.invoice_url) {
        console.log("[LUMEN PAY] Redirigiendo a NowPayments...");
        window.location.href = data.invoice_url;
      } else {
        alert("El proveedor de pagos no pudo generar la factura.");
      }

    } catch (error: any) {
      console.error("[LUMEN PAY] Error crítico:", error);
      alert(`Error de conexión: ${error.message}`);
    } finally {
      setLoadingPayment(null);
    }
  };

  // --- FUNCIÓN: ELIMINAR CUENTA (NUEVO) ---
  const deleteAccount = async () => {
    const confirmDelete = window.confirm(
      "¿ESTÁS SEGURO, ALEJANDRO? Esta acción es irreversible. Se borrarán tus créditos, diseños y acceso a Musa AI definitivamente."
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/delete-account`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${auth?.token}`
        }
      });

      if (response.ok) {
        alert("Registro eliminado del núcleo de Musa Core.");
        auth?.logout(); // Limpia el contexto
        navigate('/');   // Redirige al inicio
      } else {
        const data = await response.json();
        alert(data.error || "No se pudo eliminar la cuenta.");
      }
    } catch (error) {
      console.error("❌ Error en el proceso de baja:", error);
      alert("Error de comunicación con el servidor.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-32 pb-20 text-white font-sans">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* HEADER DE SECCIÓN */}
        <header className="mb-12 flex items-center gap-4">
            <span className="w-10 h-[1px] bg-pink-500"></span>
            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-pink-500">
                Panel de Usuario / v1.1 / Gestión de Créditos
            </h2>
        </header>

        {/* BANNER DE USUARIO */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bg-[#111111] rounded-[3.5rem] p-10 md:p-16 border border-white/5 mb-16 shadow-[0_40px_100px_rgba(0,0,0,0.4)]"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-pink-500/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-10">
            <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-tr from-pink-500 to-purple-500 rounded-full blur-xl opacity-40 group-hover:opacity-70 transition-opacity"></div>
                <div className="relative w-36 h-36 bg-[#0A0A0A] border-4 border-white/10 rounded-full flex items-center justify-center text-5xl font-black text-white overflow-hidden">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                    <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                </div>
            </div>

            <div className="text-center md:text-left space-y-2 flex-grow">
              <div className="flex flex-col md:flex-row md:items-center gap-3">
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none italic">
                    {user?.name || "Usuario"}
                </h1>
                <span className="md:mt-4 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[8px] font-black text-gray-500 uppercase tracking-widest self-center md:self-start">
                    Verified Account
                </span>
              </div>
              <p className="text-gray-500 font-bold uppercase tracking-widest text-[11px] flex items-center justify-center md:justify-start gap-2">
                <Zap size={12} className="text-pink-500" />
                {user?.email}
              </p>
            </div>

            <div className="flex flex-col items-center lg:items-end gap-4 min-w-[280px]">
                <div className="bg-white/[0.03] p-8 rounded-[2.5rem] border border-white/10 text-center w-full relative overflow-hidden group">
                  <div className="absolute inset-0 bg-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <p className="text-[10px] font-black uppercase text-gray-500 mb-2 tracking-widest">Créditos Disponibles</p>
                  <div className="flex items-center justify-center gap-3">
                    <Zap className="text-pink-500 fill-pink-500" size={24} />
                    <span className="text-6xl font-black text-white italic leading-none">
                      {user?.credits || 0}
                    </span>
                  </div>
                </div>
            </div>
          </div>
        </motion.div>

        {/* RECARGA DE CRÉDITOS */}
        <div className="mb-20">
            <div className="flex items-center gap-6 mb-10">
                <h3 className="text-4xl font-black uppercase tracking-tighter leading-none italic">Recargar Créditos</h3>
                <div className="h-[1px] flex-1 bg-white/5 mb-2"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { credits: 375, price: 15, tag: 'Starter' },
                { credits: 750, price: 30, tag: 'Pro', recommended: true },
                { credits: 500, price: 20, tag: 'Elite' }
              ].map((tier) => (
                <motion.div 
                  key={tier.credits}
                  whileHover={{ y: -10 }}
                  className={`relative p-8 rounded-[2.5rem] border transition-all duration-500 ${
                    tier.recommended ? 'bg-pink-500 border-pink-400 text-black shadow-[0_20px_50px_rgba(236,72,153,0.3)]' : 'bg-[#111111] border-white/5 text-white'
                  }`}
                >
                  <div className="flex justify-between items-start mb-8">
                    <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
                      tier.recommended ? 'border-black/20 bg-black/5' : 'border-white/10 bg-white/5 text-gray-400'
                    }`}>
                      {tier.tag}
                    </span>
                    <Plus size={20} className={tier.recommended ? 'text-black' : 'text-pink-500'} />
                  </div>

                  <div className="mb-8">
                    <h4 className="text-5xl font-black italic mb-1">{tier.credits}</h4>
                    <p className={`text-[10px] font-bold uppercase tracking-widest ${tier.recommended ? 'text-black/60' : 'text-gray-500'}`}>
                      Lumen Credits
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                        <span className="text-2xl font-black italic">$ {tier.price}</span>
                        <span className={`text-[8px] font-black uppercase ml-2 ${tier.recommended ? 'text-black/60' : 'text-gray-400'}`}>USDT / TRC20</span>
                    </div>
                    <button 
                      onClick={() => buyCredits(tier.price, tier.credits)}
                      disabled={loadingPayment !== null}
                      className={`h-14 w-14 rounded-full flex items-center justify-center transition-all active:scale-90 ${
                        tier.recommended ? 'bg-black text-white' : 'bg-pink-500 text-white'
                      } disabled:opacity-50`}
                    >
                      {loadingPayment === `${tier.credits}` ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        <CreditCard size={20} />
                      )}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
        </div>

        {/* HISTORIAL */}
        <div className="space-y-8">
            <div className="flex items-end gap-6 mb-10">
                <h3 className="text-4xl font-black uppercase tracking-tighter leading-none italic">Historial de Transacciones</h3>
                <div className="h-[1px] flex-1 bg-white/5 mb-2"></div>
            </div>
            
            <div className="bg-[#111111] rounded-[3rem] p-8 md:p-12 border border-white/5 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-pink-500/20"></div>
                <UserHistory />
            </div>
        </div>

        {/* ZONA DE PELIGRO (NUEVO) */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-32 p-12 rounded-[3.5rem] border border-red-500/10 bg-red-500/[0.02] flex flex-col md:flex-row items-center justify-between gap-8"
        >
          <div className="space-y-2 text-center md:text-left">
            <h4 className="text-2xl font-black uppercase italic text-red-500 tracking-tighter">Zona de Peligro</h4>
            <p className="text-gray-500 text-[11px] font-bold uppercase tracking-widest max-w-md">
              Al eliminar tu cuenta, todos tus diseños, historial y créditos se borrarán permanentemente del sistema de Musa AI.
            </p>
          </div>
          
          <button 
            onClick={deleteAccount}
            className="group flex items-center gap-3 px-10 py-5 bg-transparent border border-red-500/20 hover:bg-red-600 hover:border-red-600 hover:text-white text-red-500 rounded-full text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-300 active:scale-95"
          >
            <Trash2 size={16} className="group-hover:animate-bounce" />
            Eliminar cuenta definitivamente
          </button>
        </motion.div>
        
      </div>
    </div>
  );
};

export default Profile;