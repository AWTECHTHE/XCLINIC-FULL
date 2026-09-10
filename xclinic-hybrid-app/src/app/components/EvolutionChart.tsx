"use client"

import { useMemo, useState, type MouseEvent } from "react"

export interface EvolutionPoint {
  date: string
  value: number
}

interface EvolutionChartProps {
  title: string
  unit: string
  color: string
  points: EvolutionPoint[]
}

const WIDTH = 560
const HEIGHT = 220
const PADDING = { top: 16, right: 16, bottom: 28, left: 40 }

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })
}

/** Gráfico de linha simples (uma série) para evolução de uma métrica ao
 * longo do tempo. Segue as specs da skill de dataviz: linha de 2px, marcador
 * final com anel na cor da superfície, área com wash de ~10% de opacidade,
 * grid recessivo, rótulo direto só no ponto final, e uma camada de hover
 * (crosshair + tooltip) porque um gráfico de linha é, por padrão, interativo.
 */
export default function EvolutionChart({ title, unit, color, points }: EvolutionChartProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)

  const plot = useMemo(() => {
    if (points.length === 0) return null

    const values = points.map((p) => p.value)
    const minValue = Math.min(...values)
    const maxValue = Math.max(...values)
    const range = maxValue - minValue || 1
    const yMin = minValue - range * 0.1
    const yMax = maxValue + range * 0.1

    const innerWidth = WIDTH - PADDING.left - PADDING.right
    const innerHeight = HEIGHT - PADDING.top - PADDING.bottom

    const xFor = (i: number) =>
      PADDING.left + (points.length === 1 ? innerWidth / 2 : (i / (points.length - 1)) * innerWidth)
    const yFor = (v: number) => PADDING.top + innerHeight - ((v - yMin) / (yMax - yMin)) * innerHeight

    const coords = points.map((p, i) => ({ x: xFor(i), y: yFor(p.value), ...p }))
    const linePath = coords.map((c, i) => `${i === 0 ? "M" : "L"}${c.x},${c.y}`).join(" ")
    const areaPath = `${linePath} L${coords[coords.length - 1].x},${PADDING.top + innerHeight} L${coords[0].x},${PADDING.top + innerHeight} Z`

    // 4 linhas de grade horizontais, com rótulos arredondados
    const gridLines = Array.from({ length: 4 }, (_, i) => {
      const value = yMin + ((yMax - yMin) * i) / 3
      return { y: yFor(value), value }
    })

    return { coords, linePath, areaPath, gridLines, innerWidth, innerHeight }
  }, [points])

  const handleMouseMove = (e: MouseEvent<SVGSVGElement>) => {
    if (!plot) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * WIDTH
    let closest = 0
    let closestDist = Infinity
    plot.coords.forEach((c, i) => {
      const dist = Math.abs(c.x - x)
      if (dist < closestDist) {
        closestDist = dist
        closest = i
      }
    })
    setHoverIndex(closest)
  }

  if (!plot) {
    return (
      <div className="bg-white shadow rounded-lg p-4">
        <h3 className="font-semibold mb-2">{title}</h3>
        <p className="text-sm text-gray-500">Sem leituras suficientes para exibir a evolução.</p>
      </div>
    )
  }

  const last = plot.coords[plot.coords.length - 1]
  const hovered = hoverIndex !== null ? plot.coords[hoverIndex] : null

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h3 className="font-semibold mb-2">
        {title} <span className="text-gray-400 font-normal text-sm">({unit})</span>
      </h3>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full h-auto"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoverIndex(null)}
      >
        {/* Grid recessivo */}
        {plot.gridLines.map((g, i) => (
          <g key={i}>
            <line
              x1={PADDING.left}
              x2={WIDTH - PADDING.right}
              y1={g.y}
              y2={g.y}
              stroke="#e5e7eb"
              strokeWidth={1}
            />
            <text x={PADDING.left - 8} y={g.y} fontSize={10} fill="#9ca3af" textAnchor="end" dy="0.32em">
              {g.value.toFixed(1)}
            </text>
          </g>
        ))}

        {/* Área (wash ~10%) */}
        <path d={plot.areaPath} fill={color} opacity={0.1} stroke="none" />

        {/* Linha (2px, round join/cap) */}
        <path d={plot.linePath} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />

        {/* Marcador final + rótulo direto (só o ponto final, não todos) */}
        <circle cx={last.x} cy={last.y} r={4} fill={color} stroke="#fff" strokeWidth={2} />
        <text x={last.x} y={last.y - 10} fontSize={11} fill="#374151" textAnchor="middle" fontWeight={600}>
          {last.value}
        </text>

        {/* Crosshair + tooltip de hover */}
        {hovered && (
          <>
            <line
              x1={hovered.x}
              x2={hovered.x}
              y1={PADDING.top}
              y2={PADDING.top + plot.innerHeight}
              stroke="#9ca3af"
              strokeWidth={1}
              strokeDasharray="3,3"
            />
            <circle cx={hovered.x} cy={hovered.y} r={5} fill={color} stroke="#fff" strokeWidth={2} />
          </>
        )}
      </svg>
      {hovered ? (
        <p className="text-sm text-gray-600 mt-1">
          {formatDate(hovered.date)}: <span className="font-semibold">{hovered.value} {unit}</span>
        </p>
      ) : (
        <p className="text-sm text-gray-400 mt-1">Passe o mouse sobre o gráfico para ver cada medição.</p>
      )}
    </div>
  )
}
