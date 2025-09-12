export const showTooltipOnHoverPlugin = {
  id: 'showTooltipOnHover',
  afterEvent(chart: any, args: any) {
    const { event } = args;
    if (!event) return;

    const meta = chart.getDatasetMeta(0);
    if (!meta || !meta.data[0]) return;
    const arc = meta.data[0];
    const { x, y } = arc.getCenterPoint();
    const { innerRadius, outerRadius } = arc;

    const dx = event.x - x;
    const dy = event.y - y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const isInDoughnut = distance >= innerRadius && distance <= outerRadius;

    if (event.type === 'mousemove' && isInDoughnut) {
      chart.setActiveElements([{ datasetIndex: 0, index: 0 }]);
      chart.tooltip.setActiveElements([{ datasetIndex: 0, index: 0 }], {
        x: event.x,
        y: event.y,
      });
    } else if (event.type === 'mousemove') {
      chart.setActiveElements([]);
      chart.tooltip.setActiveElements([], { x: 0, y: 0 });
    }

    if (event.type === 'mouseout') {
      chart.setActiveElements([]);
      chart.tooltip.setActiveElements([], { x: 0, y: 0 });
    }
  },
};
