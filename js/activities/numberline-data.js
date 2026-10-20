(function (root) {
    'use strict';
    const NUMBERLINE_PRACTICES = Object.fromEntries([20, 100].map(maxNumber => [maxNumber,
        Object.fromEntries(['forward', 'backward', 'mixed'].map(direction => [direction,
            Object.fromEntries([0, 1, 2, 5, 10].map(stepSize => [stepSize, {
                schemaVersion: 1, type: 'numberline', id: `w1-numberline-${direction}-${stepSize}-${maxNumber}`,
                worldId: 'world-1', grade: 1, objectiveIds: ['MA01 OA 01'], skillIds: ['count-with-numberline', 'represent-jump-route'],
                maxNumber, direction, stepSize
            }]))]))]));
    if (typeof module !== 'undefined' && module.exports) module.exports = { NUMBERLINE_PRACTICES };
    else Object.assign(root.KalkuActivityData = root.KalkuActivityData || {}, { NUMBERLINE_PRACTICES });
})(globalThis);
