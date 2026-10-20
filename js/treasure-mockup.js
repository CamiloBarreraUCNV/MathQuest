// Standalone host: no game engine, rewards or persistence are loaded here.
'use strict';
const rangeSelector = document.getElementById('practice-range');
function mountPractice() {
    window.treasureActivity?.destroy();
    const maxTarget = Number(rangeSelector.value);
    window.treasureActivity = KalkuActivities.mountQuantityActivity(
        document.getElementById('treasure-activity'),
        { definition: maxTarget === 20 ? KalkuActivityData.QUANTITY_PRACTICE_20 : KalkuActivityData.QUANTITY_PRACTICE }
    );
}
rangeSelector.addEventListener('change', mountPractice);
mountPractice();
