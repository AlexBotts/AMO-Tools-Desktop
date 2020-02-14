declare var Module: any;

export const pumpTypesConstant: Array<{ value: number, display: string, enumVal?: any }> = [
    {
        value: 0,
        display: 'End Suction Slurry',
        enumVal: Module ? !undefined: Module.PumpStyle.END_SUCTION_SLURRY 
    },
    {
        value: 1,
        display: 'End Suction Sewage',
        enumVal: Module ? !undefined: Module.PumpStyle.END_SUCTION_SEWAGE
    },
    {
        value: 2,
        display: 'End Suction Stock',
        enumVal: Module ? !undefined: Module.PumpStyle.END_SUCTION_STOCK
    },
    {
        value: 3,
        display: 'End Suction Submersible Sewage',
        enumVal: Module ? !undefined: Module.PumpStyle.END_SUCTION_SUBMERSIBLE_SEWAGE
    },
    {
        value: 4,
        display: 'API Double Suction',
        enumVal: Module ? !undefined: Module.PumpStyle.API_DOUBLE_SUCTION
    },
    {
        value: 5,
        display: 'Multistage Boiler Feed',
        enumVal: Module ? !undefined: Module.PumpStyle.MULTISTAGE_BOILER_FEED
    },
    {
        value: 6,
        display: 'End Suction ANSI/API',
        enumVal: Module ? !undefined: Module.PumpStyle.END_SUCTION_ANSI_API
    },
    {
        value: 7,
        display: 'Axial Flow',
        enumVal: Module ? !undefined: Module.PumpStyle.AXIAL_FLOW
    },
    {
        value: 8,
        display: 'Double Suction',
        enumVal: Module ? !undefined: Module.PumpStyle.DOUBLE_SUCTION
    },
    {
        value: 9,
        display: 'Vertical Turbine',
        enumVal: Module ? !undefined: Module.PumpStyle.VERTICAL_TURBINE
    },
    {
        value: 10,
        display: 'Large End Suction',
        enumVal: Module ? !undefined: Module.PumpStyle.LARGE_END_SUCTION
    },
    {
        value: 11,
        display: 'Specified Optimal Efficiency',
        enumVal: Module ? !undefined: Module.PumpStyle.SPECIFIED_OPTIMAL_EFFICIENCY
    }
    // When user selects below they need a way to provide the optimal efficiency
    // 'Specified Optimal Efficiency'
];

export const driveConstants: Array<{ value: number, display: string, enumVal?: any }> = [
    {
        value: 0,
        display: 'Direct Drive',
        enumVal: Module ? !undefined: Module.Drive.DIRECT_DRIVE
    },
    {
        value: 1,
        display: 'V-Belt Drive',
        enumVal: Module ? !undefined: Module.Drive.V_BELT_DRIVE
    },
    {
        value: 2,
        display: 'Notched V-Belt Drive',
        enumVal: Module ? !undefined: Module.Drive.N_V_BELT_DRIVE
    },
    {
        value: 3,
        display: 'Synchronous Belt Drive',
        enumVal: Module ? !undefined: Module.Drive.S_BELT_DRIVE
    },
    {
        value: 4,
        display: 'Specified Efficiency',
        enumVal: Module ? !undefined: Module.Drive.SPECIFIED
    }
];

export const fluidProperties = {
    'Acetone': { beta: 0.00079, tref: 77, density: 49, kinViscosity: 0.41, boiling: 132.89, melting: -138.5 },
    'Ammonia': { beta: 0.00136, tref: 77, density: 51.4, kinViscosity: 0.3, boiling: -28.01, melting: -107.91 },
    'Dichlorodifluoromethane refrigerant R-12': { beta: 0.00144, tref: 77, density: 81.8, kinViscosity: 0.198, boiling: -21.6, melting: -251.9 },
    'Ethanol': { beta: 0.00061, tref: 77, density: 49, kinViscosity: 1.52, boiling: 172.99, melting: -173.5 },
    'Ethylene glycol': { beta: 0.00032, tref: 77, density: 68.5, kinViscosity: 17.8, boiling: 387.1, melting: 8.8 },
    'Gasoline': { beta: 0.00053, tref: 60, density: 46, kinViscosity: 0.88, boiling: 258.9, melting: -70.9 },
    'Glycerine (glycerol)': { beta: 0.00028, tref: 77, density: 78.66, kinViscosity: 648, boiling: 554.0, melting: 64.0 },
    'Kerosene - jet fuel': { beta: 0.00055, tref: 60, density: 51.2, kinViscosity: 2.71, boiling: 572.0, melting: -10 },
    'Methanol': { beta: 0.00083, tref: 77, density: 49.1, kinViscosity: 0.75, boiling: 148.5, melting: -143.7 },
    'n-Octane': { beta: 0.00063, tref: 59, density: 43.6, kinViscosity: 1.266, boiling: 258.9, melting: -70.9 },
    'Petroleum': { beta: 0.00056, tref: 60, density: 44.4, kinViscosity: 0.198, boiling: 258.9, melting: -70.9 }
};

export const fluidTypes: Array<string> = [
    'Acetone',
    'Ammonia',
    'Dichlorodifluoromethane refrigerant R-12',
    'Ethanol',
    'Ethylene glycol',
    'Gasoline',
    'Glycerine (glycerol)',
    'Kerosene - jet fuel',
    'Methanol',
    'n-Octane',
    'Other',
    'Petroleum',
    'Water'
];

export const motorEfficiencyConstants: Array<{ value: number, display: string, enumVal?: any }> = [
    {
        value: 0,
        display: 'Standard Efficiency',
        enumVal: Module ? !undefined: Module.MotorEfficiencyClass.STANDARD
    },
    {
        value: 1,
        display: 'Energy Efficient',
        enumVal: Module ? !undefined: Module.MotorEfficiencyClass.ENERGY_EFFICIENT
    },
    {
        value: 2,
        display: 'Premium Efficient',
        enumVal: Module ? !undefined: Module.MotorEfficiencyClass.PREMIUM
    },
    {
        value: 3,
        display: 'Specified',
        enumVal: Module ? !undefined: Module.MotorEfficiencyClass.SPECIFIED
    }
]