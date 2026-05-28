import React, { useState, useEffect } from 'react';

const ETNIAS_POOL = [
  { nombre: 'Purépecha / Tarasco', region: 'Mesoamérica Centro-Occidente (México)' },
  { nombre: 'Maya / Peninsular', region: 'Zona del Mayab (Sureste Mesoamericano)' },
  { nombre: 'Nahua / Altiplano', region: 'Valle de México y Eje Neovolcánico' },
  { nombre: 'Quechua / Aimara', region: 'Región Andina Central (Sudamérica)' },
  { nombre: 'Región Íbera / Continental', region: 'Península Ibérica (Europa Sudoccidental)' },
  { nombre: 'Celta / Atlántico', region: 'Europa del Noroeste y Archipiélago Británico' },
  { nombre: 'Nórdico / Escandinavo', region: 'Península Escandinava (Europa del Norte)' },
  { nombre: 'Mediterráneo Oriental / Greco-Romano', region: 'Cuenca del Mar Mediterráneo' },
  { nombre: 'Levantino / Árabe', region: 'Creciente Fértil y Oriente Próximo' },
  { nombre: 'Persa / Iranio', region: 'Meseta del Irán (Oriente Medio)' },
  { nombre: 'Bereber / Amazigh', region: 'Magreb (Norte de África)' },
  { nombre: 'Han / Asia Oriental', region: 'Llanura Central de China y Lejano Oriente' },
  { nombre: 'Yamato / Archipiélago', region: 'Islas de Japón (Asia Oriental)' },
  { nombre: 'Subcontinente Indio / Védico', region: 'Asia del Sur (Indostán)' },
  { nombre: 'Estepario / Central', region: 'Estepa Euroasiática (Mongolia / Asia Central)' }
];

