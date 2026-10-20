(function (root) {
    'use strict';
    const PATTERN_PRACTICES = Object.fromEntries([20, 100].map(maxNumber => [maxNumber,
        Object.fromEntries(['AB', 'AAB', 'ABC', 'number'].map(family => [family,
            Object.fromEntries(['continue', 'create', 'repair'].map(mode => [mode, {
                schemaVersion: 1, id: `w1-pattern-${family}-${mode}-${maxNumber}`, type: 'pattern', family, mode,
                worldId: 'world-1', grade: 1, objectiveIds: ['MA01 OA 11'], skillIds: [`${mode}-${family}-pattern`], maxNumber
            }]))]))]));
    if (typeof module !== 'undefined' && module.exports) module.exports = { PATTERN_PRACTICES };
    else Object.assign(root.KalkuActivityData = root.KalkuActivityData || {}, { PATTERN_PRACTICES });
})(globalThis);
