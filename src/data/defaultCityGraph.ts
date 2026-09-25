import { CityNode, RoadEdge, EmergencyTask, VehicleConfig, EmergencyVehicleType } from '../types';

export const DEFAULT_NODES: CityNode[] = [
  { id: 'H1', name: 'Central Trauma Hospital', type: 'trauma_center', x: 220, y: 140, capacity: 48, availableCapacity: 12, priorityScore: 95 },
  { id: 'H2', name: 'Metro East General', type: 'hospital', x: 740, y: 130, capacity: 60, availableCapacity: 28, priorityScore: 80 },
  { id: 'H3', name: 'South Suburban Clinic', type: 'hospital', x: 500, y: 490, capacity: 35, availableCapacity: 19, priorityScore: 70 },
  
  { id: 'F1', name: 'Fire Station #4 (West)', type: 'fire_station', x: 120, y: 320, capacity: 10, availableCapacity: 6, priorityScore: 90 },
  { id: 'F2', name: 'Fire Station #9 (North)', type: 'fire_station', x: 480, y: 90, capacity: 8, availableCapacity: 4, priorityScore: 85 },
  
  { id: 'S1', name: 'Highland Arena Shelter', type: 'shelter', x: 860, y: 340, capacity: 500, availableCapacity: 340, priorityScore: 85 },
  { id: 'S2', name: 'North University Shelter', type: 'shelter', x: 380, y: 60, capacity: 400, availableCapacity: 210, priorityScore: 75 },
  { id: 'S3', name: 'Fairground Relief Camp', type: 'shelter', x: 160, y: 490, capacity: 650, availableCapacity: 490, priorityScore: 80 },

  { id: 'P1', name: 'City Power Grid Station', type: 'power_grid', x: 830, y: 220, capacity: 0, availableCapacity: 0, priorityScore: 88 },
  { id: 'D1', name: 'Civil Defense Supply Depot', type: 'depot', x: 620, y: 410, capacity: 150, availableCapacity: 95, priorityScore: 82 },

  { id: 'I1', name: 'River Bridge North Junction', type: 'intersection', x: 360, y: 240 },
  { id: 'I2', name: 'Downtown Financial Plaza', type: 'intersection', x: 440, y: 330 },
  { id: 'I3', name: 'East Express Interchange', type: 'intersection', x: 670, y: 260 },
  { id: 'I4', name: 'Harbor Gateway Roundabout', type: 'intersection', x: 260, y: 380 },
  { id: 'I5', name: 'South Canal Overpass', type: 'intersection', x: 390, y: 450 },

  { id: 'X1', name: 'Incident: Downtown Gas Rupture', type: 'incident', x: 460, y: 270, priorityScore: 100 },
];

