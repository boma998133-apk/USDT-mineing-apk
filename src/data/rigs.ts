import type { RigTier } from '../types/mining';

export const RIG_TIERS: RigTier[] = [
  {
    id: 'cloud-node',
    name: 'Cloud Node S1',
    tierLabel: 'Entry Compute Blade',
    hashrateGH: 12.5,
    usdtPerHour: 0.045,
    powerWatts: 45,
    upgradeCost: 1.5,
    imageUrl: '/src/assets/images/rig_cloud_node_1794857633706.jpg',
    description: 'Low-wattage virtualized compute blade engineered for continuous background yield cycles.',
  },
  {
    id: 'asic-pro',
    name: 'Titanium ASIC M4',
    tierLabel: 'Dual-Turbine Array',
    hashrateGH: 85.0,
    usdtPerHour: 0.32,
    powerWatts: 280,
    upgradeCost: 8.0,
    imageUrl: '/src/assets/images/rig_asic_pro_1794857634541.jpg',
    description: 'High-throughput simulated ASIC chassis with twin machined turbines and high efficiency.',
  },
  {
    id: 'cluster-vault',
    name: 'Liquid Rack V8',
    tierLabel: 'Immersion Manifold Cluster',
    hashrateGH: 420.0,
    usdtPerHour: 1.68,
    powerWatts: 1150,
    upgradeCost: 35.0,
    imageUrl: '/src/assets/images/rig_cluster_vault_1794857634518.jpg',
    description: 'Multi-blade liquid-cooled rack cluster delivering maximum simulated hourly USDT throughput.',
  },
];

export const SESSION_DURATION_MS = 4 * 60 * 60 * 1000; // 4-hour cycle
export const BOOST_DURATION_MS = 15 * 60 * 1000; // 15-minute 2x boost
export const BOOST_COOLDOWN_MS = 30 * 60 * 1000; // 30-minute cooldown
export const DAILY_BONUS_USDT = 0.75;
