import React, { useRef, useState } from 'react';

interface Ball {
  x: number;
  y: number;
  dx: number;
  dy: number;
  radius: number;
  color: string;
}

const BILLIARDS_WIDTH = 800;
const BILLIARDS_HEIGHT = 600;
const BALL_RADIUS = 20;
const BALL_COLOR = 'red';

const Billiards: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [balls, setBalls] = useState<Ball[]>([]);
  const [selectedBall, setSelectedBall] = useState<number | null>(null);
  const [color, setColor] = useState(BALL_COLOR);

  const draw = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, BILLIARDS_WIDTH, BILLIARDS_HEIGHT);

    balls.forEach((ball, index) => {
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fillStyle = index === selectedBall ? 'blue' : ball.color;
      ctx.fill();
      ctx.closePath();
    });
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    balls.forEach((ball, index) => {
      if (
        x < ball.x + ball.radius &&
        x > ball.x - ball.radius &&
        y < ball.y + ball.radius &&
        y > ball.y - ball.radius
      ) {
        setSelectedBall(index);
      }
    });
  };

  const handleMouseUp = () => {
    setSelectedBall(null);
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (selectedBall === null) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    setBalls(prevBalls =>
      prevBalls.map((ball, index) =>
        index === selectedBall ? { ...ball, x, y } : ball
      )
    );
  };

  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setColor(event.target.value);
  };

  const handleColorApply = () => {
    if (selectedBall !== null) {
      setBalls(prevBalls =>
        prevBalls.map((ball, index) =>
          index === selectedBall ? { ...ball, color } : ball
        )
      );
    }
  };

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const newBall: Ball = {
      x: BILLIARDS_WIDTH / 2,
      y: BILLIARDS_HEIGHT / 2,
      dx: 2,
      dy: -2,
      radius: BALL_RADIUS,
      color: BALL_COLOR,
    };

    setBalls(prevBalls => [...prevBalls, newBall]);

    const animate = () => {
      draw(ctx);
      requestAnimationFrame(animate);
    };

    animate();
  }, []);

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={BILLIARDS_WIDTH}
        height={BILLIARDS_HEIGHT}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      />
      {selectedBall !== null && (
        <div>
          <input type="color" value={color} onChange={handleColorChange} />
          <button onClick={handleColorApply}>Apply</button>
        </div>
      )}
    </div>
  );
};

export default Billiards;