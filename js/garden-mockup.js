// Independent garden host: no treasure, game engine or persistence is loaded.
'use strict';
const gardenRange = document.getElementById('garden-range');
const gardenMode = document.getElementById('garden-mode');
function mountGardenPractice() {
    window.gardenActivity = KalkuActivities.mountCompositionActivity(document.getElementById('garden-activity'), {
        definition: KalkuActivityData.COMPOSITION_PRACTICES[Number(gardenRange.value)][gardenMode.value]
    });
}
gardenRange.addEventListener('change', mountGardenPractice);
gardenMode.addEventListener('change', mountGardenPractice);
mountGardenPractice();
