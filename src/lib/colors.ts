export const CHART_COLORS = ['#4D8CFD', '#FF6B7E', '#F4B83E', '#A6CC74', '#00C19A', '#6859BE']

export function getColorByIndex(index: number): string {
  return CHART_COLORS[index % CHART_COLORS.length]
}

export function getColorById(id: number): string {
  return CHART_COLORS[id % CHART_COLORS.length]
}
