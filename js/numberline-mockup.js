// Independent number-line host. It loads no RPG engine or other mini-games.
'use strict';
const routeRange = document.getElementById('route-range');
const routeDirection = document.getElementById('route-direction');
const routeStep = document.getElementById('route-step');
function mountNumberlinePractice() {
    window.numberlineActivity = KalkuActivities.mountNumberlineActivity(document.getElementById('numberline-activity'), {
        definition: KalkuActivityData.NUMBERLINE_PRACTICES[Number(routeRange.value)][routeDirection.value][Number(routeStep.value)]
    });
}
for (const control of [routeRange, routeDirection, routeStep]) control.addEventListener('change', mountNumberlinePractice);
mountNumberlinePractice();
