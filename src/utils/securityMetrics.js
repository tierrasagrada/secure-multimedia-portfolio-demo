const metrics = {

  authSuccess: 0,

  authFailure: 0,

  invalidJwt: 0,

  missingImageToken: 0,
  
  notvalidImageToken: 0,

  csrfBlocked: 0,

  rateLimitTriggered: 0
};

export function increment(metric) {

  if(metrics[metric] !== undefined){

    metrics[metric]++;
  }
}

export function getMetrics() {

  return metrics;
}