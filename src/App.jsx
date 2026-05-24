import { useEffect, useRef, useState } from 'react'

const INPUT_IMAGEN_ID = 'etnia-input-imagen'
const TIPOS_IMAGEN_ACEPTADOS =
  'image/jpeg,image/png,image/webp,image/gif,.jpg,.jpeg,.png,.webp,.gif'

const CLASES_BTN_PRIMARIO =
  'inline-flex min-h-12 w-full items-center justify-center rounded-full bg-cobre px-6 py-4 text-base font-semibold text-oscuro-100 transition hover:bg-cobre-light focus:outline-none focus-visible:ring-2 focus-visible:ring-cobre-light focus-visible:ring-offset-2 focus-visible:ring-offset-oscuro disabled:cursor-not-allowed disabled:opacity-40 sm:min-h-11 sm:w-auto sm:px-8 sm:py-3.5'

const CLASES_BTN_SECUNDARIO =
  'inline-flex min-h-12 w-full items-center justify-center rounded-full border border-arena-dark/50 bg-transparent px-6 py-4 text-base font-medium text-arena transition hover:border-arena hover:bg-arena/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-arena focus-visible:ring-offset-2 focus-visible:ring-offset-oscuro disabled:cursor-not-allowed disabled:opacity-40 sm:min-h-11 sm:w-auto sm:px-8 sm:py-3.5'

const CLASES_CONTENEDOR_PANTALLA =
  'relative z-10 w-full min-w-0 max-w-md md:max-w-xl lg:max-w-2xl'

const ENLACE_REPORTE_DEMO = 'https://etniascan.app/reporte/demo-7f3a9c2e'

const NODOS_ESCANEO = [
  { id: 'frente', top: '20%', left: '50%', retraso: '0ms' },
  { id: 'nariz', top: '48%', left: '50%', retraso: '400ms' },
  { id: 'menton', top: '76%', left: '50%', retraso: '800ms' },
  { id: 'oreja', top: '44%', left: '24%', retraso: '200ms' },
  { id: 'mandibula', top: '62%', left: '74%', retraso: '600ms' },
]

const RESULTADOS = [
  {
    porcentaje: 58,
    titulo: 'Similitud Altiplano Central',
    subtitulo: 'Herencia Tolteca / Otomí',
    detalle: 'Frente amplia, puente nasal recto',
  },
  {
    porcentaje: 25,
    titulo: 'Similitud Purépecha',
    subtitulo: 'Región de Michoacán',
    detalle: 'Mandíbula robusta y mentón fuerte',
  },
  {
    porcentaje: 17,
    titulo: 'Similitud Mixteca',
    subtitulo: 'Región de Oaxaca',
    detalle: 'Anchura de base craneal',
  },
]

function FondoDecorativo() {
  return (
    <>
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cobre-muted via-transparent to-transparent"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-32 left-1/2 h-48 w-full max-w-3xl -translate-x-1/2 rounded-full bg-arena/5 blur-3xl md:h-64"
        aria-hidden="true"
      />
    </>
  )
}

