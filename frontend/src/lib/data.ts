// Types
export type GrowthStage = 'Establishment' | 'Early Vegetative' | 'Tillering' | 'Grand Growth' | 'Maturity' | 'Harvest'
export type StressLevel = 'none' | 'low' | 'moderate' | 'high' | 'severe'
export type AdvisoryAction = 'IRRIGATION_REQUIRED' | 'IRRIGATION_CAN_BE_DELAYED' | 'MONITOR_FIELD' | 'NO_IMMEDIATE_IRRIGATION'

export interface FieldTimePoint {
  date: string
  ndvi: number
  ndmi: number
  ndwi: number
  evi: number
  rainfall: number
  et: number
  stressScore: number
  stage: GrowthStage
}

export interface StressFactor {
  label: string
  contribution: number
  detail: string
}

export interface SugarcaneField {
  id: string
  village: string
  crop: string
  confidence: number
  areaHa: number
  stage: GrowthStage
  stageConfidence: number
  daysInStage: number
  ndvi: number
  ndmi: number
  ndwi: number
  evi: number
  stressScore: number
  stressLevel: StressLevel
  stressConfidence: number
  rainfall7d: number
  et: number
  soilMoisture: number
  lst: number
  lastObservation: string
  dataQuality: string
  cloudCover: number
  advisory: AdvisoryAction
  advisoryConfidence: number
  advisoryReason: string
  irrigationPriority: number
  centroid: [number, number]
  polygon: [number, number][]
  stressFactors: StressFactor[]
  explanation: string
  series: FieldTimePoint[]
}

export interface DistrictStats {
  studyAreaKm2: number
  sugarcaneHa: number
  fieldCount: number
  healthyPct: number
  stressedPct: number
  highStressCount: number
  irrigationPriority: number
  avgNdvi: number
  avgNdmi: number
  latestObservation: string
}

// Constants
export const BAITUL_CENTER: [number, number] = [21.9, 77.9]

export const BAITUL_BOUNDARY: [number, number][] = [
  [21.5, 77.5],
  [21.5, 78.3],
  [21.7, 78.4],
  [21.9, 78.5],
  [22.1, 78.4],
  [22.3, 78.2],
  [22.3, 77.6],
  [22.1, 77.4],
  [21.9, 77.3],
  [21.7, 77.4],
  [21.5, 77.5]
]

export const STAGE_COLORS: Record<GrowthStage, string> = {
  'Establishment': '#38bdf8',
  'Early Vegetative': '#7ee2a8',
  'Tillering': '#4dd484',
  'Grand Growth': '#2fbf6b',
  'Maturity': '#f5b942',
  'Harvest': '#b08968'
}

export const STRESS_COLORS: Record<StressLevel, string> = {
  'none': '#2fbf6b',
  'low': '#a3d635',
  'moderate': '#f5b942',
  'high': '#f07b2d',
  'severe': '#e5484d'
}

export const STRESS_LABELS: Record<StressLevel, string> = {
  'none': 'No Stress',
  'low': 'Low Stress',
  'moderate': 'Moderate Stress',
  'high': 'High Stress',
  'severe': 'Severe Stress'
}

export const ADVISORY_META: Record<AdvisoryAction, { label: string; color: string; description: string }> = {
  'IRRIGATION_REQUIRED': {
    label: 'Irrigation Required',
    color: '#e5484d',
    description: 'Immediate irrigation needed due to high moisture stress'
  },
  'IRRIGATION_CAN_BE_DELAYED': {
    label: 'Can Be Delayed',
    color: '#f5b942',
    description: 'Irrigation needed but can be delayed by 3-5 days'
  },
  'MONITOR_FIELD': {
    label: 'Monitor Field',
    color: '#38bdf8',
    description: 'Field shows early stress signs - monitor closely'
  },
  'NO_IMMEDIATE_IRRIGATION': {
    label: 'No Immediate Irrigation',
    color: '#2fbf6b',
    description: 'Adequate moisture - no irrigation needed'
  }
}

