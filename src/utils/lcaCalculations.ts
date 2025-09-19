import { LCAFormData } from '@/components/LCAForm';
import { LCAResults } from '@/components/LCAResults';

// Hardcoded LCA factors for different materials
const lcaFactors = {
  aluminum: { 
    name: "Aluminum", 
    virgin_co2e: 12, 
    virgin_energy: 170, 
    virgin_depletion: 6, 
    virgin_water: 20, 
    recycled_co2e: 0.6, 
    recycled_energy: 10, 
    recycled_depletion: 0.1, 
    recycled_water: 2 
  },
  copper: { 
    name: "Copper", 
    virgin_co2e: 8, 
    virgin_energy: 120, 
    virgin_depletion: 10, 
    virgin_water: 25, 
    recycled_co2e: 0.5, 
    recycled_energy: 9, 
    recycled_depletion: 0.2, 
    recycled_water: 3 
  },
  critical_mineral: { 
    name: "Critical Minerals", 
    virgin_co2e: 30, 
    virgin_energy: 350, 
    virgin_depletion: 25, 
    virgin_water: 50, 
    recycled_co2e: 2.5, 
    recycled_energy: 30, 
    recycled_depletion: 0.5, 
    recycled_water: 5 
  },
  steel: { 
    name: "Steel", 
    virgin_co2e: 2.1, 
    virgin_energy: 25, 
    virgin_depletion: 1.5, 
    virgin_water: 3, 
    recycled_co2e: 0.6, 
    recycled_energy: 8, 
    recycled_depletion: 0.1, 
    recycled_water: 0.5 
  },
  lithium: { 
    name: "Lithium", 
    virgin_co2e: 35, 
    virgin_energy: 400, 
    virgin_depletion: 30, 
    virgin_water: 60, 
    recycled_co2e: 3, 
    recycled_energy: 35, 
    recycled_depletion: 0.8, 
    recycled_water: 6 
  }
} as const;

const energyMultipliers = { 
  grid: 1.0, 
  renewable: 0.1, 
  coal: 1.8, 
  natural_gas: 0.7 
} as const;

const eolMultipliers = { 
  recycle: 0.1, 
  landfill: 1.2, 
  incineration: 0.8, 
  reuse: 0.05 
} as const;

export const calculateLCAResults = (formData: LCAFormData): LCAResults => {
  const factors = lcaFactors[formData.material as keyof typeof lcaFactors];
  const energyMult = energyMultipliers[formData.energySource as keyof typeof energyMultipliers] * 
                    eolMultipliers[formData.endOfLife as keyof typeof eolMultipliers];
  
  const recycledPercent = formData.recycledPercent / 100;
  const tempFactor = formData.temperature > 1000 ? 1.2 : (formData.temperature < 600 ? 0.9 : 1.0);
  const efficiencyFactor = 1 / (formData.efficiency / 100);
  const transportEmissions = formData.transport * 0.1 * formData.weight;

  // Linear (traditional) calculations
  const linear_co2e = (factors.virgin_co2e * formData.weight * energyMult * tempFactor * efficiencyFactor) + transportEmissions;
  const linear_energy = factors.virgin_energy * formData.weight * energyMult * tempFactor * efficiencyFactor;
  const linear_water = factors.virgin_water * formData.weight * (formData.waterUsage / 15);
  const linear_depletion = factors.virgin_depletion * formData.weight;
  const linear_waste = formData.weight * (formData.wastePercent / 100);

  // Circular calculations with recycled content
  const virginWeight = formData.weight * (1 - recycledPercent);
  const recycledWeight = formData.weight * recycledPercent;

  const circular_co2e = ((virginWeight * factors.virgin_co2e + recycledWeight * factors.recycled_co2e) * 
                        energyMult * tempFactor * efficiencyFactor) + 
                       (transportEmissions * (1 - recycledPercent * 0.3));
  const circular_energy = (virginWeight * factors.virgin_energy + recycledWeight * factors.recycled_energy) * 
                         energyMult * tempFactor * efficiencyFactor;
  const circular_water = (virginWeight * factors.virgin_water + recycledWeight * factors.recycled_water) * 
                        (formData.waterUsage / 15);
  const circular_depletion = virginWeight * factors.virgin_depletion + recycledWeight * factors.recycled_depletion;
  const circular_waste = linear_waste * (1 - (recycledPercent * 0.5));

  // Calculate reductions
  const co2_reduction = linear_co2e > 0 ? Math.round(((linear_co2e - circular_co2e) / linear_co2e * 100)) : 0;
  const energy_reduction = linear_energy > 0 ? Math.round(((linear_energy - circular_energy) / linear_energy * 100)) : 0;
  const water_reduction = linear_water > 0 ? Math.round(((linear_water - circular_water) / linear_water * 100)) : 0;
  
  // Calculate circularity score
  const circularityScore = Math.round(
    (recycledPercent * 60) + 
    (formData.efficiency / 100 * 20) + 
    ((formData.endOfLife === 'reuse' || formData.endOfLife === 'recycle') ? 20 : 5)
  );

  return {
    material: factors.name,
    weight: formData.weight,
    recycledPercent: formData.recycledPercent,
    linear: {
      co2e: Math.round(linear_co2e),
      energy: Math.round(linear_energy),
      water: Math.round(linear_water),
      depletion: Math.round(linear_depletion),
      waste: Math.round(linear_waste),
    },
    circular: {
      co2e: Math.round(circular_co2e),
      energy: Math.round(circular_energy),
      water: Math.round(circular_water),
      depletion: Math.round(circular_depletion),
      waste: Math.round(circular_waste),
    },
    reductions: {
      co2: co2_reduction,
      energy: energy_reduction,
      water: water_reduction,
    },
    circularityScore,
  };
};