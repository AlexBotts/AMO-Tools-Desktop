export interface SystemAndEquipmentCurveData {
    pumpSystemCurveData?: PumpSystemCurveData,
    fanSystemCurveData?: FanSystemCurveData,
    byEquationInputs?: ByEquationInputs,
    byDataInputs?: ByDataInputs,
    equipmentInputs?: EquipmentInputs,
    equipmentCurveFormView?: string,
    systemCurveDataPoints?: Array<{ pointName: string, flowRate: number, yValue: number }>
  }
  
  export interface PumpSystemCurveData {
    specificGravity: number,
    systemLossExponent: number,
    pointOneFlowRate: number,
    pointOneHead: number,
    pointTwo: string,
    pointTwoFlowRate: number,
    pointTwoHead: number,
  }
  
  export interface FanSystemCurveData {
    compressibilityFactor: number,
    systemLossExponent: number,
    pointOneFlowRate: number,
    pointOnePressure: number,
    pointTwo: string,
    pointTwoFlowRate: number,
    pointTwoPressure: number
  }
  
  export interface ByEquationInputs {
    maxFlow: number,
    equationOrder: number,
    constant: number,
    flow: number,
    flowTwo: number,
    flowThree: number,
    flowFour: number,
    flowFive: number,
    flowSix: number
  }
  
  export interface EquipmentInputs {
    measurementOption: number,
    baselineMeasurement: number,
    modificationMeasurementOption: number,
    modifiedMeasurement: number
  }
  
  export interface ByDataInputs {
    dataRows: Array<{ flow: number, yValue: number }>,
    dataOrder: number
  }