import { LCAFormData } from '@/components/LCAForm';
import { LCAResults } from '@/components/LCAResults';

// Enhanced metallurgical LCA factors for different materials
const lcaFactors = {
  aluminum: { 
    name: "Aluminum", 
    virgin_co2e: 12, virgin_energy: 170, virgin_depletion: 6, virgin_water: 20, 
    scrap_co2e: 0.6, scrap_energy: 10, scrap_depletion: 0.1, scrap_water: 2,
    melting_temp: 660, typical_efficiency: 85, separation_complexity: 2
  },
  copper: { 
    name: "Copper", 
    virgin_co2e: 8, virgin_energy: 120, virgin_depletion: 10, virgin_water: 25, 
    scrap_co2e: 0.5, scrap_energy: 9, scrap_depletion: 0.2, scrap_water: 3,
    melting_temp: 1085, typical_efficiency: 90, separation_complexity: 3
  },
  steel: { 
    name: "Steel", 
    virgin_co2e: 2.1, virgin_energy: 25, virgin_depletion: 1.5, virgin_water: 3, 
    scrap_co2e: 0.6, scrap_energy: 8, scrap_depletion: 0.1, scrap_water: 0.5,
    melting_temp: 1370, typical_efficiency: 88, separation_complexity: 4
  },
  stainless_steel: {
    name: "Stainless Steel",
    virgin_co2e: 6.8, virgin_energy: 85, virgin_depletion: 4.2, virgin_water: 12,
    scrap_co2e: 1.2, scrap_energy: 15, scrap_depletion: 0.3, scrap_water: 2,
    melting_temp: 1400, typical_efficiency: 82, separation_complexity: 6
  },
  titanium: {
    name: "Titanium",
    virgin_co2e: 45, virgin_energy: 420, virgin_depletion: 35, virgin_water: 80,
    scrap_co2e: 8, scrap_energy: 45, scrap_depletion: 2, scrap_water: 12,
    melting_temp: 1668, typical_efficiency: 75, separation_complexity: 8
  },
  nickel: {
    name: "Nickel",
    virgin_co2e: 15, virgin_energy: 180, virgin_depletion: 12, virgin_water: 35,
    scrap_co2e: 2.5, scrap_energy: 22, scrap_depletion: 0.8, scrap_water: 4,
    melting_temp: 1455, typical_efficiency: 85, separation_complexity: 5
  },
  zinc: {
    name: "Zinc",
    virgin_co2e: 3.2, virgin_energy: 45, virgin_depletion: 2.8, virgin_water: 8,
    scrap_co2e: 0.8, scrap_energy: 12, scrap_depletion: 0.15, scrap_water: 1.5,
    melting_temp: 420, typical_efficiency: 90, separation_complexity: 2
  },
  lead: {
    name: "Lead",
    virgin_co2e: 2.8, virgin_energy: 35, virgin_depletion: 3.5, virgin_water: 6,
    scrap_co2e: 0.4, scrap_energy: 8, scrap_depletion: 0.12, scrap_water: 1,
    melting_temp: 328, typical_efficiency: 95, separation_complexity: 1
  },
  lithium: { 
    name: "Lithium", 
    virgin_co2e: 35, virgin_energy: 400, virgin_depletion: 30, virgin_water: 60, 
    scrap_co2e: 3, scrap_energy: 35, scrap_depletion: 0.8, scrap_water: 6,
    melting_temp: 181, typical_efficiency: 70, separation_complexity: 7
  },
  rare_earth: {
    name: "Rare Earth Elements",
    virgin_co2e: 60, virgin_energy: 650, virgin_depletion: 45, virgin_water: 120,
    scrap_co2e: 12, scrap_energy: 85, scrap_depletion: 3, scrap_water: 15,
    melting_temp: 1500, typical_efficiency: 65, separation_complexity: 10
  }
} as const;

const energyMultipliers = { 
  grid: 1.0, 
  renewable: 0.1, 
  coal: 1.8, 
  natural_gas: 0.7,
  nuclear: 0.05,
  hydroelectric: 0.02
} as const;

const transportMultipliers = {
  truck: 1.0,
  rail: 0.4,
  ship: 0.2,
  pipeline: 0.1
} as const;

const eolMultipliers = { 
  recycle: 0.1, 
  landfill: 1.2, 
  incineration: 0.8, 
  reuse: 0.05,
  hazardous: 1.5
} as const;

const previousUseMultipliers = {
  automotive: 1.2, // Higher contamination
  construction: 0.9, // Lower contamination
  electronics: 1.5, // Complex alloys
  packaging: 0.8, // Clean scrap
  aerospace: 1.8, // Complex alloys
  industrial: 1.1, // Mixed contamination
  consumer: 1.0 // Average contamination
} as const;

