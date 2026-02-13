
export type OwnerType = 'cloud_provider' | 'research_lab' | 'enterprise' | 'edge_provider' | 'consumer_miner' | 'manufacturer';
export type SecondLifeCategory = 'A_training_ready' | 'B_inference_and_light_training' | 'C_inference_only' | 'D_recycle_recommended';
export type OperationalStatus = 'active' | 'standby' | 'decommissioned';

export interface OwnerRecord {
  ownerType: OwnerType;
  startDate: string;
  endDate: string | 'current';
  location: string;
}

export interface MaterialComponent {
  name: string;
  symbol: string;
  percentage: number;
  impact: 'low' | 'medium' | 'high' | 'critical';
}

export interface RecommendationPath {
  title: string;
  description: string;
  suitability: number; // 0-100
}

export interface CarbonMetric {
  phase: 'Manufacturing' | 'Transport' | 'Operational' | 'Recycling Offset';
  kgCo2: number;
}

export interface GPUData {
  id: string;
  imageUrl: string;

  // 1. Identity
  manufacturer: string;
  model: string;
  serialNumber: string;
  formFactor: 'PCIe' | 'SXM';
  productionYear: number;
  firmwareVersion: string;
  status: OperationalStatus;

  // 2. Ownership & Lifecycle
  numberOfPreviousOwners: number;
  ownerHistory: OwnerRecord[];
  totalTimeInServiceMonths: number;

  // 3. Usage Profile
  workloadSplit: {
    trainingPercent: number;
    inferencePercent: number;
    idlePercent: number;
  };
  avgGpuUtilizationPercent: number;
  peakGpuUtilizationPercent: number;
  fullLoadHours: number; 
  estimatedLifespanHours: number; 
  typicalJobDuration: 'Short (<1h)' | 'Medium (1-24h)' | 'Long (>24h)';

  // 4. Thermal & Power Stress
  avgTempCelsius: number;
  maxTempCelsius: number;
  thermalCyclesCount: number;
  avgPowerDrawWatts: number;
  peakPowerDrawWatts: number; // New field
  powerSpikeEventsCount: number;
  avgEfficiencyTflopsPerWatt: number; // Renamed from avgEfficiencyGflopsPerWatt

  // 5. Memory & Reliability
  hbmEccCorrectedErrors: number;
  hbmEccUncorrectedErrors: number;
  throttlingEventsCount: number;
  driverResetEvents: number;

  // 6. Modifications & Repairs
  repairsPerformed: string[]; 
  firmwareModified: boolean;
  undervoltedOrOverclocked: boolean;

  // 7. Health & Second-Life Assessment
  healthScore: number; 
  secondLifeCategory: SecondLifeCategory;
  strategicRecommendations: RecommendationPath[];

  // 8. Material Audit
  materialComposition: MaterialComponent[];

  // 9. ESG & Carbon
  carbonMetrics: CarbonMetric[];

  // 10. Commercial
  priceUsd: number;
}

export interface GeminiAnalysis {
  aiCertificationSummary: string;
  marketValuationUsd: number;
  riskFactors: string[];
}
