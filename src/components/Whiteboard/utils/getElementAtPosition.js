import { cursorPositions, toolTypes } from "../../../constants";

export const getElementAtPosition = (x, y, elements) => {
  return elements
    .map((el) => ({
      ...el,
      position: positionWithinelement(x, y, el),
    }))
    .find((el) => !!el.position);
};

const nearPoint = (x, y, x1, y1, cursorPositions) => {
  return Math.abs(x - x1) < 5 && Math.abs(y - y1) < 5 ? cursorPositions : null;
};

const onLine = ({ x1, y1, x2, y2, x, y, maxDistance = 1 }) => {
  const a = { x: x1, y: y1 };
  const b = { x: x2, y: y2 };
  const c = { x, y };

  const offset = distance(a, b) - (distance(a, c) + distance(b, c));
  return Math.abs(offset) < maxDistance ? cursorPositions.INSIDE : null;
};

const distance = (a, b) => {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
};

const positionWithinelement = (x, y, element) => {
  const { type, x1, x2, y1, y2 } = element;

  if (!type) {
    console.warn(
      "Tool type not available while retreiving element's position!"
    );
    return;
  }

  switch (type) {
    case toolTypes.RECTANGLE:
      const topLeft = nearPoint(x, y, x1, y1, cursorPositions.TOP_LEFT);
      const topRight = nearPoint(x, y, x2, y1, cursorPositions.TOP_RIGHT);
      const bottomLeft = nearPoint(x, y, x1, y2, cursorPositions.BOTTOM_LEFT);
      const bottomRight = nearPoint(x, y, x2, y2, cursorPositions.BOTTOM_RIGHT);
      const inside =
        x > x1 && x <= x2 && y >= y1 && y <= y2 ? cursorPositions.INSIDE : null;

      return topLeft || topRight || bottomLeft || bottomRight || inside;

    case toolTypes.TEXT:
      return x + 15 > x1 && x <= x2 && y + 15 >= y1 && y <= y2
        ? cursorPositions.INSIDE
        : null;

    case toolTypes.LINE:
      const on = onLine({ x1, y1, x2, y2, x, y });
      const start = nearPoint(x, y, x1, y1, cursorPositions.START);
      const end = nearPoint(x, y, x2, y2, cursorPositions.END);

      return on || start || end;

    case toolTypes.PENCIL:
      const betweenAnyPoint = element.points.some((point, index) => {
        const nextPoint = element.points[index + 1];
        if (!nextPoint) return false;

        return onLine({
          x1: point.x,
          y1: point.y,
          x2: nextPoint.x,
          y2: nextPoint.y,
          x,
          y,
          maxDistance: 5,
        });
      });

      return betweenAnyPoint ? cursorPositions.INSIDE : null;

    default:
      throw new Error("positionWithinelement tooltype not found!!");
  }
};