function ModalInformativo({ abierto, onCerrar }) {
  useEffect(() => {
    if (!abierto) return
    const onEscape = (e) => {
      if (e.key === 'Escape') onCerrar()
    }
    document.addEventListener('keydown', onEscape)
    return () => document.removeEventListener('keydown', onEscape)
  }, [abierto, onCerrar])

  if (!abierto) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-info-titulo"
    >
      <button
        type="button"
        className="absolute inset-0 bg-oscuro-200/80 backdrop-blur-sm"
        aria-label="Cerrar información"
        onClick={onCerrar}
      />

      <div className="relative z-10 max-h-[min(90vh,640px)] w-full max-w-md overflow-y-auto rounded-2xl border border-cobre/35 bg-oscuro-50 p-5 shadow-2xl shadow-oscuro-200/60 sm:max-w-lg sm:p-8">
        <button
          type="button"
          onClick={onCerrar}
          className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full border border-arena-dark/30 text-arena-dark transition hover:border-cobre/50 hover:bg-cobre-muted hover:text-arena-light focus:outline-none focus-visible:ring-2 focus-visible:ring-cobre sm:right-4 sm:top-4"
          aria-label="Cerrar"
        >
          <span className="text-xl leading-none" aria-hidden="true">
            ×
          </span>
        </button>

        <p className="text-xs font-medium uppercase tracking-[0.3em] text-cobre-light">
          Acerca de EtniaScan
        </p>
        <h2
          id="modal-info-titulo"
          className="mt-2 pr-10 font-display text-xl text-arena-light sm:pr-8 sm:text-2xl"
        >
          Morfometría facial
        </h2>

        <div className="mt-5 space-y-4 text-left text-sm leading-relaxed text-arena-muted">
          <p>
            EtniaScan utiliza un enfoque de{' '}
            <strong className="font-medium text-arena">morfometría facial</strong>:
            medimos proporciones y relaciones geométricas entre puntos clave del
            rostro —frente, puente nasal, mandíbula, base craneal— y las
            comparamos con patrones documentados en distintas regiones de
            Mesoamérica.
          </p>
          <p>
            El objetivo no es etiquetar identidad, sino ofrecer una lectura
            orientativa del parecido visual con rasgos asociados a herencias
            culturales y antropológicas, como base para reflexionar sobre tu
            legado y el de tu comunidad.
          </p>
          <p className="text-xs text-arena-dark">
            Los porcentajes son estimaciones geométricas, no diagnósticos
            genéticos ni certificaciones étnicas.
          </p>
        </div>

        <button type="button" onClick={onCerrar} className={`mt-8 ${CLASES_BTN_PRIMARIO}`}>
          Entendido
        </button>
      </div>
    </div>
  )
}

function PantallaInicio({ onComenzar, onSaberMas }) {
  return (
    <main
      className={`${CLASES_CONTENEDOR_PANTALLA} flex flex-col items-center text-center`}
    >
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-cobre/40 bg-cobre-muted shadow-lg shadow-oscuro-200/50 sm:mb-8 sm:h-20 sm:w-20">
        <span
          className="font-display text-2xl text-cobre-light sm:text-3xl"
          aria-hidden="true"
        >
          ES
        </span>
      </div>

      <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-cobre-light sm:mb-3 sm:text-sm sm:tracking-[0.35em]">
        Bienvenido
      </p>

      <h1 className="font-display text-4xl font-normal tracking-tight text-arena-light sm:text-5xl md:text-6xl">
        Etnia<span className="text-cobre">Scan</span>
      </h1>

      <p className="mt-4 max-w-sm px-1 text-base leading-relaxed text-arena-muted sm:mt-6 sm:text-lg">
        Descubre y documenta el patrimonio cultural de tu comunidad con una
        experiencia pensada para ti.
      </p>

      <div className="mt-8 flex w-full flex-col gap-3 sm:mt-10 sm:max-w-md sm:flex-row sm:justify-center sm:gap-4">
        <button type="button" onClick={onComenzar} className={CLASES_BTN_PRIMARIO}>
          Comenzar
        </button>
        <button type="button" onClick={onSaberMas} className={CLASES_BTN_SECUNDARIO}>
          Saber más
        </button>
      </div>

      <p className="mt-10 text-xs text-arena-dark sm:mt-16">
        Tu historia, tu identidad, tu legado.
      </p>
    </main>
  )
}

function IndicadorAnalizando() {
  return (
    <div
      className="mt-6 flex w-full flex-col items-center gap-2 px-2 sm:mt-8 sm:gap-3"
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        <svg
          className="h-5 w-5 animate-spin text-cobre-light"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-90"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        <p className="text-base font-medium tracking-wide text-arena-light sm:text-lg">
          Analizando
          <span className="inline-flex w-6 justify-start" aria-hidden="true">
            <span className="animate-punto-1">.</span>
            <span className="animate-punto-2">.</span>
            <span className="animate-punto-3">.</span>
          </span>
        </p>
      </div>
      <p className="text-sm text-arena-muted">
        Escaneo morfométrico en progreso
      </p>
    </div>
  )
}

