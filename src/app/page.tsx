'use client';

import { useMemo, useState } from 'react';
import {
  MENDOZA_ABP_2026_MANDATORY_POINTS,
  MendozaABP2026MandatoryPointKey,
  MendozaABPHeaderKey,
  validarMendozaABP2026,
} from '../lib/mendoza-abp-logic';

type HeaderFormState = Record<MendozaABPHeaderKey, string>;
type MandatoryPointsFormState = Record<MendozaABP2026MandatoryPointKey, boolean>;

interface ABPGenerado {
  titulo: string;
  preguntaGuia: string;
  productoFinal: { nombre: string; descripcion: string; audiencia: string };
  fundamentacion: string;
  saberesDCP: string[];
  capacidades: string[];
  secuencias: Array<{
    mes: string;
    titulo: string;
    objetivo: string;
    actividades: string[];
    fluidezLectora: string;
    matematica50: string;
    evidencia: string;
  }>;
  articulacionTerritorial: string;
  rubrica: Array<{
    capacidad: string;
    indicadorLogrado: string;
    indicadorEnProceso: string;
    indicadorInicial: string;
  }>;
  promptMaestro: string;
}

const headerInitialState: HeaderFormState = {
  Escuela: '',
  'Ciclo 2026': 'Ciclo 2026',
  Docente: '',
  Grado: '',
  Turno: '',
};

const mandatoryInitialState: MandatoryPointsFormState = (
  Object.keys(MENDOZA_ABP_2026_MANDATORY_POINTS) as MendozaABP2026MandatoryPointKey[]
).reduce((acc, key) => {
  acc[key] = false;
  return acc;
}, {} as MandatoryPointsFormState);

function Spinner() {
  return (
    <div className="spinner">
      <div style={{position:'relative',width:48,height:48}}>
        <div style={{position:'absolute',inset:0,borderRadius:'50%',border:'2px solid rgba(16,185,129,0.2)'}} />
        <div style={{position:'absolute',inset:0,borderRadius:'50%',border:'2px solid transparent',borderTopColor:'#34d399',animation:'spin 1s linear infinite'}} />
      </div>
      <div style={{textAlign:'center'}}>
        <p style={{fontSize:'0.875rem',fontWeight:500,color:'#e2e8f0'}}>Generando el ABP completo…</p>
        <p style={{fontSize:'0.75rem',color:'#64748b',marginTop:4}}>La IA está diseñando las secuencias, rúbrica y prompt maestro</p>
      </div>
    </div>
  );
}

