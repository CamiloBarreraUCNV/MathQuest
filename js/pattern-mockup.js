// Independent workshop: no treasure, orchard, game engine or saved progress.
'use strict';
const patternFamily = document.getElementById('pattern-family');
const patternMode = document.getElementById('pattern-mode');
const patternRange = document.getElementById('pattern-range');
function mountPatternPractice() {
    document.getElementById('pattern-range-setting').hidden = patternFamily.value !== 'number';
    window.patternActivity = KalkuActivities.mountPatternActivity(document.getElementById('pattern-activity'), {
        definition: KalkuActivityData.PATTERN_PRACTICES[Number(patternRange.value)][patternFamily.value][patternMode.value]
    });
}
for (const control of [patternFamily, patternMode, patternRange]) control.addEventListener('change', mountPatternPractice);
mountPatternPractice();
