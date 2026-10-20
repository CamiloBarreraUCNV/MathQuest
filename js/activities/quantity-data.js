// Shared authoring source for the standalone practice and the integrated pilot.
(function (root) {
    'use strict';
    const QUANTITY_PRACTICE = {
        schemaVersion: 1,
        id: 'w1-quantity-practice-1-10',
        type: 'quantity',
        mode: 'populate',
        worldId: 'world-1',
        grade: 1,
        objectiveIds: ['MA01 OA 03'],
        skillIds: ['represent-quantity-1-10'],
        instruction: '¡Prepara {target} {objects} para zarpar!',
        objects: {
            singular: 'moneda',
            plural: 'monedas',
            image: 'assets/treasure-activity/coin-gold.png'
        },
        rules: {
            minTarget: 1,
            maxTarget: 10,
            totalObjects: 10,
            initialQuantity: 0,
            responseKind: 'final-quantity'
        },
        presentation: { reserveTitle: 'Monedas del barco', destinationTitle: 'Tu cofre' }
    };
    const QUANTITY_PRACTICE_20 = JSON.parse(JSON.stringify(QUANTITY_PRACTICE));
    Object.assign(QUANTITY_PRACTICE_20, {
        id: 'w1-quantity-practice-1-20',
        skillIds: ['represent-quantity-1-20', 'group-ten-units']
    });
    Object.assign(QUANTITY_PRACTICE_20.rules, { maxTarget: 20, totalObjects: 20, allowTens: true });
    const data = { QUANTITY_PRACTICE, QUANTITY_PRACTICE_20 };
    if (typeof module !== 'undefined' && module.exports) module.exports = data;
    else root.KalkuActivityData = data;
})(typeof globalThis !== 'undefined' ? globalThis : this);
