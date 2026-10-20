(function (root) {
    'use strict';
    const COMPOSITION_PRACTICES = Object.fromEntries([10, 20].map(maxTarget => [maxTarget,
        Object.fromEntries(['compose', 'missing', 'split'].map(mode => [mode, {
            schemaVersion: 1, id: `w1-${mode}-1-${maxTarget}`, type: 'composition', mode,
            worldId: 'world-1', grade: 1, objectiveIds: ['MA01 OA 06'], skillIds: [mode === 'compose'
                ? 'compose-two-parts' : mode === 'missing' ? 'complete-missing-part' : 'decompose-multiple-ways'],
            minTarget: mode === 'split' ? 4 : 2, maxTarget
        }]))]));
    if (typeof module !== 'undefined' && module.exports) module.exports = { COMPOSITION_PRACTICES };
    else Object.assign(root.KalkuActivityData = root.KalkuActivityData || {}, { COMPOSITION_PRACTICES });
})(globalThis);
