import { ServerRespond } from './DataStreamer';

export interface Row {
  price_abc : number,
  price_def : number,
  ratio : number,
  timestamp: Date,
  upper_bound : number,
  lower_bound : number,
  trigger_alert : number | undefined,
}

// The upper_bound and lower_bound are pretty much constant for any data
// point. This is how we will be able to maintain them as steady upper and lower
// lines in the graph.

// The trigger_alert field is pretty much just a field that has a value (e.g. the ratio)
// if the threshold is passed by the ratio. Otherwise if the ratio remains within the
// threshold, then no value/undefined will suffice.

export class DataManipulator {
  static generateRow(serverRespond: ServerRespond[]): Row {
    const priceABC = (serverRespond[0].top_ask.price + serverRespond[0].top_bid.price) / 2;
    const priceDEF = (serverRespond[1].top_ask.price + serverRespond[1].top_bid.price) / 2;
    const ratio = priceABC/priceDEF
    const upperBound = 1 + 0.05;
    const lowerBound = 1 - 0.05;
      return {
        price_abc: priceABC,
        price_def: priceDEF,
        ratio,
        timestamp: serverRespond[0].timestamp > serverRespond[1].timestamp ? serverRespond[0].timestamp : serverRespond[1].timestamp,
        upper_bound: upperBound,
        lower_bound: lowerBound,
        trigger_alert: (ratio > upperBound || ratio < lowerBound) ? ratio : undefined,
      };
  }
}
