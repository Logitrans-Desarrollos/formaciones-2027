import React, { useState } from 'react';
import { User, IdCard, Briefcase, Mail, CheckCircle } from 'lucide-react';
import { courseInfo } from '../data/slides';
import { saveUserData, clearUserData, isUserDataComplete } from '../utils/userStorage';

// Correo válido y sin espacios sueltos al inicio/final (se limpian con trim()
// antes de validar y guardar, así el usuario no queda bloqueado por un
// espacio que pegó sin querer).
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * RegistrationGate
 * ----------------
 * Antes de iniciar el curso, pide Nombre completo, Cédula, Cargo y Correo (si
 * aún no se han diligenciado en este navegador). Estos datos se guardan en
 * localStorage y luego se usan para generar el certificado de finalización
 * con el nombre real del participante, y el correo para el seguimiento de
 * quién ha completado la capacitación.
 *
 * Si ya existen datos guardados para este curso, se muestra un resumen con
 * la opción de continuar con ellos o de cambiarlos (lo que reinicia el
 * progreso del curso, igual que en la versión original).
 */
function RegistrationGate({ courseId, existingData, onComplete }) {
  // Si ya había datos guardados (de antes de agregar el campo de correo), se
  // precargan para no hacer que la persona vuelva a escribir todo — solo le
  // faltará diligenciar el correo.
  const [nombre, setNombre] = useState(existingData?.nombre || '');
  const [cedula, setCedula] = useState(existingData?.cedula || '');
  const [cargo, setCargo] = useState(existingData?.cargo || '');
  const [correo, setCorreo] = useState(existingData?.correo || '');
  const [errors, setErrors] = useState({});
  const [changingData, setChangingData] = useState(false);

  const validate = () => {
    const newErrors = {};
    const correoLimpio = correo.trim();
    if (!nombre.trim()) newErrors.nombre = 'El nombre es obligatorio';
    if (!cedula.trim()) newErrors.cedula = 'La cédula es obligatoria';
    else if (!/^\d+$/.test(cedula.trim())) newErrors.cedula = 'La cédula debe contener solo números';
    if (!cargo.trim()) newErrors.cargo = 'El cargo es obligatorio';
    if (!correoLimpio) newErrors.correo = 'El correo es obligatorio';
    else if (!EMAIL_REGEX.test(correoLimpio)) newErrors.correo = 'Ingresa un correo válido';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    // trim() en cada campo: limpia espacios al inicio/final que el usuario
    // haya pegado sin querer (muy común al copiar el correo desde otro sitio).
    const data = {
      nombre: nombre.trim(),
      cedula: cedula.trim(),
      cargo: cargo.trim(),
      correo: correo.trim().toLowerCase(),
    };
    saveUserData(courseId, data);
    onComplete(data);
  };

  const handleReset = () => {
    clearUserData(courseId);
    setChangingData(false);
    setNombre('');
    setCedula('');
    setCargo('');
    setCorreo('');
    setErrors({});
  };

  // Si ya hay datos guardados y completos (incluye correo) y el usuario no
  // pidió cambiarlos: mostrar resumen. Si le falta el correo (registro
  // guardado antes de agregar este campo), se le pide completarlo abajo.
  if (existingData && isUserDataComplete(existingData) && !changingData) {
    return (
      <div className="min-h-screen bg-[#09090b] text-white flex items-center justify-center px-4">
        <div className="w-full max-w-lg bg-zinc-800/50 border border-zinc-700 rounded-2xl p-8 text-center">
          <CheckCircle className="h-14 w-14 text-emerald-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">¡Bienvenido de nuevo!</h2>
          <p className="text-zinc-400 mb-6">Ya tenemos tus datos guardados en este navegador:</p>
          <div className="bg-zinc-900/60 rounded-xl p-4 text-left space-y-2 mb-6">
            <p className="text-sm text-zinc-400">Nombre: <span className="text-zinc-100">{existingData.nombre}</span></p>
            <p className="text-sm text-zinc-400">Cédula: <span className="text-zinc-100">{existingData.cedula}</span></p>
            <p className="text-sm text-zinc-400">Cargo: <span className="text-zinc-100">{existingData.cargo}</span></p>
            <p className="text-sm text-zinc-400">Correo: <span className="text-zinc-100">{existingData.correo}</span></p>
          </div>
          <div className="flex flex-col md:flex-row gap-3">
            <button
              onClick={() => onComplete(existingData)}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-xl transition-all"
            >
              Continuar con estos datos
            </button>
            <button
              onClick={() => setChangingData(true)}
              className="w-full bg-zinc-700 hover:bg-zinc-600 text-white font-medium py-3 px-6 rounded-xl transition-all"
            >
              Cambiar datos
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-zinc-800/50 border border-zinc-700 rounded-2xl p-8">
        <h2 className="text-2xl font-bold mb-1">{courseInfo.title}</h2>
        <p className="text-zinc-400 mb-6 text-sm">
          Antes de comenzar, cuéntanos quién eres — estos datos aparecerán en tu certificado.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Nombre completo *</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-zinc-400" />
              </div>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ingresa tu nombre completo"
                className={`block w-full pl-10 pr-3 py-3 border rounded-lg bg-zinc-900/50 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 transition-colors ${
                  errors.nombre ? 'border-red-500 focus:ring-red-500/50' : 'border-zinc-700 focus:ring-blue-500/50 focus:border-blue-500'
                }`}
              />
            </div>
            {errors.nombre && <p className="mt-1.5 text-sm text-red-400">{errors.nombre}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Número de cédula *</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <IdCard className="h-5 w-5 text-zinc-400" />
              </div>
              <input
                type="text"
                value={cedula}
                onChange={(e) => setCedula(e.target.value)}
                placeholder="Ingresa tu número de cédula"
                className={`block w-full pl-10 pr-3 py-3 border rounded-lg bg-zinc-900/50 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 transition-colors ${
                  errors.cedula ? 'border-red-500 focus:ring-red-500/50' : 'border-zinc-700 focus:ring-blue-500/50 focus:border-blue-500'
                }`}
              />
            </div>
            {errors.cedula && <p className="mt-1.5 text-sm text-red-400">{errors.cedula}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Cargo *</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Briefcase className="h-5 w-5 text-zinc-400" />
              </div>
              <input
                type="text"
                value={cargo}
                onChange={(e) => setCargo(e.target.value)}
                placeholder="Ingresa tu cargo"
                className={`block w-full pl-10 pr-3 py-3 border rounded-lg bg-zinc-900/50 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 transition-colors ${
                  errors.cargo ? 'border-red-500 focus:ring-red-500/50' : 'border-zinc-700 focus:ring-blue-500/50 focus:border-blue-500'
                }`}
              />
            </div>
            {errors.cargo && <p className="mt-1.5 text-sm text-red-400">{errors.cargo}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Correo electrónico *</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-zinc-400" />
              </div>
              <input
                type="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                onBlur={(e) => setCorreo(e.target.value.trim())}
                placeholder="nombre@argos.com.co"
                className={`block w-full pl-10 pr-3 py-3 border rounded-lg bg-zinc-900/50 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 transition-colors ${
                  errors.correo ? 'border-red-500 focus:ring-red-500/50' : 'border-zinc-700 focus:ring-blue-500/50 focus:border-blue-500'
                }`}
              />
            </div>
            {errors.correo && <p className="mt-1.5 text-sm text-red-400">{errors.correo}</p>}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="mt-6 w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3.5 rounded-xl transition-all hover:scale-[1.01]"
        >
          Comenzar
        </button>

        {existingData && (
          <button onClick={handleReset} className="mt-3 w-full text-zinc-500 hover:text-zinc-300 text-sm transition-colors">
            Cancelar y volver a mis datos guardados
          </button>
        )}
      </div>
    </div>
  );
}

export default RegistrationGate;