function PuntoAnclaje({ top, left, retraso }) {
  return (
    <div
      className="pointer-events-none absolute z-[5] -translate-x-1/2 -translate-y-1/2"
      style={{ top, left }}
      aria-hidden="true"
    >
      <span className="relative flex h-3 w-3 sm:h-3.5 sm:w-3.5">
        <span
          className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cobre-light opacity-70"
          style={{ animationDelay: retraso }}
        />
        <span className="relative inline-flex h-3 w-3 rounded-full bg-cobre-light shadow-[0_0_8px_2px_rgba(212,146,90,0.85)] ring-2 ring-arena-light/30 sm:h-3.5 sm:w-3.5" />
      </span>
    </div>
  )
}

function VistaEscaneo({ preview, imagen }) {
  return (
    <div className="mt-6 flex w-full min-w-0 flex-col items-center sm:mt-8">
      <div className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-cobre/40 bg-oscuro-100 shadow-2xl shadow-cobre/10 ring-1 ring-cobre/20">
        <div className="relative mx-auto flex min-h-[200px] max-h-[min(50vh,320px)] w-full items-center justify-center bg-oscuro-200/50 p-3 sm:min-h-[280px] sm:max-h-[320px] sm:p-4">
          <img
            src={preview}
            alt={`Escaneando: ${imagen.name}`}
            className="max-h-[min(50vh,280px)] max-w-full object-contain sm:max-h-[280px]"
          />
          <div
            className="pointer-events-none absolute inset-4 sm:inset-6"
            aria-hidden="true"
          >
            {NODOS_ESCANEO.map((nodo) => (
              <PuntoAnclaje
                key={nodo.id}
                top={nodo.top}
                left={nodo.left}
                retraso={nodo.retraso}
              />
            ))}
          </div>
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-oscuro/30 via-transparent to-oscuro/30"
            aria-hidden="true"
          />
          <div
            className="animate-laser-scan pointer-events-none absolute left-3 right-3 z-10"
            aria-hidden="true"
          >
            <div className="h-[3px] w-full rounded-full bg-cobre-light shadow-[0_0_8px_2px_rgba(212,146,90,0.9),0_0_20px_6px_rgba(184,115,51,0.6),0_0_40px_12px_rgba(184,115,51,0.35)]" />
            <div className="mx-auto mt-1 h-8 w-[85%] bg-gradient-to-b from-cobre-light/40 to-transparent blur-sm" />
          </div>
        </div>
      </div>
      <IndicadorAnalizando />
    </div>
  )
}

