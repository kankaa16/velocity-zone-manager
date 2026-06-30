import LineString from "ol/geom/LineString";
import Polygon from "ol/geom/Polygon";


function addUTurn(
    coords: number[][],
    from: number[],
    to: number[],
    radius = 3,
    segments = 8
) {
    const dir = to[0] > from[0] ? 1 : -1;

    // move slightly past the end
    coords.push([from[0] + dir * radius, from[1]]);

    // quarter-circle down
    for (let i = 1; i <= segments; i++) {

        const t = i / segments;
        const angle = Math.PI / 2 * t;

        coords.push([
            from[0] + dir * radius * Math.cos(angle),
            from[1] + (to[1] - from[1]) * t,
        ]);
    }

    coords.push(to);
}

export function generateMowingPath(
    polygon: Polygon,
    lanes = 14
): LineString {

    const [minX, minY, maxX, maxY] = polygon.getExtent();

    const spacing = (maxY - minY) / lanes;

    const coords: number[][] = [];

    let reverse = false;
    let previousEnd: number[] | null = null;

    for (let y = minY + spacing / 2; y < maxY; y += spacing) {

        let left: number[] | null = null;
        let right: number[] | null = null;

        // finer search so polygon edges look smooth
        const step = (maxX - minX) / 500;

        for (let x = minX; x <= maxX; x += step) {

            if (polygon.intersectsCoordinate([x, y])) {

                if (!left)
                    left = [x, y];

                right = [x, y];
            }
        }

        if (!left || !right)
            continue;

        const start = reverse ? right : left;
        const end   = reverse ? left : right;

        if (!previousEnd) {

            coords.push(start);

        } else {

            // vertical U-turn
            addUTurn(
    coords,
    previousEnd,
    start,
    spacing * 0.45,
    60
);
        }

        coords.push(end);

        previousEnd = end;

        reverse = !reverse;
    }

    return new LineString(coords);
}