export const calculateLCAResults = (formData: LCAFormData): LCAResults => {
  const factors = lcaFactors[formData.material as keyof typeof lcaFactors];
  if (!factors) {
    throw new Error(`Unknown material: ${formData.material}`);
  }
  
  const energyMult = energyMultipliers[formData.energySource as keyof typeof energyMultipliers];
  const transportMult = transportMultipliers[formData.transportMode as keyof typeof transportMultipliers] || 1.0;
  const eolMult = eolMultipliers[formData.endOfLife as keyof typeof eolMultipliers];
  const previousUseMult = formData.previousUse ? 
    previousUseMultipliers[formData.previousUse as keyof typeof previousUseMultipliers] : 1.0;
  
  // Temperature factor based on actual vs optimal melting temperature
  const tempFactor = formData.temperature > factors.melting_temp * 1.5 ? 1.3 : 
                     formData.temperature < factors.melting_temp * 0.8 ? 1.1 : 1.0;
  
  // Efficiency factor
  const efficiencyFactor = factors.typical_efficiency / formData.efficiency;
  
  // Contamination and separation complexity factors
  const contaminationFactor = 1 + (formData.contaminantLevel / 100) * 2;
  const separationFactor = formData.alloySeparation ? 1 + factors.separation_complexity * 0.1 : 1.0;
  const refiningFactor = 1 + (formData.refiningSteps - 1) * 0.15;
  
  // Transport emissions
  const transportEmissions = formData.transport * 0.1 * formData.weight * transportMult;
  
  // Calculate impacts based on material source
  let primary_co2e: number, primary_energy: number, primary_water: number, primary_depletion: number;
  
  if (formData.materialSource === 'virgin') {
    // Virgin ore processing
    primary_co2e = factors.virgin_co2e * formData.weight * energyMult * tempFactor * 
                   efficiencyFactor * eolMult;
    primary_energy = factors.virgin_energy * formData.weight * energyMult * tempFactor * 
                     efficiencyFactor;
    primary_water = factors.virgin_water * formData.weight * (formData.waterUsage / 15);
    primary_depletion = factors.virgin_depletion * formData.weight;
  } else {
    // Scrap processing with contamination factors
    primary_co2e = factors.scrap_co2e * formData.weight * energyMult * tempFactor * 
                   efficiencyFactor * contaminationFactor * separationFactor * 
                   refiningFactor * previousUseMult * eolMult;
    primary_energy = factors.scrap_energy * formData.weight * energyMult * tempFactor * 
                     efficiencyFactor * contaminationFactor * separationFactor * refiningFactor;
    primary_water = factors.scrap_water * formData.weight * (formData.waterUsage / 15) * 
                    contaminationFactor;
    primary_depletion = factors.scrap_depletion * formData.weight * contaminationFactor;
  }
  
  // Add transport emissions and other factors
  primary_co2e += transportEmissions;
  primary_co2e += formData.airPollution * formData.weight * 0.5; // Air pollution factor
  
  const primary_waste = formData.weight * (formData.wastePercent / 100) * contaminationFactor;
  const land_use_impact = formData.landUse * formData.weight;
  
  // Comparison scenario with recycled content
  const recycledPercent = formData.recycledPercent / 100;
  const virginWeight = formData.weight * (1 - recycledPercent);
  const recycledWeight = formData.weight * recycledPercent;

  const comparison_co2e = ((virginWeight * factors.virgin_co2e + recycledWeight * factors.scrap_co2e) * 
                          energyMult * tempFactor * efficiencyFactor) + 
                         (transportEmissions * (1 - recycledPercent * 0.3));
  const comparison_energy = (virginWeight * factors.virgin_energy + recycledWeight * factors.scrap_energy) * 
                           energyMult * tempFactor * efficiencyFactor;
  const comparison_water = (virginWeight * factors.virgin_water + recycledWeight * factors.scrap_water) * 
                          (formData.waterUsage / 15);
  const comparison_depletion = virginWeight * factors.virgin_depletion + recycledWeight * factors.scrap_depletion;
  const comparison_waste = primary_waste * (1 - (recycledPercent * 0.5));

  // Calculate reductions
  const co2_reduction = primary_co2e > 0 ? Math.round(((primary_co2e - comparison_co2e) / primary_co2e * 100)) : 0;
  const energy_reduction = primary_energy > 0 ? Math.round(((primary_energy - comparison_energy) / primary_energy * 100)) : 0;
  const water_reduction = primary_water > 0 ? Math.round(((primary_water - comparison_water) / primary_water * 100)) : 0;
  
  // Calculate metallurgical efficiency score
  const metallurgicalScore = Math.round(
    (formData.efficiency / 100 * 30) + 
    ((20 - formData.contaminantLevel) / 20 * 25) +
    ((8 - Math.min(formData.refiningSteps, 8)) / 8 * 20) +
    (formData.alloySeparation ? 10 : 25) +
    ((formData.endOfLife === 'reuse' || formData.endOfLife === 'recycle') ? 15 : 0)
  );

  return {
    material: factors.name,
    weight: formData.weight,
    recycledPercent: formData.recycledPercent,
    materialSource: formData.materialSource,
    previousUse: formData.previousUse,
    linear: {
      co2e: Math.round(primary_co2e),
      energy: Math.round(primary_energy),
      water: Math.round(primary_water),
      depletion: Math.round(primary_depletion),
      waste: Math.round(primary_waste),
    },
    circular: {
      co2e: Math.round(comparison_co2e),
      energy: Math.round(comparison_energy),
      water: Math.round(comparison_water),
      depletion: Math.round(comparison_depletion),
      waste: Math.round(comparison_waste),
    },
    reductions: {
      co2: co2_reduction,
      energy: energy_reduction,
      water: water_reduction,
    },
    circularityScore: metallurgicalScore,
  };
};