function PantallaCarga({
  imagen,
  preview,
  arrastrando,
  analizando,
  inputRef,
  onSeleccionarArchivo,
  onAbrirSelector,
  onArrastrar,
  onSoltar,
  onAnalizar,
  onRegresar,
}) {
  const tieneImagen = Boolean(imagen && preview)

  return (
    <main className={`${CLASES_CONTENEDOR_PANTALLA} flex flex-col`}>
      <button
        type="button"
        onClick={onRegresar}
        className="-ml-1 mb-6 inline-flex min-h-11 items-center self-start rounded-lg px-2 py-2 text-sm font-medium text-arena-dark transition hover:text-arena focus:outline-none focus-visible:text-arena-light sm:mb-8"
      >
        ← Regresar
      </button>

      <p className="text-xs font-medium uppercase tracking-[0.2em] text-cobre-light sm:text-sm sm:tracking-[0.35em]">
        Paso 1
      </p>
      <h2 className="mt-2 font-display text-2xl text-arena-light sm:text-3xl md:text-4xl">
        Carga tu imagen
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-arena-muted sm:mt-3 sm:text-base">
        Arrastra una foto aquí o selecciónala desde tu dispositivo para iniciar
        el análisis.
      </p>

      <input
        ref={inputRef}
        id={INPUT_IMAGEN_ID}
        type="file"
        accept={TIPOS_IMAGEN_ACEPTADOS}
        className="sr-only"
        onChange={onSeleccionarArchivo}
      />

      {analizando && tieneImagen ? (
        <VistaEscaneo preview={preview} imagen={imagen} />
      ) : (
        <>
          <label
            htmlFor={INPUT_IMAGEN_ID}
            onDragEnter={(e) => onArrastrar(e, true)}
            onDragOver={(e) => onArrastrar(e, true)}
            onDragLeave={(e) => onArrastrar(e, false)}
            onDrop={onSoltar}
            className={`mt-6 flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-4 py-8 transition sm:mt-8 sm:min-h-[220px] sm:px-6 sm:py-10 ${
              arrastrando
                ? 'border-cobre bg-cobre-muted'
                : tieneImagen
                  ? 'border-cobre/50 bg-oscuro-50'
                  : 'border-arena-dark/40 bg-oscuro-50/50 hover:border-cobre/60 hover:bg-oscuro-50'
            }`}
          >
            {tieneImagen ? (
              <div className="flex w-full flex-col items-center gap-3">
                <img
                  src={preview}
                  alt={`Vista previa: ${imagen.name}`}
                  className="max-h-40 max-w-full rounded-lg object-contain shadow-lg ring-1 ring-cobre/20 sm:max-h-52"
                />
                <p className="max-w-full truncate px-2 text-center text-xs text-arena-dark">
                  {imagen.name}
                </p>
              </div>
            ) : (
              <>
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-cobre/30 bg-cobre-muted">
                  <svg
                    className="h-7 w-7 text-cobre-light"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                    />
                  </svg>
                </div>
                <p className="text-center font-medium text-arena-light">
                  Arrastra tu foto aquí
                </p>
                <p className="mt-1 text-center text-sm text-arena-dark">
                  o haz clic para abrir el explorador de archivos
                </p>
                <p className="mt-4 text-xs text-arena-dark/80">
                  Solo imágenes: JPG, PNG, WEBP o GIF
                </p>
              </>
            )}
          </label>

          {tieneImagen && (
            <button
              type="button"
              onClick={onAbrirSelector}
              className="mt-3 inline-flex min-h-11 items-center self-center px-3 py-2 text-sm text-cobre-light transition hover:text-cobre focus:outline-none"
            >
              Cambiar imagen
            </button>
          )}
        </>
      )}

      <div className="mt-8 flex w-full flex-col gap-3 sm:mt-10 sm:flex-row sm:gap-4">
        <button
          type="button"
          disabled={!tieneImagen || analizando}
          onClick={onAnalizar}
          className={`flex-1 ${CLASES_BTN_PRIMARIO}`}
        >
          {analizando ? 'Analizando…' : 'Analizar imagen'}
        </button>
        <button
          type="button"
          disabled={analizando}
          onClick={onRegresar}
          className={`sm:flex-none ${CLASES_BTN_SECUNDARIO}`}
        >
          Regresar
        </button>
      </div>
    </main>
  )
}

function BarraSimilitud({ porcentaje, destacado }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-oscuro-100">
      <div
        className={`h-full rounded-full transition-all duration-700 ease-out ${
          destacado ? 'bg-cobre-light' : 'bg-cobre/70'
        }`}
        style={{ width: `${porcentaje}%` }}
        role="progressbar"
        aria-valuenow={porcentaje}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  )
}