export const DEFAULT_EDGES: RoadEdge[] = [
  // West Cluster & Trauma Center
  { id: 'E1', from: 'H1', to: 'F1', distanceKm: 4.2, speedLimitKmh: 60, type: 'arterial', isBlocked: false, traffic: 'clear', floodRisk: 'none', capacityVehiclesPerHour: 1800, clearanceTimeHours: 1.5 },
  { id: 'E2', from: 'H1', to: 'I1', distanceKm: 3.1, speedLimitKmh: 70, type: 'arterial', isBlocked: false, traffic: 'moderate', floodRisk: 'none', capacityVehiclesPerHour: 2200, clearanceTimeHours: 1.0 },
  { id: 'E3', from: 'H1', to: 'S2', distanceKm: 3.8, speedLimitKmh: 50, type: 'local', isBlocked: false, traffic: 'clear', floodRisk: 'none', capacityVehiclesPerHour: 1200, clearanceTimeHours: 2.0 },

  // North River Corridor
  { id: 'E4', from: 'S2', to: 'F2', distanceKm: 2.6, speedLimitKmh: 60, type: 'arterial', isBlocked: false, traffic: 'clear', floodRisk: 'none', capacityVehiclesPerHour: 1600, clearanceTimeHours: 1.2 },
  { id: 'E5', from: 'F2', to: 'H2', distanceKm: 6.4, speedLimitKmh: 90, type: 'highway', isBlocked: false, traffic: 'clear', floodRisk: 'none', capacityVehiclesPerHour: 3400, clearanceTimeHours: 2.5 },
  { id: 'E6', from: 'F2', to: 'I1', distanceKm: 3.5, speedLimitKmh: 60, type: 'arterial', isBlocked: false, traffic: 'moderate', floodRisk: 'none', capacityVehiclesPerHour: 1900, clearanceTimeHours: 1.4 },

  // Bridge & Central River Crossing
  { id: 'E7', from: 'I1', to: 'X1', distanceKm: 2.1, speedLimitKmh: 50, type: 'local', isBlocked: false, traffic: 'heavy', floodRisk: 'none', capacityVehiclesPerHour: 1400, clearanceTimeHours: 3.0 },
  { id: 'E8', from: 'I1', to: 'I2', distanceKm: 2.8, speedLimitKmh: 60, type: 'bridge', isBlocked: false, traffic: 'heavy', floodRisk: 'none', capacityVehiclesPerHour: 2000, clearanceTimeHours: 4.5 },
  { id: 'E9', from: 'I1', to: 'I4', distanceKm: 3.9, speedLimitKmh: 70, type: 'arterial', isBlocked: false, traffic: 'clear', floodRisk: 'none', capacityVehiclesPerHour: 2100, clearanceTimeHours: 1.8 },

  // Incident Proximity
  { id: 'E10', from: 'X1', to: 'I2', distanceKm: 1.4, speedLimitKmh: 40, type: 'local', isBlocked: true, blockageReason: 'Hazard blast debris & downed power pole', traffic: 'gridlock', floodRisk: 'none', capacityVehiclesPerHour: 800, clearanceTimeHours: 5.0 },
  { id: 'E11', from: 'X1', to: 'I3', distanceKm: 4.8, speedLimitKmh: 70, type: 'arterial', isBlocked: false, traffic: 'moderate', floodRisk: 'none', capacityVehiclesPerHour: 2400, clearanceTimeHours: 2.0 },

  // Downtown & East Highway
  { id: 'E12', from: 'I2', to: 'I3', distanceKm: 5.2, speedLimitKmh: 80, type: 'highway', isBlocked: false, traffic: 'heavy', floodRisk: 'none', capacityVehiclesPerHour: 3200, clearanceTimeHours: 2.8 },
  { id: 'E13', from: 'I2', to: 'I5', distanceKm: 3.3, speedLimitKmh: 60, type: 'arterial', isBlocked: false, traffic: 'moderate', floodRisk: 'moderate', capacityVehiclesPerHour: 1700, clearanceTimeHours: 2.2 },
  { id: 'E14', from: 'I3', to: 'H2', distanceKm: 3.7, speedLimitKmh: 75, type: 'arterial', isBlocked: false, traffic: 'clear', floodRisk: 'none', capacityVehiclesPerHour: 2600, clearanceTimeHours: 1.5 },
  { id: 'E15', from: 'I3', to: 'P1', distanceKm: 2.5, speedLimitKmh: 50, type: 'local', isBlocked: false, traffic: 'clear', floodRisk: 'none', capacityVehiclesPerHour: 1100, clearanceTimeHours: 1.0 },
  { id: 'E16', from: 'I3', to: 'S1', distanceKm: 4.4, speedLimitKmh: 80, type: 'highway', isBlocked: false, traffic: 'clear', floodRisk: 'none', capacityVehiclesPerHour: 3600, clearanceTimeHours: 1.7 },
  { id: 'E17', from: 'P1', to: 'S1', distanceKm: 3.2, speedLimitKmh: 50, type: 'local', isBlocked: false, traffic: 'clear', floodRisk: 'none', capacityVehiclesPerHour: 1000, clearanceTimeHours: 1.2 },

  // Harbor & Southwest Sector
  { id: 'E18', from: 'F1', to: 'I4', distanceKm: 3.4, speedLimitKmh: 60, type: 'arterial', isBlocked: false, traffic: 'clear', floodRisk: 'none', capacityVehiclesPerHour: 1900, clearanceTimeHours: 1.3 },
  { id: 'E19', from: 'F1', to: 'S3', distanceKm: 4.6, speedLimitKmh: 70, type: 'arterial', isBlocked: false, traffic: 'clear', floodRisk: 'none', capacityVehiclesPerHour: 2000, clearanceTimeHours: 1.6 },
  { id: 'E20', from: 'I4', to: 'S3', distanceKm: 3.6, speedLimitKmh: 60, type: 'arterial', isBlocked: false, traffic: 'clear', floodRisk: 'none', capacityVehiclesPerHour: 1800, clearanceTimeHours: 1.4 },
  { id: 'E21', from: 'I4', to: 'I5', distanceKm: 3.2, speedLimitKmh: 60, type: 'arterial', isBlocked: false, traffic: 'clear', floodRisk: 'none', capacityVehiclesPerHour: 1700, clearanceTimeHours: 1.5 },

  // South Canal & Logistics Depot
  { id: 'E22', from: 'I5', to: 'H3', distanceKm: 3.1, speedLimitKmh: 60, type: 'arterial', isBlocked: false, traffic: 'clear', floodRisk: 'moderate', capacityVehiclesPerHour: 1600, clearanceTimeHours: 2.1 },
  { id: 'E23', from: 'I5', to: 'D1', distanceKm: 5.4, speedLimitKmh: 70, type: 'highway', isBlocked: false, traffic: 'clear', floodRisk: 'none', capacityVehiclesPerHour: 2800, clearanceTimeHours: 1.9 },
  { id: 'E24', from: 'H3', to: 'D1', distanceKm: 3.8, speedLimitKmh: 60, type: 'arterial', isBlocked: false, traffic: 'clear', floodRisk: 'none', capacityVehiclesPerHour: 1800, clearanceTimeHours: 1.3 },
  { id: 'E25', from: 'D1', to: 'S1', distanceKm: 6.2, speedLimitKmh: 80, type: 'highway', isBlocked: false, traffic: 'clear', floodRisk: 'none', capacityVehiclesPerHour: 3100, clearanceTimeHours: 2.0 },
  { id: 'E26', from: 'S3', to: 'H3', distanceKm: 7.5, speedLimitKmh: 80, type: 'highway', isBlocked: false, traffic: 'clear', floodRisk: 'none', capacityVehiclesPerHour: 3000, clearanceTimeHours: 2.4 },
];

