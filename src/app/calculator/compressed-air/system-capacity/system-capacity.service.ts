import { Injectable } from '@angular/core';
import { AirSystemCapacityInput } from '../../../shared/models/standalone';
import { Settings } from '../../../shared/models/settings';
import { ConvertUnitsService } from '../../../shared/convert-units/convert-units.service';

@Injectable()
export class SystemCapacityService {

  inputs: AirSystemCapacityInput;
  constructor(private convertUnitsService: ConvertUnitsService) {
    this.inputs = this.getSystemCapacityDefaults();
  }

  getSystemCapacityDefaults(): AirSystemCapacityInput {
    return {
      receiverCapacities: [0],
      customPipes: [],
      oneHalf: 0,
      threeFourths: 0,
      one: 0,
      oneAndOneFourth: 0,
      oneAndOneHalf: 0,
      two: 0,
      twoAndOneHalf: 0,
      three: 0,
      threeAndOneHalf: 0,
      four: 0,
      five: 0,
      six: 0,
    };
  }

  getSystemCapacityExample(): AirSystemCapacityInput {
    return {
      receiverCapacities: [400, 500, 660, 1060],
      customPipes: [],
      oneHalf: 2000,
      threeFourths: 2000,
      one: 1000,
      oneAndOneFourth: 200,
      oneAndOneHalf: 100,
      two: 500,
      twoAndOneHalf: 0,
      three: 300,
      threeAndOneHalf: 0,
      four: 1000,
      five: 0,
      six: 0,
    };
  }

  convertAirSystemCapacityExample(inputs: AirSystemCapacityInput, settings: Settings) {
    let tmpInputs: AirSystemCapacityInput = inputs;
    if (settings.unitsOfMeasure == 'Metric') {
      tmpInputs.oneHalf = Math.round(this.convertUnitsService.value(tmpInputs.oneHalf).from('ft').to('m') * 100) / 100;
      tmpInputs.threeFourths = Math.round(this.convertUnitsService.value(tmpInputs.threeFourths).from('ft').to('m') * 100) / 100;
      tmpInputs.one = Math.round(this.convertUnitsService.value(tmpInputs.one).from('ft').to('m') * 100) / 100;
      tmpInputs.oneAndOneFourth = Math.round(this.convertUnitsService.value(tmpInputs.oneAndOneFourth).from('ft').to('m') * 100) / 100;
      tmpInputs.oneAndOneHalf = Math.round(this.convertUnitsService.value(tmpInputs.oneAndOneHalf).from('ft').to('m') * 100) / 100;
      tmpInputs.two = Math.round(this.convertUnitsService.value(tmpInputs.two).from('ft').to('m') * 100) / 100;
      tmpInputs.twoAndOneHalf = Math.round(this.convertUnitsService.value(tmpInputs.twoAndOneHalf).from('ft').to('m') * 100) / 100;
      tmpInputs.three = Math.round(this.convertUnitsService.value(tmpInputs.three).from('ft').to('m') * 100) / 100;
      tmpInputs.threeAndOneHalf = Math.round(this.convertUnitsService.value(tmpInputs.threeAndOneHalf).from('ft').to('m') * 100) / 100;
      tmpInputs.four = Math.round(this.convertUnitsService.value(tmpInputs.four).from('ft').to('m') * 100) / 100;
      tmpInputs.five = Math.round(this.convertUnitsService.value(tmpInputs.five).from('ft').to('m') * 100) / 100;
      tmpInputs.six = Math.round(this.convertUnitsService.value(tmpInputs.six).from('ft').to('m') * 100) / 100;
      for (let i = 0; i < tmpInputs.receiverCapacities.length; i++) {
        tmpInputs.receiverCapacities[i] = Math.round(this.convertUnitsService.value(tmpInputs.receiverCapacities[i]).from('gal').to('m3') * 100) / 100;
      }
    }
    return tmpInputs;
  }
}