function PantallaResultados({ preview, onVolverEmpezar }) {
  const [toastCompartir, setToastCompartir] = useState(false)

  const onCompartir = async () => {
    try {
      await navigator.clipboard.writeText(ENLACE_REPORTE_DEMO)
    } catch {
      const area = document.createElement('textarea')
      area.value = ENLACE_REPORTE_DEMO
      area.style.position = 'fixed'
      area.style.left = '-9999px'
      document.body.appendChild(area)
      area.select()
      document.execCommand('copy')
      document.body.removeChild(area)
    }
    setToastCompartir(true)
    setTimeout(() => setToastCompartir(false), 3200)
  }

  return (
    <main className={`${CLASES_CONTENEDOR_PANTALLA} flex flex-col pb-6 sm:pb-8`}>
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-cobre-light sm:text-sm sm:tracking-[0.35em]">
        Paso 2 · Resultados
      </p>

      <header className="mt-3 border-b border-arena-dark/20 pb-4 sm:mt-4 sm:pb-6">
        <h2 className="font-display text-xl leading-snug text-arena-light sm:text-2xl md:text-3xl">
          Reporte de Afinidad Geométrica Facial
        </h2>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-arena-muted sm:mt-3">
          Análisis comparativo de rasgos faciales con patrones geométricos
          documentados en comunidades mesoamericanas.
        </p>
      </header>

      <div className="mt-6 flex min-w-0 flex-col gap-5 sm:mt-8 sm:flex-row sm:items-start sm:gap-8">
        {preview && (
          <div className="mx-auto shrink-0 sm:mx-0 sm:self-start">
            <div className="overflow-hidden rounded-xl border border-cobre/30 bg-oscuro-50 p-1 shadow-lg shadow-oscuro-200/40">
              <img
                src={preview}
                alt="Imagen analizada"
                className="h-28 w-28 object-cover sm:h-36 sm:w-36"
              />
            </div>
            <p className="mt-2 text-center text-xs text-arena-dark sm:text-left">
              Muestra analizada
            </p>
          </div>
        )}

        <div className="min-w-0 flex-1 space-y-4 sm:space-y-5">
          {RESULTADOS.map((item, index) => (
            <article
              key={item.titulo}
              className={`rounded-xl border p-4 transition sm:p-5 ${
                index === 0
                  ? 'border-cobre/40 bg-cobre-muted'
                  : 'border-arena-dark/25 bg-oscuro-50/80'
              }`}
            >
              <div className="flex items-start justify-between gap-3 sm:gap-4">
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-medium leading-snug text-arena-light sm:text-base">
                    {item.titulo}
                  </h3>
                  <p className="mt-0.5 text-xs text-cobre-light sm:text-sm">
                    {item.subtitulo}
                  </p>
                </div>
                <span
                  className={`shrink-0 font-display text-xl sm:text-2xl ${
                    index === 0 ? 'text-cobre-light' : 'text-arena'
                  }`}
                >
                  {item.porcentaje}%
                </span>
              </div>

              <div className="mt-4">
                <BarraSimilitud porcentaje={item.porcentaje} destacado={index === 0} />
              </div>

              <p className="mt-3 text-sm italic text-arena-dark">{item.detalle}</p>
            </article>
          ))}
        </div>
      </div>

      <footer className="mt-8 rounded-xl border border-arena-dark/20 bg-oscuro-50/50 px-4 py-3 sm:mt-10 sm:px-5 sm:py-4">
        <p className="text-center text-xs leading-relaxed text-arena-dark">
          Este reporte es orientativo y se basa en similitudes geométricas
          faciales. No sustituye estudios genéticos ni antropológicos formales.
        </p>
      </footer>

      <div className="mt-8 flex w-full flex-col items-stretch gap-3 sm:mt-10 sm:items-center">
        <button
          type="button"
          onClick={onVolverEmpezar}
          className={`sm:self-center ${CLASES_BTN_PRIMARIO} sm:px-12`}
        >
          Volver a empezar
        </button>
        <button
          type="button"
          onClick={onCompartir}
          className={`sm:self-center ${CLASES_BTN_SECUNDARIO} sm:min-w-[220px]`}
        >
          Compartir Reporte
        </button>
      </div>

      {toastCompartir && (
        <div
          role="status"
          aria-live="polite"
          className="animate-toast-in fixed bottom-6 left-1/2 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 rounded-xl border border-cobre/45 bg-oscuro-50 px-4 py-3.5 text-center text-sm font-medium text-arena-light shadow-xl shadow-oscuro-200/80 ring-1 ring-cobre/20"
        >
          ¡Enlace de reporte copiado al portapapeles!
        </div>
      )}
    </main>
  )
}