function ResultadoABP({ abp, headers, puntaje }: { abp: ABPGenerado; headers: HeaderFormState; puntaje: number }) {
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [activeTab, setActiveTab] = useState<'proyecto' | 'secuencias' | 'rubrica' | 'prompt'>('proyecto');

  const copyPrompt = () => {
    navigator.clipboard.writeText(abp.promptMaestro);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  return (
    <div style={{marginTop:'2rem'}}>
      {/* Header resultado */}
      <div className="result-header" style={{marginBottom:'1rem'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:'1rem',flexWrap:'wrap'}}>
          <div style={{flex:1}}>
            <div style={{display:'flex',gap:'0.5rem',flexWrap:'wrap',marginBottom:'0.75rem'}}>
              <span className="tag-emerald">ABP VÁLIDO</span>
              <span className="tag-sky">Puntaje {puntaje}%</span>
              <span className="tag-emerald">Ciclo 2026</span>
            </div>
            <h2 style={{fontSize:'1.25rem',fontWeight:600,color:'#f8fafc',marginBottom:'0.5rem'}}>{abp.titulo}</h2>
            <p style={{fontSize:'0.875rem',fontStyle:'italic',color:'rgba(110,231,183,0.8)',marginBottom:'0.75rem'}}>"{abp.preguntaGuia}"</p>
            <div style={{display:'flex',flexWrap:'wrap',gap:'1rem',fontSize:'0.75rem',color:'#64748b'}}>
              {headers.Escuela && <span><span style={{color:'#475569'}}>Escuela </span>{headers.Escuela}</span>}
              {headers.Docente && <span><span style={{color:'#475569'}}>Docente </span>{headers.Docente}</span>}
              {headers.Grado && <span><span style={{color:'#475569'}}>Grado </span>{headers.Grado}</span>}
              {headers.Turno && <span><span style={{color:'#475569'}}>Turno </span>{headers.Turno}</span>}
            </div>
          </div>
          <div className="score-circle">{puntaje}%</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        {(['proyecto','secuencias','rubrica','prompt'] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={activeTab === tab ? 'tab tab-active' : 'tab'}>
            {tab === 'proyecto' ? 'Proyecto' : tab === 'secuencias' ? '3 Secuencias' : tab === 'rubrica' ? 'Rúbrica' : 'Prompt Maestro'}
          </button>
        ))}
      </div>

      {/* Proyecto */}
      {activeTab === 'proyecto' && (
        <div>
          <div className="card">
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'0.5rem'}}>
              <p className="section-title">Producto público</p>
              <span className="tag-emerald">Impacto comunitario</span>
            </div>
            <p style={{fontSize:'0.75rem',color:'#64748b',marginBottom:'0.75rem'}}>{abp.productoFinal.audiencia}</p>
            <p style={{fontSize:'0.875rem',fontWeight:600,color:'#f1f5f9',marginBottom:'0.5rem'}}>{abp.productoFinal.nombre}</p>
            <p style={{fontSize:'0.875rem',color:'#cbd5e1',lineHeight:1.6}}>{abp.productoFinal.descripcion}</p>
          </div>
          <div className="card">
            <p className="section-title">Fundamentación pedagógica</p>
            <p style={{fontSize:'0.875rem',color:'#cbd5e1',lineHeight:1.6,marginTop:'0.75rem'}}>{abp.fundamentacion}</p>
          </div>
          <div className="grid-2">
            <div className="card">
              <p className="section-title">Saberes DCP Mendoza 2026</p>
              <ul style={{marginTop:'0.75rem'}}>
                {abp.saberesDCP.map((s, i) => (
                  <li key={i} style={{display:'flex',gap:'0.5rem',marginBottom:'0.5rem',fontSize:'0.875rem',color:'#cbd5e1'}}>
                    <span style={{minWidth:20,height:20,borderRadius:'50%',background:'rgba(16,185,129,0.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:700,color:'#6ee7b7'}}>{i+1}</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="card">
              <p className="section-title">Capacidades a evaluar</p>
              <ul style={{marginTop:'0.75rem'}}>
                {abp.capacidades.map((c, i) => (
                  <li key={i} style={{display:'flex',gap:'0.5rem',marginBottom:'0.5rem',fontSize:'0.875rem',color:'#cbd5e1'}}>
                    <span style={{minWidth:20,height:20,borderRadius:'50%',background:'rgba(14,165,233,0.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:700,color:'#7dd3fc'}}>{i+1}</span>
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="card">
            <p className="section-title">Articulación con el territorio</p>
            <p style={{fontSize:'0.875rem',color:'#cbd5e1',lineHeight:1.6,marginTop:'0.75rem'}}>{abp.articulacionTerritorial}</p>
          </div>
        </div>
      )}

      {/* Secuencias */}
      {activeTab === 'secuencias' && (
        <div>
          {abp.secuencias.map((seq, i) => (
            <div key={i} className="card">
              <div style={{display:'flex',alignItems:'center',gap:'0.5rem',marginBottom:'0.5rem'}}>
                <span style={{width:24,height:24,borderRadius:'50%',background:'rgba(16,185,129,0.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:700,color:'#6ee7b7'}}>{i+1}</span>
                <p className="section-title" style={{margin:0}}>{seq.mes}</p>
              </div>
              <p style={{fontSize:'0.875rem',fontWeight:600,color:'#f1f5f9',marginBottom:'0.25rem'}}>{seq.titulo}</p>
              <p style={{fontSize:'0.75rem',color:'#64748b',marginBottom:'0.75rem'}}>{seq.objetivo}</p>
              <ul style={{marginBottom:'0.75rem'}}>
                {seq.actividades.map((a, j) => (
                  <li key={j} style={{display:'flex',gap:'0.5rem',marginBottom:'0.375rem',fontSize:'0.875rem',color:'#cbd5e1'}}>
                    <span style={{marginTop:6,minWidth:6,height:6,borderRadius:'50%',background:'rgba(52,211,153,0.6)'}} />
                    {a}
                  </li>
                ))}
              </ul>
              <div className="grid-2">
                <div style={{background:'rgba(6,78,59,0.3)',border:'1px solid rgba(16,185,129,0.2)',borderRadius:'0.75rem',padding:'0.75rem'}}>
                  <p style={{fontSize:10,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.1em',color:'#34d399',marginBottom:'0.5rem'}}>Fluidez Lectora</p>
                  <p style={{fontSize:'0.75rem',color:'#cbd5e1',lineHeight:1.5}}>{seq.fluidezLectora}</p>
                </div>
                <div style={{background:'rgba(7,89,133,0.3)',border:'1px solid rgba(14,165,233,0.2)',borderRadius:'0.75rem',padding:'0.75rem'}}>
                  <p style={{fontSize:10,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.1em',color:'#38bdf8',marginBottom:'0.5rem'}}>Matemática 5.0</p>
                  <p style={{fontSize:'0.75rem',color:'#cbd5e1',lineHeight:1.5}}>{seq.matematica50}</p>
                </div>
              </div>
              <div style={{background:'rgba(15,23,42,0.4)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'0.75rem',padding:'0.75rem',marginTop:'0.75rem'}}>
                <p style={{fontSize:10,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.1em',color:'#64748b',marginBottom:'0.5rem'}}>Evidencia del alumno</p>
                <p style={{fontSize:'0.75rem',color:'#cbd5e1',lineHeight:1.5}}>{seq.evidencia}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Rúbrica */}
      {activeTab === 'rubrica' && (
        <div>
          {abp.rubrica.map((r, i) => (
            <div key={i} className="card">
              <p style={{fontSize:'0.875rem',fontWeight:600,color:'#f1f5f9',marginBottom:'0.75rem'}}>{r.capacidad}</p>
              <div className="grid-2" style={{gridTemplateColumns:'1fr 1fr 1fr'}}>
                <div style={{background:'rgba(6,78,59,0.2)',border:'1px solid rgba(16,185,129,0.2)',borderRadius:'0.75rem',padding:'0.75rem'}}>
                  <p style={{fontSize:10,fontWeight:700,textTransform:'uppercase',color:'#34d399',marginBottom:'0.5rem'}}>Logrado</p>
                  <p style={{fontSize:'0.75rem',color:'#cbd5e1',lineHeight:1.5}}>{r.indicadorLogrado}</p>
                </div>
                <div style={{background:'rgba(78,52,6,0.2)',border:'1px solid rgba(245,158,11,0.2)',borderRadius:'0.75rem',padding:'0.75rem'}}>
                  <p style={{fontSize:10,fontWeight:700,textTransform:'uppercase',color:'#fbbf24',marginBottom:'0.5rem'}}>En proceso</p>
                  <p style={{fontSize:'0.75rem',color:'#cbd5e1',lineHeight:1.5}}>{r.indicadorEnProceso}</p>
                </div>
                <div style={{background:'rgba(15,23,42,0.4)',border:'1px solid rgba(100,116,139,0.3)',borderRadius:'0.75rem',padding:'0.75rem'}}>
                  <p style={{fontSize:10,fontWeight:700,textTransform:'uppercase',color:'#94a3b8',marginBottom:'0.5rem'}}>Inicial</p>
                  <p style={{fontSize:'0.75rem',color:'#cbd5e1',lineHeight:1.5}}>{r.indicadorInicial}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Prompt Maestro */}
      {activeTab === 'prompt' && (
        <div className="card">
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'1rem'}}>
            <div>
              <p className="section-title">Prompt Maestro</p>
              <p style={{fontSize:'0.75rem',color:'#64748b',marginTop:'0.25rem'}}>Copiá este prompt y pegalo en cualquier IA para expandir el proyecto.</p>
            </div>
            <button onClick={copyPrompt} style={{padding:'0.375rem 0.75rem',borderRadius:'0.75rem',fontSize:'0.75rem',fontWeight:600,cursor:'pointer',border:'1px solid rgba(255,255,255,0.1)',background: copiedPrompt ? '#10b981' : '#1e293b',color: copiedPrompt ? '#020617' : '#e2e8f0'}}>
              {copiedPrompt ? '✓ Copiado' : 'Copiar'}
            </button>
          </div>
          <pre>{abp.promptMaestro}</pre>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const [headers, setHeaders] = useState<HeaderFormState>(headerInitialState);
  const [mandatoryPoints, setMandatoryPoints] = useState<MandatoryPointsFormState>(mandatoryInitialState);
  const [situacionProblema, setSituacionProblema] = useState('');
  const [abpGenerado, setAbpGenerado] = useState<ABPGenerado | null>(null);
  const [puntajeLocal, setPuntajeLocal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tieneFluidez = mandatoryPoints.fluidezLectora;
  const tieneMatematica = mandatoryPoints.matematicaCincoPuntoCero;
  const botonBloqueado = !tieneFluidez || !tieneMatematica || !situacionProblema.trim();

  const advertenciaClave = useMemo(() => {
    if (!tieneFluidez && !tieneMatematica) return 'Debe seleccionar Fluidez Lectora y Matemática 5.0 para habilitar la generación.';
    if (!tieneFluidez) return 'Debe seleccionar Fluidez Lectora para habilitar la generación del ABP.';
    if (!tieneMatematica) return 'Debe seleccionar Matemática 5.0 (Matific) para habilitar la generación del ABP.';
    if (!situacionProblema.trim()) return 'Debe redactar la situación problema para habilitar la generación.';
    return null;
  }, [tieneFluidez, tieneMatematica, situacionProblema]);

  const situacionProblemaEsPregunta = situacionProblema.trim().length > 0 && /[¿?]\s*$/.test(situacionProblema.trim());

  const onHeaderChange = (key: MendozaABPHeaderKey, value: string) => setHeaders((prev) => ({ ...prev, [key]: value }));
  const onToggleMandatoryPoint = (key: MendozaABP2026MandatoryPointKey) => setMandatoryPoints((prev) => ({ ...prev, [key]: !prev[key] }));

  const onSubmit = async () => {
    const resultado = validarMendozaABP2026({ headers, mandatoryPoints });
    setPuntajeLocal(resultado.puntaje);
    setLoading(true);
    setError(null);
    setAbpGenerado(null);
    try {
      const res = await fetch('/api/generar-abp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ headers, situacionProblema, mandatoryPoints }),
      });
      const data = await res.json();
      if (!res.ok || data.error) { setError(data.error ?? 'Error desconocido.'); return; }
      setAbpGenerado(data.abp);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{minHeight:'100vh'}}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
      <div className="container">
        {/* Header */}
        <div className="header">
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:'1rem'}}>
            <div>
              <p style={{fontSize:'0.75rem',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.2em',color:'rgba(52,211,153,0.8)'}}>Mendoza · DGE</p>
              <h1>Diseño de Proyecto ABP · Ciclo 2026</h1>
              <p style={{marginTop:'0.25rem',maxWidth:560}}>Complete los datos institucionales, seleccione los 10 puntos obligatorios de DGE y redacte la situación problema.</p>
            </div>
            <div className="badge">
              <span className="badge-dot" />
              Ciclo 2026 · ABP Mendoza
            </div>
          </div>
        </div>

        {/* Main grid */}
        <div className="main-grid">
          {/* Columna izquierda */}
          <div>
            <div className="card">
              <p className="section-title">Encabezado institucional</p>
              <p style={{fontSize:'0.75rem',color:'#64748b',marginBottom:'1rem'}}>Estos datos se imprimen en la carátula del proyecto ABP.</p>
              <div className="grid-2">
                {(['Escuela','Docente','Grado','Turno'] as MendozaABPHeaderKey[]).map((field) => (
                  <div key={field}>
                    <label>{field}</label>
                    <input className="input" placeholder={field === 'Escuela' ? 'Escuela Nº, nombre completo' : field === 'Docente' ? 'Apellido y nombre' : field === 'Grado' ? 'Ej: 5º A' : 'Mañana / Tarde / Vespertino'}
                      value={headers[field]} onChange={(e) => onHeaderChange(field, e.target.value)} />
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'0.75rem'}}>
                <div>
                  <p className="section-title">Situación problema</p>
                  <p style={{fontSize:'0.75rem',color:'#64748b'}}>Debe estar redactada en formato de pregunta guía desafiante.</p>
                </div>
                <span style={{padding:'0.25rem 0.75rem',borderRadius:9999,fontSize:10,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.15em',background: situacionProblemaEsPregunta ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.1)',color: situacionProblemaEsPregunta ? '#d1fae5' : '#fde68a',border: `1px solid ${situacionProblemaEsPregunta ? 'rgba(52,211,153,0.4)' : 'rgba(245,158,11,0.4)'}`,whiteSpace:'nowrap'}}>
                  {situacionProblemaEsPregunta ? 'Formato correcto ✓' : 'Debe finalizar con "?"'}
                </span>
              </div>
              <textarea className="input textarea" placeholder="¿Cómo podríamos…?" value={situacionProblema} onChange={(e) => setSituacionProblema(e.target.value)} />
              <p style={{fontSize:'0.6875rem',color:'#64748b',marginTop:'0.5rem'}}>Sugerencia: comience con "¿Cómo podríamos…?" o "¿De qué manera…?"</p>
            </div>
          </div>

          {/* Columna derecha */}
          <div>
            <div className="card">
              <p className="section-title">Puntos obligatorios DGE (10)</p>
              <p style={{fontSize:'0.75rem',color:'#64748b',marginBottom:'1rem'}}>Seleccione los criterios según el documento oficial de la DGE.</p>
              {(Object.keys(MENDOZA_ABP_2026_MANDATORY_POINTS) as MendozaABP2026MandatoryPointKey[]).map((key) => {
                const label = MENDOZA_ABP_2026_MANDATORY_POINTS[key];
                const isCritical = key === 'fluidezLectora' || key === 'matematicaCincoPuntoCero';
                const checked = mandatoryPoints[key];
                return (
                  <label key={key} className={isCritical ? 'checkbox-item checkbox-critical' : 'checkbox-item'}>
                    <input type="checkbox" style={{marginTop:2,width:16,height:16,cursor:'pointer'}} checked={checked} onChange={() => onToggleMandatoryPoint(key)} />
                    <span style={{flex:1}}>
                      <span style={{display:'flex',alignItems:'center',gap:'0.5rem',flexWrap:'wrap'}}>
                        <span style={{fontSize:'0.75rem',fontWeight:500,color:'#f1f5f9'}}>{label}</span>
                        {isCritical && <span className="tag-emerald">Obligatorio</span>}
                      </span>
                      {isCritical && <span style={{display:'block',fontSize:'0.6875rem',color:'rgba(167,243,208,0.9)',marginTop:2}}>Sin este criterio el proyecto se marca como inválido.</span>}
                    </span>
                  </label>
                );
              })}
            </div>

            <div style={{marginTop:'1rem'}}>
              {advertenciaClave && (
                <div className="warning" style={{marginBottom:'0.75rem'}}>
                  <div style={{display:'flex',gap:'0.5rem',alignItems:'flex-start'}}>
                    <span style={{marginTop:3,minWidth:8,height:8,borderRadius:'50%',background:'#fcd34d'}} />
                    <p style={{color:'#fde68a',fontSize:'0.75rem'}}>{advertenciaClave}</p>
                  </div>
                </div>
              )}
              <button type="button" disabled={botonBloqueado || loading} onClick={onSubmit}
                className={botonBloqueado || loading ? 'btn btn-disabled' : 'btn btn-primary'}>
                {loading ? (
                  <>
                    <svg style={{width:16,height:16,animation:'spin 1s linear infinite'}} fill="none" viewBox="0 0 24 24">
                      <circle style={{opacity:0.25}} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path style={{opacity:0.75}} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Generando ABP…
                  </>
                ) : 'Generar ABP con IA'}
              </button>
              {error && (
                <div className="error" style={{marginTop:'0.75rem'}}>
                  <p style={{fontWeight:600,marginBottom:'0.25rem'}}>Error al generar</p>
                  <p style={{opacity:0.8}}>{error}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {loading && <Spinner />}
        {abpGenerado && !loading && <ResultadoABP abp={abpGenerado} headers={headers} puntaje={puntajeLocal} />}
      </div>
    </div>
  );
}