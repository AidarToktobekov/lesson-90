import { useEffect, useRef, useState } from 'react';
import './App.css'
import { Coordinate, IncomingCoordinate } from './types';

const App = ()=> {
  const [coordinate, setCoordinate] = useState<Coordinate[]>([]);
  const [coordinateText, setCoordinateText] = useState<Coordinate>({
    x: '0',
    y: '0',
  });
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket('ws://localhost:8000/chat');
    ws.current.onclose = () => console.log("ws closed");

    ws.current.onmessage = event => {
      const decodedCoordinate = JSON.parse(event.data) as IncomingCoordinate;

      if (decodedCoordinate.type === 'SET_COORDINATES') {
        setCoordinate((coordinate) => [...coordinate, decodedCoordinate.payload]);
      }
    };

  }, []);
  const changeCoordinate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCoordinateText((prev)=>({...prev, [e.target.name]: e.target.value,}));
  };


  const sendCoordinate = (e: React.FormEvent) => {
    e.preventDefault();

    if (!ws.current) return;
    ws.current.send(JSON.stringify({
      type: 'SET_COORDINATES',
      payload: coordinateText,
    }));
    setCoordinateText({
      x: '0',
      y: '0',
    })
  };

  return (
    <>
        <div>
          {coordinate.length > 0 && (
            <canvas width={coordinate[coordinate.length -1].x} height={coordinate[coordinate.length-1].y} style={{border: '1px solid #000'}}></canvas>
          )}
        </div>
        <div>
      <form onSubmit={sendCoordinate}>
        <input
          type="number"
          name="x"
          value={coordinateText.x}
          onChange={changeCoordinate}
        />
        <input
          type="number"
          name="y"
          value={coordinateText.y}
          onChange={changeCoordinate}
        />
        <input type="submit" value="Send" />
      </form>
    </div>
    </>
)
};

export default App;