function App() {
  const [pantalla, setPantalla] = useState('inicio')
  const [mostrarInfo, setMostrarInfo] = useState(false)
  const [imagen, setImagen] = useState(null)
  const [preview, setPreview] = useState(null)
  const [arrastrando, setArrastrando] = useState(false)
  const [analizando, setAnalizando] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview)
    }
  }, [preview])

  const abrirSelector = () => {
    inputRef.current?.click()
  }

  const esImagenValida = (archivo) => {
    if (!archivo) return false
    if (archivo.type.startsWith('image/')) return true
    return /\.(jpe?g|png|webp|gif)$/i.test(archivo.name)
  }

  const aplicarImagen = (archivo) => {
    if (!esImagenValida(archivo)) return
    setImagen(archivo)
    setPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return URL.createObjectURL(archivo)
    })
  }

  const onSeleccionarArchivo = (e) => {
    const archivo = e.target.files?.[0]
    if (archivo) aplicarImagen(archivo)
    e.target.value = ''
  }

  const onArrastrar = (e, activo) => {
    e.preventDefault()
    e.stopPropagation()
    setArrastrando(activo)
  }

  const onSoltar = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setArrastrando(false)
    const archivo = e.dataTransfer.files?.[0]
    if (archivo) aplicarImagen(archivo)
  }

  const limpiarImagen = () => {
    setImagen(null)
    setPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return null
    })
    if (inputRef.current) inputRef.current.value = ''
  }

  const onRegresar = () => {
    setPantalla('inicio')
    setAnalizando(false)
    limpiarImagen()
  }

  const onVolverEmpezar = () => {
    setPantalla('inicio')
    setAnalizando(false)
    limpiarImagen()
  }

  const onAnalizar = () => {
    if (!imagen || !preview) return
    setAnalizando(true)
    setTimeout(() => {
      setAnalizando(false)
      setPantalla('resultados')
    }, 2000)
  }

  const centrado = pantalla === 'inicio'

  return (
    <div
      className={`relative flex min-h-screen w-full flex-col overflow-x-hidden bg-oscuro px-4 py-8 font-sans text-arena sm:px-6 sm:py-12 ${
        centrado
          ? 'items-center justify-center'
          : 'items-center justify-start pt-6 pb-10 sm:pt-16 md:pt-20'
      }`}
    >
      <FondoDecorativo />

      {pantalla === 'inicio' && (
        <PantallaInicio
          onComenzar={() => {
            setMostrarInfo(false)
            setPantalla('carga')
          }}
          onSaberMas={() => setMostrarInfo(true)}
        />
      )}

      <ModalInformativo
        abierto={pantalla === 'inicio' && mostrarInfo}
        onCerrar={() => setMostrarInfo(false)}
      />

      {pantalla === 'carga' && (
        <PantallaCarga
          imagen={imagen}
          preview={preview}
          arrastrando={arrastrando}
          analizando={analizando}
          inputRef={inputRef}
          onSeleccionarArchivo={onSeleccionarArchivo}
          onAbrirSelector={abrirSelector}
          onArrastrar={onArrastrar}
          onSoltar={onSoltar}
          onAnalizar={onAnalizar}
          onRegresar={onRegresar}
        />
      )}

      {pantalla === 'resultados' && (
        <PantallaResultados preview={preview} onVolverEmpezar={onVolverEmpezar} />
      )}
    </div>
  )
}

export default App
