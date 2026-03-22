import { NextRequest, NextResponse } from 'next/server';
 
export const runtime = 'edge';
 
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
 
  const prompt = `Sos un especialista en diseño curricular ABP (Aprendizaje Basado en Proyectos) para la Dirección General de Escuelas (DGE) de la provincia de Mendoza, Argentina. Tu tarea es generar un proyecto ABP COMPLETO y REAL para Ciclo 2026 según los lineamientos oficiales de la DGE Mendoza.
 
DATOS DEL DOCENTE:
- Escuela: ${headers['Escuela'] || 'No especificada'}
- Docente: ${headers['Docente'] || 'No especificado'}
- Grado: ${headers['Grado'] || 'No especificado'}
- Turno: ${headers['Turno'] || 'No especificado'}
- Ciclo: 2026
 
SITUACIÓN PROBLEMA (pregunta guía):
"${situacionProblema}"
 
PUNTOS OBLIGATORIOS DGE SELECCIONADOS:
${puntosSeleccionados}
 
Generá un proyecto ABP completo con EXACTAMENTE esta estructura JSON (sin texto adicional, solo el JSON válido):
 
{
  "titulo": "Título creativo y motivador del proyecto ABP",
  "preguntaGuia": "La pregunta guía reformulada y mejorada pedagógicamente",
  "productoFinal": {
    "nombre": "Nombre del producto público concreto",
    "descripcion": "Descripción detallada de qué van a hacer los alumnos y cómo impacta en la comunidad",
    "audiencia": "A quién va dirigido el producto (padres, comunidad, otras escuelas, municipio, etc.)"
  },
  "fundamentacion": "Párrafo de fundamentación pedagógica alineada al DCP Mendoza 2026, mencionando Fluidez Lectora, Matemática 5.0 y trayectorias",
  "saberesDCP": [
    "Saber 1 del DCP Mendoza vinculado al proyecto",
    "Saber 2",
    "Saber 3",
    "Saber 4"
  ],
  "capacidades": [
    "Capacidad 1 a evaluar mediante rúbrica",
    "Capacidad 2",
    "Capacidad 3"
  ],
  "secuencias": [
    {
      "mes": "Mes 1 (abril-mayo)",
      "titulo": "Título de la secuencia mensual 1",
      "objetivo": "Objetivo específico del mes",
      "actividades": [
        "Actividad 1 concreta y detallada",
        "Actividad 2 concreta y detallada",
        "Actividad 3 concreta y detallada",
        "Actividad 4 concreta y detallada"
      ],
      "fluidezLectora": "Descripción de cómo se trabaja Fluidez Lectora este mes",
      "matematica50": "Descripción de cómo se usa Matific/Matemática 5.0 este mes",
      "evidencia": "Qué evidencia producen los alumnos este mes"
    },
    {
      "mes": "Mes 2 (junio-julio)",
      "titulo": "Título de la secuencia mensual 2",
      "objetivo": "Objetivo específico del mes",
      "actividades": [
        "Actividad 1 concreta y detallada",
        "Actividad 2 concreta y detallada",
        "Actividad 3 concreta y detallada",
        "Actividad 4 concreta y detallada"
      ],
      "fluidezLectora": "Descripción de cómo se trabaja Fluidez Lectora este mes",
      "matematica50": "Descripción de cómo se usa Matific/Matemática 5.0 este mes",
      "evidencia": "Qué evidencia producen los alumnos este mes"
    },
    {
      "mes": "Mes 3 (agosto-septiembre)",
      "titulo": "Título de la secuencia mensual 3",
      "objetivo": "Objetivo específico del mes",
      "actividades": [
        "Actividad 1 concreta y detallada",
        "Actividad 2 concreta y detallada",
        "Actividad 3 concreta y detallada",
        "Actividad 4 concreta y detallada"
      ],
      "fluidezLectora": "Descripción de cómo se trabaja Fluidez Lectora este mes",
      "matematica50": "Descripción de cómo se usa Matific/Matemática 5.0 este mes",
      "evidencia": "Qué evidencia producen los alumnos este mes"
    }
  ],
  "articulacionTerritorial": "Cómo se vincula con organismos/actores locales de Mendoza (municipio, INTA, bibliotecas, etc.)",
  "rubrica": [
    { "capacidad": "Nombre de la capacidad", "indicadorLogrado": "Qué hace el alumno cuando logró la capacidad", "indicadorEnProceso": "Qué hace cuando está en proceso", "indicadorInicial": "Qué hace en nivel inicial" }
  ],
  "promptMaestro": "Prompt listo para pegar en cualquier IA que expanda este proyecto: describe el proyecto completo con contexto, saberes, producto y pide generar materiales adicionales específicos para Mendoza Ciclo 2026"
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
        max_tokens: 4000,
      }),
    });
 
    if (!groqRes.ok) {
      const err = await groqRes.text();
      return NextResponse.json({ error: `Groq error: ${err}` }, { status: 500 });
    }
 
    const groqData = await groqRes.json();
    const rawText = groqData.choices?.[0]?.message?.content ?? '';
 
    // Extraer JSON del texto
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