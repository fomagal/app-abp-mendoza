import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

const DCP_MENDOZA_5TO = `
DISEÑO CURRICULAR PROVINCIAL MENDOZA - 5° GRADO (Resolución 3556-DGE-19)

CAPACIDADES TRANSVERSALES:
1. Resolución de Problemas: Moviliza saberes previos para diseñar estrategias y evalúa la efectividad del proceso.
2. Pensamiento Crítico: Analiza información de diversas fuentes, evalúa argumentos y construye juicios propios basados en evidencias.
3. Aprender a Aprender: Gestiona el tiempo de estudio, identifica dificultades y busca ayuda de manera autónoma.
4. Trabajo con Otros: Escucha activa, respeto por la diversidad de opiniones y asunción de responsabilidades compartidas.
5. Comunicación: Adapta el discurso al contexto y utiliza vocabulario específico de las distintas áreas curriculares.
6. Compromiso y Responsabilidad: Involucramiento activo en acciones que promuevan el bienestar colectivo y la sustentabilidad ambiental.

CIENCIAS NATURALES (Contexto de Indagación):
Saberes: Sistemas de nutrición humana (digestivo, respiratorio, circulatorio, excretor); organismo como sistema abierto; ambientes acuáticos y de transición de Mendoza; biodiversidad; mezclas y métodos de separación; energía potencial y cinética; electricidad y magnetismo; el Sol y el sistema solar.
Indicadores: Integra los sistemas de nutrición explicando su funcionamiento coordinado; identifica adaptaciones al medio acuático; diseña experimentos para separar materiales; describe los movimientos de la Tierra y sus consecuencias.

CIENCIAS SOCIALES (Contexto de Acción Social):
Saberes: Organización territorial de Mendoza y Argentina (capitales, departamentos, límites); circuitos agroindustriales locales (vid, olivo, frutales); sociedad posrevolucionaria 1810-1820 y figura de San Martín; división de poderes; Constitución Nacional y Provincial; derechos del niño.
Indicadores: Localiza departamentos en mapas políticos; explica causas y consecuencias de la revolución de mayo; describe funciones institucionales democráticas; reconoce problemas ambientales locales y globales.

MATEMÁTICA (Herramienta de Procesamiento):
Saberes: Números naturales hasta 100.000 y análisis del valor posicional; fracciones y decimales de uso social (1/2, 1/4, 3/4, 0,5); proporcionalidad; multiplicación y división por una y dos cifras; geometría de triángulos y cuadriláteros; equivalencias entre unidades de medida de longitud, peso y capacidad; interpretación de tablas y gráficos estadísticos.
Indicadores: Resuelve problemas multiplicativos con proporcionalidad; interpreta equivalencias entre fracciones y decimales; construye figuras con instrumentos; estima y mide eligiendo instrumento y unidad adecuada.

LENGUA (Vehículo de Comunicación):
Saberes: Producción de exposiciones orales individuales y grupales; lectura autónoma de textos literarios y no literarios; identificación de idea principal y secundaria; escritura de textos narrativos y expositivos; uso de conectores y signos de puntuación; tildación y ortografía de uso frecuente.
Indicadores: Sintetiza oralmente información de medios visuales y escritos; identifica la idea principal en textos de más de dos párrafos; narra historias respetando la secuencia lógica; defiende posturas basadas en datos y evidencias.

VINCULACIÓN INTERDISCIPLINARIA:
- Ciencias provee el núcleo temático de indagación
- Sociales sitúa el problema en el territorio mendocino real
- Matemática permite medir, tabular y graficar el impacto
- Lengua da forma al Producto Público final (folleto, video, podcast, campaña)

OBJETIVOS ESTRATÉGICOS DGE 2026:
- Fluidez Lectora: incluir actividad de lectura en voz alta con prosodia en cada secuencia
- Matemática 5.0: proponer situaciones con pensamiento computacional y plataformas Matific/Eduten
- Uso de IA en el aula: el alumno usa herramientas digitales para contrastar fuentes

PROBLEMÁTICAS REALES DE MENDOZA para contextualizar el ABP:
Crisis hídrica y uso eficiente del agua, protección del patrimonio agroecológico, vitivinicultura y circuito productivo, mosca del mediterráneo y sanidad vegetal, historia de San Martín y el cruce de los Andes, cuidado de los espacios públicos, residuos y reciclaje, biodiversidad en ecosistemas andinos y de piedemonte.
`;

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { headers, situacionProblema, mandatoryPoints } = body;

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'GROQ_API_KEY no configurada' }, { status: 500 });
  }

  const puntosSeleccionados = Object.entries(mandatoryPoints)
    .filter(([, v]) => v)
    .map(([k]) => k)
    .join(', ');

  const prompt = `Sos un especialista en diseño curricular ABP para la DGE de Mendoza, Argentina. Debés generar un proyecto ABP COMPLETO y PROFESIONAL para Ciclo 2026, basado ESTRICTAMENTE en el siguiente Diseño Curricular Provincial (DCP):

${DCP_MENDOZA_5TO}

DATOS DEL DOCENTE:
- Escuela: ${headers['Escuela'] || 'No especificada'}
- Docente: ${headers['Docente'] || 'No especificado'}
- Grado: ${headers['Grado'] || '5° grado'}
- Turno: ${headers['Turno'] || 'No especificado'}
- Ciclo: 2026

SITUACIÓN PROBLEMA DEL DOCENTE:
"${situacionProblema}"

PUNTOS OBLIGATORIOS DGE SELECCIONADOS:
${puntosSeleccionados}

INSTRUCCIONES CRÍTICAS:
1. Usá SABERES REALES del DCP Mendoza listados arriba — NO inventes contenidos
2. Vinculá las 4 áreas: Ciencias (indagación) → Sociales (territorio) → Matemática (datos) → Lengua (comunicación)
3. El producto final debe ser PÚBLICO, concreto y con impacto en la comunidad de Mendoza
4. Incluí FLUIDEZ LECTORA con actividad específica de lectura en voz alta con prosodia
5. Incluí MATEMÁTICA 5.0 con situación real de pensamiento computacional (Matific/resolución de problemas)
6. Usá problemáticas REALES de la zona mendocina (agua, vitivinicultura, ambiente, historia local)
7. Las subpreguntas deben ser abiertas, que no se respondan con Google
8. Los saberes deben nombrarse EXACTAMENTE como aparecen en el DCP

Generá el proyecto ABP con EXACTAMENTE esta estructura JSON (sin texto adicional, solo JSON válido):

{
  "titulo": "Título creativo y motivador del proyecto ABP",
  "preguntaGuia": "Pregunta guía mejorada pedagógicamente, formulada como desafío abierto",
  "subpreguntas": [
    "Subpregunta 1 que guía la investigación",
    "Subpregunta 2",
    "Subpregunta 3"
  ],
  "productoFinal": {
    "nombre": "Nombre concreto del producto público",
    "descripcion": "Descripción detallada de qué harán los alumnos y cómo impacta en la comunidad mendocina",
    "audiencia": "A quién va dirigido el producto"
  },
  "objetivos": {
    "general": "Objetivo general del proyecto alineado al DCP",
    "especificos": [
      "Objetivo específico 1",
      "Objetivo específico 2",
      "Objetivo específico 3"
    ]
  },
  "fundamentacion": "Párrafo de fundamentación pedagógica alineada al DCP Mendoza 2026, mencionando la Resolución 3556-DGE-19, Fluidez Lectora, Matemática 5.0 y trayectorias",
  "espaciosCurriculares": [
    {
      "area": "Ciencias Naturales",
      "saberes": ["Saber real del DCP 1", "Saber real del DCP 2"],
      "capacidad": "Capacidad transversal priorizada",
      "indicadores": ["Indicador de logro 1", "Indicador de logro 2"]
    },
    {
      "area": "Ciencias Sociales",
      "saberes": ["Saber real del DCP 1", "Saber real del DCP 2"],
      "capacidad": "Capacidad transversal priorizada",
      "indicadores": ["Indicador de logro 1", "Indicador de logro 2"]
    },
    {
      "area": "Matemática",
      "saberes": ["Saber real del DCP 1", "Saber real del DCP 2"],
      "capacidad": "Capacidad transversal priorizada",
      "indicadores": ["Indicador de logro 1", "Indicador de logro 2"]
    },
    {
      "area": "Lengua",
      "saberes": ["Saber real del DCP 1", "Saber real del DCP 2"],
      "capacidad": "Capacidad transversal priorizada",
      "indicadores": ["Indicador de logro 1", "Indicador de logro 2"]
    }
  ],
  "herramientas": "Recursos digitales y materiales necesarios (Matific, aula digital, materiales reciclables, etc.)",
  "recursos": {
    "humanos": "Descripción de los recursos humanos",
    "materiales": "Descripción de los recursos materiales"
  },
  "tareasActividades": "Descripción general de las tareas y actividades del proyecto",
  "evaluacion": "Descripción de las formas de evaluación (rúbricas, observación, autoevaluación)",
  "difusion": {
    "cuando": "Cuándo se difunde el producto",
    "aQuien": "A quién va dirigida la difusión"
  },
  "secuencias": [
    {
      "mes": "Mes 1 (abril-mayo)",
      "titulo": "Título de la secuencia mensual 1",
      "objetivo": "Objetivo específico del mes",
      "actividades": [
        "Actividad 1 concreta y detallada",
        "Actividad 2",
        "Actividad 3",
        "Actividad 4"
      ],
      "fluidezLectora": "Actividad específica de lectura en voz alta con prosodia",
      "matematica50": "Situación real con Matific o pensamiento computacional",
      "evidencia": "Qué producto/evidencia genera el alumno este mes"
    },
    {
      "mes": "Mes 2 (junio-julio)",
      "titulo": "Título de la secuencia mensual 2",
      "objetivo": "Objetivo específico del mes",
      "actividades": ["Actividad 1", "Actividad 2", "Actividad 3", "Actividad 4"],
      "fluidezLectora": "Actividad específica de lectura en voz alta con prosodia",
      "matematica50": "Situación real con Matific o pensamiento computacional",
      "evidencia": "Qué producto/evidencia genera el alumno este mes"
    },
    {
      "mes": "Mes 3 (agosto-septiembre)",
      "titulo": "Título de la secuencia mensual 3",
      "objetivo": "Objetivo específico del mes",
      "actividades": ["Actividad 1", "Actividad 2", "Actividad 3", "Actividad 4"],
      "fluidezLectora": "Actividad específica de lectura en voz alta con prosodia",
      "matematica50": "Situación real con Matific o pensamiento computacional",
      "evidencia": "Qué producto/evidencia genera el alumno este mes"
    }
  ],
  "rubrica": [
    {
      "capacidad": "Nombre de la capacidad transversal",
      "indicadorLogrado": "Conducta observable cuando logró la capacidad",
      "indicadorEnProceso": "Conducta observable cuando está en proceso",
      "indicadorInicial": "Conducta observable en nivel inicial"
    }
  ],
  "articulacionTerritorial": "Cómo se vincula con organismos y actores locales de Mendoza",
  "promptMaestro": "Prompt completo y detallado para pegar en cualquier IA y expandir este proyecto con materiales adicionales para Mendoza Ciclo 2026"
}`;

  try {
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 6000,
      }),
    });

    if (!groqRes.ok) {
      const err = await groqRes.text();
      return NextResponse.json({ error: `Groq error: ${err}` }, { status: 500 });
    }

    const groqData = await groqRes.json();
    const rawText = groqData.choices?.[0]?.message?.content ?? '';

    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: 'La IA no devolvió JSON válido', raw: rawText }, { status: 500 });
    }

    const abpGenerado = JSON.parse(jsonMatch[0]);
    return NextResponse.json({ abp: abpGenerado });

  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
```

**File → Save**. Luego en el terminal:
```
git add .
```
```
git commit -m "DCP Mendoza integrado"
```
```
git push