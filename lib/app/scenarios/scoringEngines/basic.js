function score(scenario, outcomes = {}, options = {}) {
  const defaultLevel = options.defaultLevel || 'medium';

  // [KE] there is nothing magical about the use of pi here; it's just a convient approximation for
  //      "a little more than 3" which, during testing, proved to be the most useful base amplitude
  const amplitude = Math.PI - (Math.max(0, Math.min(10, scenario.actions.length - 1)) / 10);

  const deltas = scenario.actions.map((action) => {
    const evidence = scenario.evidenceLevels[outcomes[action.id] || defaultLevel];
    const weight = scenario.importanceWeights[action.importance];

    return (amplitude * weight) * (evidence - scenario.prior);
  });

  if (deltas.length === 0) {
    return scenario.prior;
  }

  const total = scenario.prior + (deltas.reduce((sum, value) => sum + value, 0) / deltas.length);
  const constrain = total > scenario.prior ? Math.floor : Math.round;

  return Math.max(0.1, Math.min(0.9, constrain(total * 10) / 10));
}

module.exports = score;
