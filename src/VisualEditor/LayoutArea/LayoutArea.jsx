import React from 'react'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import { Card, Button } from '@mantine/core'
import { IconSquareRoundedPlus } from '@tabler/icons-react'

export default function LayoutArea({ droppedPictures, onAddSquare }) {
  const imageSize = 700 / droppedPictures.length
  const [hoveredIndex, setHoveredIndex] = React.useState(null)

  return (
    <>
      {droppedPictures.map((square, index) => (
        <Card
          key={square.id}
          withBorder
          radius='sm'
          style={{
            marginTop: '5px',
            height: `250px`,
            padding: 0,
            border: '2px dotted lightgrey',
            background: index === hoveredIndex ? '#e6f7ff' : 'transparent',
            boxShadow:
              square.picture && index === hoveredIndex
                ? '0 4px 8px rgba(0, 0, 0, 0.1)'
                : 'none',
          }}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <Droppable key={square.id} droppableId={square.id} type='group'>
            {(boxProvided) => (
              <div {...boxProvided.droppableProps} ref={boxProvided.innerRef}>
                {square.picture && (
                  <Draggable
                    draggableId={square.picture.id}
                    key={square.picture.id}
                    index={index}
                  >
                    {(dragProvided) => (
                      <div
                        {...dragProvided.draggableProps}
                        {...dragProvided.dragHandleProps}
                        ref={dragProvided.innerRef}
                      >
                        <Card radius='sm' style={{ margin: '5px', padding: 0 }}>
                          <img
                            src={square.picture.picture}
                            style={{ width: '100%', height: `${imageSize}px` }}
                          />
                        </Card>
                      </div>
                    )}
                  </Draggable>
                )}
                {boxProvided.placeholder}
              </div>
            )}
          </Droppable>
        </Card>
      ))}

      <Button
        variant='light'
        size='sm'
        radius='sm'
        onClick={onAddSquare}
        style={{ marginTop: '10px' }}
        rightSection={
          <IconSquareRoundedPlus
            stroke={1.25}
            style={{ width: '1.15rem', height: '1.25rem' }}
          />
        }
      >
        Add New Cell
      </Button>
    </>
  )
}
