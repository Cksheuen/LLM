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

export type {
    Pos
}

export {
    length
}