class MapService {
  static createBubbleMap(results) {
    const bubbleMap = new Map();
    // Populate the map with the invoice number as key and the invoice object as value
    results.forEach((result) => bubbleMap.set(result.numero_factura, result));

    return bubbleMap;
  }
}

module.exports = MapService;