export const VEHICLE_CONFIGS: Record<EmergencyVehicleType, VehicleConfig> = {
  ambulance: {
    type: 'ambulance',
    name: 'Rapid EMS Ambulance',
    speedMultiplier: 1.35,
    sirenClearanceBonus: 0.7, // can bypass 70% of traffic delay
    maxFloodPassable: 'moderate',
    icon: 'Ambulance',
  },
  fire_truck: {
    type: 'fire_truck',
    name: 'Heavy Fire Engine #4',
    speedMultiplier: 1.1,
    sirenClearanceBonus: 0.8,
    maxFloodPassable: 'moderate',
    icon: 'Flame',
  },
  police_cruiser: {
    type: 'police_cruiser',
    name: 'Tactical Police Cruiser',
    speedMultiplier: 1.45,
    sirenClearanceBonus: 0.9,
    maxFloodPassable: 'none',
    icon: 'ShieldAlert',
  },
  evacuation_bus: {
    type: 'evacuation_bus',
    name: 'Mass Evacuation Carrier',
    speedMultiplier: 0.85,
    sirenClearanceBonus: 0.2, // bulky, stuck in traffic
    maxFloodPassable: 'none',
    icon: 'Bus',
  },
  heavy_rescue: {
    type: 'heavy_rescue',
    name: 'Rescue Bulldozer / Cranes',
    speedMultiplier: 0.65,
    sirenClearanceBonus: 0.1,
    maxFloodPassable: 'severe',
    icon: 'Truck',
  },
};

export const DEFAULT_TASKS: EmergencyTask[] = [
  {
    id: 'T1',
    title: 'Isolate City Gas Main Valve (Grid Sector 4)',
    category: 'hazard_containment',
    durationMinutes: 25,
    dependencies: [],
    status: 'completed',
  },
  {
    id: 'T2',
    title: 'Extinguish Downtown Rupture Flash Fire',
    category: 'hazard_containment',
    durationMinutes: 40,
    dependencies: ['T1'],
    status: 'in_progress',
  },
  {
    id: 'T3',
    title: 'Clear Structural Concrete Debris on E10',
    category: 'debris_clearance',
    durationMinutes: 60,
    dependencies: ['T2'],
    status: 'pending',
  },
  {
    id: 'T4',
    title: 'Deploy Trauma Triage Staging Tents at I2',
    category: 'medical_triage',
    durationMinutes: 30,
    dependencies: ['T1'],
    status: 'pending',
  },
  {
    id: 'T5',
    title: 'Establish Green Siren Corridor to H1 Trauma Center',
    category: 'evacuation_corridor',
    durationMinutes: 15,
    dependencies: ['T4'],
    status: 'pending',
  },
  {
    id: 'T6',
    title: 'Re-energize Backup Power Grid Station P1',
    category: 'utility_restore',
    durationMinutes: 45,
    dependencies: ['T2'],
    status: 'pending',
  },
  {
    id: 'T7',
    title: 'Begin Mass Civilian Bus Conveyance to S1 Shelter',
    category: 'evacuation_corridor',
    durationMinutes: 50,
    dependencies: ['T3', 'T5'],
    status: 'pending',
  },
];
