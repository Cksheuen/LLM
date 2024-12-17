interface Pos {
    top: number;
    left: number;
}

function length(x: Pos, y: Pos): number {
    console.log('x: ', x);
    console.log('y: ', y);
    console.log('ans', Math.sqrt((x.top - y.top) ** 2 + (x.left - y.left) ** 2));


    return Math.sqrt((x.top - y.top) ** 2 + (x.left - y.left) ** 2);
}

interface RectProps {
    top: number;
    left: number;
    width: number;
    height: number;
}

function isEqual(x: RectProps, y: RectProps): boolean {
    return x.top === y.top && x.left === y.left && x.width === y.width && x.height === y.height;
}

export type {
    Pos,
    RectProps
}

export {
    length,
    isEqual
}