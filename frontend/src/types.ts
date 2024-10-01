
export interface Coordinate{
    x: string;
    y: string;
}

export interface IncomingCoordinate {
    type: string;
    payload: Coordinate;  
}