export default function App() {
  const [screen, setScreen] = useState('welcome');
  const [selectedImage, setSelectedImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [resultadoAnalisis, setResultadoAnalisis] = useState(null);
  
  // Estado para el historial local
  const [historial, setHistorial] = useState([]);

  // Cargar historial al iniciar la app
  useEffect(() => {
    const datosGuardados = localStorage.getItem('etniascan_historial');
    if (datosGuardados) {
      try {
        setHistorial(JSON.parse(datosGuardados));
      } catch (e) {
        console.error("Error al cargar el historial", e);
      }
    }
  }, []);

  // Simulación del progreso y guardado automático en historial al finalizar
  useEffect(() => {
    let interval;
    if (screen === 'scanning') {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 5;
        });
      }, 40);
    }
    return () => clearInterval(interval);
  }, [screen]);

  // Manejo de la transición final y lógica de guardado
  useEffect(() => {
    if (progress === 100 && screen === 'scanning') {
      const timer = setTimeout(() => {
        setScreen('result');
        
        // Guardar de inmediato este resultado en el historial de LocalStorage
        if (resultadoAnalisis) {
          const nuevoItem = {
            id: Date.now(),
            etnia: resultadoAnalisis.principal.nombre,
            porcentaje: resultadoAnalisis.porcentajePrincipal,
            fecha: new Date().toLocaleDateString(),
            imagen: selectedImage // Almacena la URL temporal local
          };
          const nuevoHistorial = [nuevoItem, ...historial].slice(0, 5); // Guardamos sólo los últimos 5
          setHistorial(nuevoHistorial);
          localStorage.setItem('etniascan_historial', JSON.stringify(nuevoHistorial));
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [progress, screen, resultadoAnalisis]);

  const generarResultadoDinamico = () => {
    const listas = [...ETNIAS_POOL].sort(() => 0.5 - Math.random());
    const p1 = Math.floor(Math.random() * (78 - 55 + 1)) + 55;
    const p2 = Math.floor(Math.random() * (25 - 12 + 1)) + 12;
    const p3 = 100 - p1 - p2;

    setResultadoAnalisis({
      principal: listas[0],
      porcentajePrincipal: p1,
      secundario: listas[1],
      porcentajeSecundario: p2,
      terciario: listas[2],
      porcentajeTerciario: p3
    });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(URL.createObjectURL(file));
      generarResultadoDinamico();
      setScreen('scanning');
      setProgress(0);
    }
  };

  const resetApp = () => {
    setScreen('welcome');
    setSelectedImage(null);
    setProgress(0);
    setResultadoAnalisis(null);
  };

  // Descarga con Consecutivo de Fecha y Hora para evitar duplicados
  const descargarReporte = () => {
    if (!resultadoAnalisis) return;
    
    // Generador de consecutivo temporal (Formato: YYYYMMDD_HHMMSS)
    const ahora = new Date();
    const timestamp = ahora.getFullYear() +
      String(ahora.getMonth() + 1).padStart(2, '0') +
      String(ahora.getDate()).padStart(2, '0') + '_' +
      String(ahora.getHours()).padStart(2, '0') +
      String(ahora.getMinutes()).padStart(2, '0') +
      String(ahora.getSeconds()).padStart(2, '0');

    const textoReporte = `
========================================
         ETNIASCAN LAB REPORT 2.0
========================================
ID Reporte: ES-${timestamp}
Resultado de Afinidad Morfométrica Facial

• Grupo Principal: ${resultadoAnalisis.principal.nombre} (${resultadoAnalisis.porcentajePrincipal}%)
  Región: ${resultadoAnalisis.principal.region}
• Vector Secundario: ${resultadoAnalisis.secundario.nombre} (${resultadoAnalisis.porcentajeSecundario}%)
• Otros Vectores: ${resultadoAnalisis.terciario.nombre} (${resultadoAnalisis.porcentajeTerciario}%)

----------------------------------------
Morfología recreativa matemática calculada de forma local.
© 2026 EtniaScan Lab.
========================================
    `.trim();

    const blob = new Blob([textoReporte], { type: 'text/plain' });
    const elemento = document.createElement('a');
    elemento.href = URL.createObjectURL(blob);
    
    // Nombre único del archivo usando el consecutivo
    const etniaLimpia = resultadoAnalisis.principal.nombre.replace(/ \/ .*/, '').trim();
    elemento.download = `EtniaScan_Reporte_${etniaLimpia}_${timestamp}.txt`;
    
    document.body.appendChild(elemento);
    elemento.click();
    document.body.removeChild(elemento);
  };

  const limpiarHistorial = () => {
    localStorage.removeItem('etniascan_historial');
    setHistorial([]);
  };

  return (
    <div className="min-h-screen w-full bg-oscuro-200 text-arena-light font-sans flex flex-col justify-between selection:bg-cobre selection:text-white transition-colors duration-500">
      
      {/* HEADER */}
      <header className="border-b border-oscuro-50 bg-oscuro/40 backdrop-blur-md px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div>
          <h1 className="text-2xl font-display font-bold tracking-wider text-cobre">
            Etnia<span className="text-arena font-sans font-light">Scan</span>
          </h1>
          <p className="text-[10px] tracking-[0.2em] text-arena-dark font-mono uppercase mt-0.5">
            {screen === 'welcome' && 'Bienvenida'}
            {screen === 'scanning' && 'Paso 1: Análisis'}
            {screen === 'result' && 'Paso 2: Reporte'}
          </p>
        </div>
        <button 
          onClick={resetApp}
          className="px-5 py-2 rounded-full text-sm font-medium bg-oscuro-50 text-arena hover:bg-cobre hover:text-white transition-all duration-300 border border-oscuro/50 shadow-sm"
        >
          Inicio
        </button>
      </header>

      {/* CONTENIDO CENTRAL */}
      <main className="flex-1 w-full flex flex-col items-center justify-center px-4 py-12 max-w-3xl mx-auto">
        
        {/* 1. PANTALLA DE BIENVENIDA + HISTORIAL LOCAL */}
        {screen === 'welcome' && (
          <div className="text-center space-y-12 w-full">
            <div className="space-y-8">
              <div className="relative inline-flex items-center justify-center">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-cobre/20 to-oscuro-50 border border-cobre/30 flex items-center justify-center shadow-2xl">
                  <span className="text-3xl font-display font-bold text-cobre tracking-tighter">ES</span>
                </div>
                <div className="absolute -inset-1 rounded-full bg-cobre/10 blur-xl animate-pulse"></div>
              </div>

              <div className="space-y-3">
                <span className="text-xs font-mono tracking-[0.3em] text-cobre uppercase block font-semibold">Sistema Activo</span>
                <h2 className="text-4xl md:text-5xl font-display font-extrabold tracking-tight bg-gradient-to-r from-arena-light via-cobre-light to-arena-dark bg-clip-text text-transparent">
                  EtniaScan
                </h2>
                <p className="text-arena-dark text-base md:text-lg max-w-xl mx-auto leading-relaxed font-light">
                  Descubre y documenta la afinidad geométrica facial de tu herencia cultural con nuestro motor bio-morfométrico 2.0.
                </p>
              </div>

              <div className="pt-4">
                <label className="cursor-pointer inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-cobre to-cobre-dark hover:from-cobre-light hover:to-cobre text-white font-medium rounded-xl shadow-lg shadow-oscuro-200/50 transition-all duration-300 hover:-translate-y-0.5 transform border border-cobre/30 group">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-arena group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  <span>Subir Foto para Analizar</span>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              </div>
            </div>

            {/* SECCIÓN DEL HISTORIAL LOCAL */}
            {historial.length > 0 && (
              <div className="w-full max-w-xl mx-auto pt-8 border-t border-oscuro-50/60 space-y-4 text-left">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-mono tracking-wider text-arena-dark uppercase font-semibold">Análisis Recientes (Caché Local)</h4>
                  <button onClick={limpiarHistorial} className="text-[10px] text-red-400/70 hover:text-red-400 font-mono transition-colors uppercase">Limpiar</button>
                </div>
                <div className="space-y-2">
                  {historial.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-oscuro/40 border border-oscuro-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden border border-oscuro-50 bg-stone-800 shrink-0">
                          {item.imagen ? (
                            <img src={item.imagen} alt="" className="w-full h-full object-cover grayscale" />
                          ) : (
                            <div className="w-full h-full bg-cobre/10" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-display font-medium text-arena">{item.etnia}</p>
                          <p className="text-[10px] font-mono text-arena-dark">{item.fecha}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-mono font-bold text-cobre">{item.porcentaje}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 2. PANTALLA DE ESCANEO ACTIVO (ANIMACIÓN AVANZADA) */}
        {screen === 'scanning' && (
          <div className="w-full max-w-sm flex flex-col items-center space-y-6">
            <h3 className="text-xl font-display text-cobre-light font-semibold tracking-wide animate-pulse">
              Analizando Estructura Facial...
            </h3>
            
            {/* Contenedor del rostro con efectos avanzados de matriz cibernética */}
            <div className="relative w-72 h-96 rounded-2xl overflow-hidden border-2 border-cobre/30 bg-oscuro-100 shadow-2xl flex items-center justify-center">
              {selectedImage && (
                <img 
                  src={selectedImage} 
                  alt="Rostro en análisis" 
                  className="w-full h-full object-cover opacity-60 filter grayscale contrast-125 sepia brightness-90 animate-pulse transition-all duration-300"
                  style={{ filter: 'grayscale(100%) sepia(50%) hue-rotate(15deg) contrast(140%)' }}
                />
              )}
              {/* Línea Láser */}
              <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cobre-light to-transparent shadow-[0_0_20px_#B87333] animate-scan" />
              {/* Malla de superposición cibernética */}
              <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(184,115,51,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(184,115,51,0.15)_1px,transparent_1px)] [background-size:20px_20px]"></div>
              <div className="absolute inset-0 bg-gradient-to-b from-cobre/5 via-transparent to-cobre/10 animate-pulse" />
            </div>

            <div className="w-full bg-oscuro-100 rounded-full h-2.5 border border-oscuro-50 overflow-hidden">
              <div className="bg-gradient-to-r from-cobre to-cobre-light h-full transition-all duration-100 ease-out" style={{ width: `${progress}%` }} />
            </div>
            <span className="font-mono text-xs text-arena-dark tracking-widest uppercase">{progress}% Completado</span>
          </div>
        )}

        {/* 3. PANTALLA DE RESULTADOS */}
        {screen === 'result' && resultadoAnalisis && (
          <div className="w-full max-w-xl bg-oscuro/60 border border-oscuro-50 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl backdrop-blur-sm">
            <div className="text-center space-y-1">
              <span className="text-xs font-mono tracking-widest text-emerald-500 uppercase font-semibold">Análisis Exitoso</span>
              <h3 className="text-2xl font-display font-bold text-arena-light">Afinidad Morfométrica</h3>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 items-center border-b border-oscuro-50 pb-6">
              <div className="w-28 h-28 rounded-2xl overflow-hidden border border-oscuro-50 shadow-md shrink-0">
                <img src={selectedImage} alt="Miniatura" className="w-full h-full object-cover" />
              </div>
              <div className="space-y-2 text-center sm:text-left">
                <p className="text-xs uppercase tracking-widest text-arena-dark font-mono">Región Mayoritaria Detectada</p>
                <p className="text-3xl font-display font-bold text-cobre">{resultadoAnalisis.principal.nombre}</p>
                <p className="text-xs text-arena-dark leading-relaxed font-light">
                  Morfología craneofacial compatible con los vectores demográficos de la región: <span className="text-arena font-medium">{resultadoAnalisis.principal.region}</span>.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-mono tracking-wider text-arena-dark uppercase font-semibold">Desglose Estadístico</h4>
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-arena">{resultadoAnalisis.principal.nombre}</span>
                    <span className="text-cobre font-bold">{resultadoAnalisis.porcentajePrincipal}%</span>
                  </div>
                  <div className="w-full bg-oscuro-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-cobre h-full rounded-full transition-all duration-700 ease-out" style={{ width: `${resultadoAnalisis.porcentajePrincipal}%` }}></div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-arena-dark">{resultadoAnalisis.secundario.nombre}</span>
                    <span className="text-arena">{resultadoAnalisis.porcentajeSecundario}%</span>
                  </div>
                  <div className="w-full bg-oscuro-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-arena-dark h-full rounded-full transition-all duration-700 ease-out" style={{ width: `${resultadoAnalisis.porcentajeSecundario}%` }}></div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-arena-dark">{resultadoAnalisis.terciario.nombre}</span>
                    <span className="text-arena-dark">{resultadoAnalisis.porcentajeTerciario}%</span>
                  </div>
                  <div className="w-full bg-oscuro-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-oscuro-50 h-full rounded-full transition-all duration-700 ease-out" style={{ width: `${resultadoAnalisis.porcentajeTerciario}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-oscuro-100/50 rounded-xl border border-oscuro-50 text-center">
              <p className="text-[11px] text-arena-dark/80  leading-relaxed font-mono">
                Este reporte es meramente orientativo y estadístico basado en morfología recreativa matemática local. No posee validez legal ni funciona como estudio clínico molecular de ancestros.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button 
                onClick={resetApp}
                className="flex-1 py-3.5 bg-cobre text-white hover:bg-cobre-dark font-medium rounded-xl transition-all duration-200 text-sm tracking-wide shadow-md"
              >
                Volver a empezar
              </button>
              <button 
                onClick={descargarReporte}
                className="flex-1 py-3.5 bg-transparent text-arena hover:text-white hover:bg-oscuro-50 font-medium rounded-xl transition-all duration-200 text-sm tracking-wide border border-oscuro-50"
              >
                Descargar Reporte Oficial
              </button>
            </div>
          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="border-t border-oscuro-50 px-6 py-4 text-center text-[10px] font-mono text-arena-dark tracking-widest uppercase bg-oscuro-100/20">
        © 2026 EtniaScan Lab
      </footer>
    </div>
  );
}