import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(20, minmax(10px, 20px));
  gap: 1px;
  background: #1a1a1a;
  padding: 10px;
  border-radius: 4px;
  width: fit-content;
  margin: 0 auto;

  @media (max-width: 480px) {
    grid-template-columns: repeat(12, minmax(8px, 15px));
    padding: 5px;
    gap: 0.5px;
  }

  @media (min-width: 481px) and (max-width: 768px) {
    grid-template-columns: repeat(16, minmax(10px, 18px));
  }

  @media (min-width: 1200px) {
    grid-template-columns: repeat(20, 20px);
  }
`;

const Cell = styled.div`
  width: 100%;
  aspect-ratio: 1;
  background-color: ${props => props.color};
  transition: background-color 0.5s ease;
  box-shadow: ${props => 
    props.color !== '#000000' 
      ? `0 0 15px ${props.color}`
      : 'none'
  };

  @media (max-width: 480px) {
    box-shadow: ${props => 
      props.color !== '#000000' 
        ? `0 0 8px ${props.color}`
        : 'none'
    };
  }
`;

const RainGrid = () => {
  const getInitialColumns = () => {
    if (window.innerWidth <= 480) return 12;
    if (window.innerWidth <= 768) return 16;
    return 20;
  };

  const [columns, setColumns] = useState(getInitialColumns());
  const [grid, setGrid] = useState(() => 
    Array(15).fill().map(() => Array(columns).fill('#000000'))
  );
  
  const [streamPositions, setStreamPositions] = useState(() => 
    Array(columns).fill().map(() => ({
      position: Math.floor(Math.random() * columns) - 6,
      active: Math.random() < 0.4,
      color: 'rgba(255, 0, 0, 1.0)'
    }))
  );

  const colorSchemes = [
    { r: 255, g: 0, b: 0 },      // Red
    { r: 0, g: 255, b: 0 },      // Green
    { r: 0, g: 255, b: 255 },    // Cyan
    { r: 255, g: 0, b: 255 },    // Magenta
    { r: 255, g: 255, b: 0 },    // Yellow
    { r: 0, g: 0, b: 255 },      // Blue
    { r: 255, g: 128, b: 0 },    // Orange
    { r: 128, g: 0, b: 255 },    // Purple
    { r: 0, g: 255, b: 128 },    // Spring Green
    { r: 255, g: 0, b: 128 },    // Hot Pink
    { r: 128, g: 255, b: 0 },    // Lime
    { r: 0, g: 128, b: 255 }     // Sky Blue
  ];

  const [currentColorIndex, setCurrentColorIndex] = useState(0);
  
  const getGradientColors = () => {
    const { r, g, b } = colorSchemes[currentColorIndex];
    return [
      `rgba(${r}, ${g}, ${b}, 0.1)`,
      `rgba(${r}, ${g}, ${b}, 0.2)`,
      `rgba(${r}, ${g}, ${b}, 0.4)`,
      `rgba(${r}, ${g}, ${b}, 0.6)`,
      `rgba(${r}, ${g}, ${b}, 0.6)`,
      `rgba(${r}, ${g}, ${b}, 0.8)`
    ];
  };

  useEffect(() => {
    const colorChangeInterval = setInterval(() => {
      setCurrentColorIndex(prevIndex => 
        prevIndex === colorSchemes.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(colorChangeInterval);
  }, []);

  useEffect(() => {
    const updateGrid = () => {
      setStreamPositions(prevPositions => 
        prevPositions.map(stream => ({
          position: stream.position >= 15 ? -6 : stream.position + 1,
          active: stream.position >= 15 ? Math.random() < 0.4 : stream.active,
          color: stream.position >= 15 ? 
            getGradientColors()[Math.floor(Math.random() * getGradientColors().length)] : 
            stream.color
        }))
      );

      setGrid(prevGrid => {
        const newGrid = Array(15).fill().map(() => Array(columns).fill('#000000'));
        streamPositions.forEach((stream, columnIndex) => {
          if (stream.active) {
            const gradientColors = getGradientColors();
            for(let i = 0; i < 6; i++) {
              const rowPosition = stream.position + i;
              if(rowPosition >= 0 && rowPosition < 15) {
                newGrid[rowPosition][columnIndex] = gradientColors[i];
              }
            }
          }
        });
        return newGrid;
      });
    };

    const interval = setInterval(updateGrid, 100);
    return () => clearInterval(interval);
  }, [streamPositions]);

  useEffect(() => {
    const handleResize = () => {
      const newColumns = getInitialColumns();
      if (newColumns !== columns) {
        setColumns(newColumns);
        setGrid(Array(15).fill().map(() => Array(newColumns).fill('#000000')));
        setStreamPositions(Array(newColumns).fill().map(() => ({
          position: Math.floor(Math.random() * newColumns) - 6,
          active: Math.random() < 0.4,
          color: getGradientColors()[Math.floor(Math.random() * getGradientColors().length)]
        })));
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [columns]);

  return (
    <GridContainer>
      {grid.map((row, i) =>
        row.map((color, j) => (
          <Cell key={`${i}-${j}`} color={color} />
        ))
      )}
    </GridContainer>
  );
};

export default RainGrid;