export const STAGE_WATER_NEED: Record<GrowthStage, string> = {
  'Establishment': 'Low water requirement - maintain soil moisture for germination',
  'Early Vegetative': 'Moderate water - support tiller initiation',
  'Tillering': 'High water demand - critical for tiller development',
  'Grand Growth': 'Peak water demand - maximum biomass accumulation',
  'Maturity': 'Reduced water - allow gradual moisture decline for ripening',
  'Harvest': 'Minimal water - dry conditions preferred for harvest'
}

export const LATEST_OBSERVATION = '2026-09-18'
export const DATA_MODE = 'demo'

// PRNG for deterministic data generation
let seed = 20260921

function mulberry32() {
  let t = seed += 0x6D2B79F5
  t = Math.imul(t ^ (t >>> 15), t | 1)
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

function rand(): number {
  return mulberry32()
}

function randRange(min: number, max: number): number {
  return min + rand() * (max - min)
}

function randInt(min: number, max: number): number {
  return Math.floor(randRange(min, max + 1))
}

function randChoice<T>(arr: T[]): T {
  return arr[Math.floor(rand() * arr.length)]
}

// Field specifications
interface FieldSpec {
  id: string
  village: string
  stage: GrowthStage
  stress: StressLevel
  area: number
  center: [number, number]
  quality?: string
}

const FIELD_SPECS: FieldSpec[] = [
  { id: 'BTL-001', village: 'Multai', stage: 'Grand Growth', stress: 'low', area: 4.2, center: [21.85, 77.85] },
  { id: 'BTL-002', village: 'Multai', stage: 'Tillering', stress: 'moderate', area: 3.8, center: [21.87, 77.83] },
  { id: 'BTL-003', village: 'Betul', stage: 'Grand Growth', stress: 'none', area: 5.1, center: [21.92, 77.88] },
  { id: 'BTL-004', village: 'Betul', stage: 'Maturity', stress: 'low', area: 4.5, center: [21.94, 77.86] },
  { id: 'BTL-005', village: 'Amla', stage: 'Tillering', stress: 'high', area: 3.2, center: [21.78, 77.92], quality: 'Fair' },
  { id: 'BTL-006', village: 'Amla', stage: 'Early Vegetative', stress: 'moderate', area: 2.9, center: [21.76, 77.94] },
  { id: 'BTL-007', village: 'Bhainsdehi', stage: 'Grand Growth', stress: 'none', area: 6.3, center: [21.82, 77.78] },
  { id: 'BTL-008', village: 'Bhainsdehi', stage: 'Tillering', stress: 'low', area: 4.8, center: [21.84, 77.76] },
  { id: 'BTL-009', village: 'Athner', stage: 'Maturity', stress: 'moderate', area: 3.9, center: [22.05, 77.82] },
  { id: 'BTL-010', village: 'Athner', stage: 'Harvest', stress: 'low', area: 4.1, center: [22.07, 77.80] },
  { id: 'BTL-011', village: 'Chicholi', stage: 'Grand Growth', stress: 'severe', area: 3.5, center: [21.95, 77.95], quality: 'Limited' },
  { id: 'BTL-012', village: 'Chicholi', stage: 'Tillering', stress: 'high', area: 4.0, center: [21.97, 77.93] },
  { id: 'BTL-013', village: 'Shahpur', stage: 'Early Vegetative', stress: 'none', area: 5.5, center: [22.12, 77.75] },
  { id: 'BTL-014', village: 'Shahpur', stage: 'Tillering', stress: 'low', area: 4.7, center: [22.14, 77.73] },
  { id: 'BTL-015', village: 'Ghoradongri', stage: 'Grand Growth', stress: 'moderate', area: 3.6, center: [21.72, 77.88] },
  { id: 'BTL-016', village: 'Ghoradongri', stage: 'Maturity', stress: 'high', area: 4.3, center: [21.74, 77.86] },
  { id: 'BTL-017', village: 'Prabhat Pattan', stage: 'Tillering', stress: 'low', area: 5.2, center: [21.88, 77.72] },
  { id: 'BTL-018', village: 'Prabhat Pattan', stage: 'Grand Growth', stress: 'none', area: 4.9, center: [21.90, 77.70] },
  { id: 'BTL-019', village: 'Multai', stage: 'Early Vegetative', stress: 'moderate', area: 3.1, center: [21.83, 77.81] },
  { id: 'BTL-020', village: 'Betul', stage: 'Harvest', stress: 'severe', area: 3.8, center: [21.93, 77.90], quality: 'Fair' },
  { id: 'BTL-021', village: 'Amla', stage: 'Grand Growth', stress: 'high', area: 4.4, center: [21.80, 77.96] },
  { id: 'BTL-022', village: 'Bhainsdehi', stage: 'Tillering', stress: 'moderate', area: 5.0, center: [21.86, 77.74] },
  { id: 'BTL-023', village: 'Athner', stage: 'Maturity', stress: 'low', area: 3.7, center: [22.03, 77.84] },
  { id: 'BTL-024', village: 'Chicholi', stage: 'Grand Growth', stress: 'severe', area: 4.6, center: [21.99, 77.97] },
  { id: 'BTL-025', village: 'Shahpur', stage: 'Early Vegetative', stress: 'none', area: 5.8, center: [22.10, 77.77] },
  { id: 'BTL-026', village: 'Ghoradongri', stage: 'Tillering', stress: 'high', area: 3.4, center: [21.70, 77.90], quality: 'Limited' },
  { id: 'BTL-027', village: 'Prabhat Pattan', stage: 'Grand Growth', stress: 'moderate', area: 4.8, center: [21.92, 77.68] },
  { id: 'BTL-028', village: 'Multai', stage: 'Maturity', stress: 'low', area: 5.3, center: [21.89, 77.79] }
]

// Generate polygon around center with jitter
function polygonAround(center: [number, number], sizeKm: number): [number, number][] {
  const [lat, lng] = center
  const latOffset = sizeKm / 111  // ~111km per degree latitude
  const lngOffset = sizeKm / (111 * Math.cos(lat * Math.PI / 180))
  
  const base: [number, number][] = [
    [lat - latOffset, lng - lngOffset],
    [lat - latOffset, lng + lngOffset],
    [lat + latOffset, lng + lngOffset],
    [lat + latOffset, lng - lngOffset]
  ]
  
  return base.map(([l, g]) => [
    l + randRange(-0.005, 0.005),
    g + randRange(-0.005, 0.005)
  ])
}

// Stage progression based on week number (0-27)
function stageForWeek(week: number, baseStage: GrowthStage): GrowthStage {
  const stages: GrowthStage[] = ['Establishment', 'Early Vegetative', 'Tillering', 'Grand Growth', 'Maturity', 'Harvest']
  const baseIndex = stages.indexOf(baseStage)
  const progression = Math.floor(week / 5)
  const targetIndex = Math.min(baseIndex + progression, stages.length - 1)
  return stages[targetIndex]
}

// Generate time series for a field
function buildSeries(spec: FieldSpec): FieldTimePoint[] {
  const series: FieldTimePoint[] = []
  const startDate = new Date('2026-03-15')
  
  const stressBiasMap: Record<StressLevel, number> = {
    'none': 0,
    'low': 15,
    'moderate': 35,
    'high': 55,
    'severe': 75
  }
  const stressBias = stressBiasMap[spec.stress]
  
  for (let i = 0; i < 28; i++) {
    const date = new Date(startDate)
    date.setDate(date.getDate() + i * 7)
    const week = i
    
    const stage = stageForWeek(week, spec.stage)
    const progress = week / 27
    
    // NDVI sine curve with noise
    const baseNdvi = 0.5 + 0.35 * Math.sin(progress * Math.PI)
    const ndvi = Math.max(0.2, Math.min(0.9, baseNdvi + randRange(-0.08, 0.08) - stressBias * 0.003))
    
    // NDMI derived from NDVI with stress bias
    const ndmi = Math.max(-0.1, Math.min(0.5, ndvi * 0.8 - stressBias * 0.004 + randRange(-0.05, 0.05)))
    
    // NDWI derived from NDMI
    const ndwi = Math.max(-0.2, Math.min(0.4, ndmi * 0.9 + randRange(-0.04, 0.04)))
    
    // EVI derived from NDVI
    const evi = Math.max(0.1, Math.min(0.8, ndvi * 1.1 + randRange(-0.06, 0.06)))
    
    // Monsoon rainfall (Jun-Sep) vs dry season
    const month = date.getMonth()
    const isMonsoon = month >= 5 && month <= 8
    const rainfall = isMonsoon ? randRange(20, 80) : randRange(0, 15)
    
    // ET with monsoon adjustment
    const et = isMonsoon ? randRange(3, 5) : randRange(4, 7)
    
    // Stress score formula
    const monsoonOffset = isMonsoon ? 15 : 0
    const stressScore = Math.max(0, Math.min(100, 
      (1 - (ndmi + 0.1)) * 55 + stressBias * 0.3 + randRange(-5, 5) - monsoonOffset
    ))
    
    series.push({
      date: date.toISOString().split('T')[0],
      ndvi: Math.round(ndvi * 1000) / 1000,
      ndmi: Math.round(ndmi * 1000) / 1000,
      ndwi: Math.round(ndwi * 1000) / 1000,
      evi: Math.round(evi * 1000) / 1000,
      rainfall: Math.round(rainfall * 10) / 10,
      et: Math.round(et * 10) / 10,
      stressScore: Math.round(stressScore * 10) / 10,
      stage
    })
  }
  
  return series
}

// Advisory generation based on stage, stress, and rainfall
function advisoryFor(stage: GrowthStage, stressScore: number, rainfall7d: number): AdvisoryAction {
  if (stressScore >= 70) return 'IRRIGATION_REQUIRED'
  if (stressScore >= 50) return rainfall7d < 10 ? 'IRRIGATION_REQUIRED' : 'IRRIGATION_CAN_BE_DELAYED'
  if (stressScore >= 30) return 'MONITOR_FIELD'
  if (stage === 'Harvest') return 'NO_IMMEDIATE_IRRIGATION'
  if (rainfall7d >= 30) return 'NO_IMMEDIATE_IRRIGATION'
  return 'NO_IMMEDIATE_IRRIGATION'
}

// Generate stress factors
function stressFactorsFor(stressScore: number, ndmi: number, rainfall7d: number, lst: number, et: number, stage: GrowthStage): StressFactor[] {
  const factors: StressFactor[] = []
  
  const ndmiContribution = Math.max(0, (0.4 - ndmi) * 50)
  factors.push({
    label: 'NDMI (Canopy Moisture)',
    contribution: Math.min(40, ndmiContribution),
    detail: ndmi < 0.2 ? 'Low canopy moisture detected' : 'Adequate canopy moisture'
  })
  
  const rainfallContribution = Math.max(0, (20 - rainfall7d) * 1.5)
  factors.push({
    label: 'Recent Rainfall',
    contribution: Math.min(25, rainfallContribution),
    detail: rainfall7d < 10 ? 'Insufficient recent rainfall' : 'Adequate recent rainfall'
  })
  
  const lstContribution = Math.max(0, (lst - 32) * 2)
  factors.push({
    label: 'Land Surface Temperature',
    contribution: Math.min(20, lstContribution),
    detail: lst > 35 ? 'Elevated surface temperature' : 'Normal surface temperature'
  })
  
  const etContribution = Math.max(0, (et - 5) * 3)
  factors.push({
    label: 'Evapotranspiration Demand',
    contribution: Math.min(15, etContribution),
    detail: et > 6 ? 'High evapotranspiration demand' : 'Moderate evapotranspiration'
  })
  
  const stageSensitivity: Record<GrowthStage, number> = {
    'Establishment': 10,
    'Early Vegetative': 15,
    'Tillering': 25,
    'Grand Growth': 30,
    'Maturity': 15,
    'Harvest': 5
  }
  factors.push({
    label: 'Growth Stage Sensitivity',
    contribution: stageSensitivity[stage],
    detail: `${stage} has ${stageSensitivity[stage]}% stress sensitivity`
  })
  
  // Normalize contributions
  const total = factors.reduce((sum, f) => sum + f.contribution, 0)
  if (total > 0) {
    factors.forEach(f => {
      f.contribution = Math.round((f.contribution / total) * 100)
    })
  }
  
  return factors.sort((a, b) => b.contribution - a.contribution)
}

// Generate explanation
function explanationFor(field: SugarcaneField): string {
  const { stage, stressScore, stressLevel, rainfall7d, ndmi, advisory } = field
  const stageWater = STAGE_WATER_NEED[stage]
  
  let explanation = `Field ${field.id} in ${field.village} is currently in the ${stage} stage. `
  explanation += `This stage typically requires ${stageWater.toLowerCase()}. `
  explanation += `The field shows ${STRESS_LABELS[stressLevel]} with a stress score of ${Math.round(stressScore)}/100. `
  
  if (stressScore > 50) {
    explanation += `NDMI (${ndmi.toFixed(2)}) indicates reduced canopy moisture, and recent 7-day rainfall (${rainfall7d.toFixed(1)}mm) is below optimal. `
  } else {
    explanation += `NDMI (${ndmi.toFixed(2)}) indicates adequate canopy moisture, and recent rainfall (${rainfall7d.toFixed(1)}mm) has been sufficient. `
  }
  
  explanation += `Based on current conditions, the advisory is ${ADVISORY_META[advisory].label.toLowerCase()}. `
  explanation += `Data quality is ${field.dataQuality} with ${field.cloudCover}% cloud cover in the latest observation.`
  
  return explanation
}

// Build all fields
export function buildFields(): SugarcaneField[] {
  const fields: SugarcaneField[] = []
  
  FIELD_SPECS.forEach((spec) => {
    seed = parseInt(spec.id.split('-')[1]) * 1000  // Reset seed per field for consistency
    
    const series = buildSeries(spec)
    const latest = series[series.length - 1]
    
    const stressScore = latest.stressScore
    const stressLevel: StressLevel = 
      stressScore < 20 ? 'none' :
      stressScore < 40 ? 'low' :
      stressScore < 60 ? 'moderate' :
      stressScore < 80 ? 'high' : 'severe'
    
    const rainfall7d = randRange(0, 45)
    const et = randRange(3, 7)
    const soilMoisture = randRange(15, 45)
    const lst = randRange(28, 38)
    const cloudCover = randInt(0, 25)
    
    const dataQuality = spec.quality || (cloudCover < 15 ? 'Good' : cloudCover < 25 ? 'Fair' : 'Limited')
    
    const confidence = randRange(0.75, 0.98)
    const stageConfidence = randRange(0.70, 0.95)
    const daysInStage = randInt(7, 35)
    
    const advisory = advisoryFor(spec.stage, stressScore, rainfall7d)
    const advisoryConfidence = randRange(0.70, 0.92)
    
    const stressFactors = stressFactorsFor(stressScore, latest.ndmi, rainfall7d, lst, et, spec.stage)
    
    const irrigationPriority = 
      advisory === 'IRRIGATION_REQUIRED' ? 1 :
      advisory === 'IRRIGATION_CAN_BE_DELAYED' ? 2 :
      advisory === 'MONITOR_FIELD' ? 3 : 4
    
    const field: SugarcaneField = {
      id: spec.id,
      village: spec.village,
      crop: 'Sugarcane',
      confidence: Math.round(confidence * 1000) / 1000,
      areaHa: spec.area,
      stage: spec.stage,
      stageConfidence: Math.round(stageConfidence * 1000) / 1000,
      daysInStage,
      ndvi: latest.ndvi,
      ndmi: latest.ndmi,
      ndwi: latest.ndwi,
      evi: latest.evi,
      stressScore,
      stressLevel,
      stressConfidence: Math.round(randRange(0.75, 0.95) * 1000) / 1000,
      rainfall7d: Math.round(rainfall7d * 10) / 10,
      et: Math.round(et * 10) / 10,
      soilMoisture: Math.round(soilMoisture * 10) / 10,
      lst: Math.round(lst * 10) / 10,
      lastObservation: LATEST_OBSERVATION,
      dataQuality,
      cloudCover,
      advisory,
      advisoryConfidence,
      advisoryReason: `${ADVISORY_META[advisory].description} based on ${spec.stage} stage and current moisture conditions.`,
      irrigationPriority,
      centroid: spec.center,
      polygon: polygonAround(spec.center, Math.sqrt(spec.area)),
      stressFactors,
      explanation: '',
      series
    }
    
    field.explanation = explanationFor(field)
    fields.push(field)
  })
  
  return fields
}

// Non-sugarcane plots
export const NON_CANE_PLOTS = [
  { id: 'NC-001', type: 'Other crop', center: [21.88, 77.82] as [number, number], polygon: polygonAround([21.88, 77.82], 2) },
  { id: 'NC-002', type: 'Fallow', center: [21.91, 77.84] as [number, number], polygon: polygonAround([21.91, 77.84], 1.5) },
  { id: 'NC-003', type: 'Forest', center: [21.79, 77.89] as [number, number], polygon: polygonAround([21.79, 77.89], 3) },
  { id: 'NC-004', type: 'Built-up', center: [21.93, 77.87] as [number, number], polygon: polygonAround([21.93, 77.87], 1) },
  { id: 'NC-005', type: 'Water', center: [21.86, 77.91] as [number, number], polygon: polygonAround([21.86, 77.91], 0.8) },
  { id: 'NC-006', type: 'Other crop', center: [22.02, 77.79] as [number, number], polygon: polygonAround([22.02, 77.79], 2.2) },
  { id: 'NC-007', type: 'Fallow', center: [21.75, 77.93] as [number, number], polygon: polygonAround([21.75, 77.93], 1.8) },
  { id: 'NC-008', type: 'Forest', center: [22.08, 77.74] as [number, number], polygon: polygonAround([22.08, 77.74], 2.5) }
]

// District statistics
export function districtStats(fields: SugarcaneField[]): DistrictStats {
  const sugarcaneHa = fields.reduce((sum, f) => sum + f.areaHa, 0)
  const healthyCount = fields.filter(f => f.stressLevel === 'none' || f.stressLevel === 'low').length
  const stressedCount = fields.filter(f => f.stressLevel !== 'none').length
  const highStressCount = fields.filter(f => f.stressLevel === 'high' || f.stressLevel === 'severe').length
  const irrigationPriorityCount = fields.filter(f => f.irrigationPriority <= 2).length
  
  const avgNdvi = fields.reduce((sum, f) => sum + f.ndvi, 0) / fields.length
  const avgNdmi = fields.reduce((sum, f) => sum + f.ndmi, 0) / fields.length
  
  return {
    studyAreaKm2: 10043,
    sugarcaneHa: Math.round(sugarcaneHa * 10) / 10,
    fieldCount: fields.length,
    healthyPct: Math.round((healthyCount / fields.length) * 100),
    stressedPct: Math.round((stressedCount / fields.length) * 100),
    highStressCount,
    irrigationPriority: irrigationPriorityCount,
    avgNdvi: Math.round(avgNdvi * 1000) / 1000,
    avgNdmi: Math.round(avgNdmi * 1000) / 1000,
    latestObservation: LATEST_OBSERVATION
  }
}

// Export generated data
export const FIELDS = buildFields()
export const STATS = districtStats(FIELDS)
