import React from 'react'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import { Card, Image, Button } from '@mantine/core'

export default function LayoutArea({ droppedPictures, onAddSquare }) {
  const handleAddSquare = () => {
    onAddSquare()
  }

  return (
    <>
      {droppedPictures.map((square) => (
        <Card
          withBorder
          style={{ margin: '5px', height: '200px', marginLeftL: '0px' }}
        >
          <Droppable key={square.id} droppableId={square.id} type='group'>
            {(boxProvided) => (
              <div {...boxProvided.droppableProps} ref={boxProvided.innerRef}>
                {square.picture && (
                  <Draggable
                    draggableId={square.picture.id}
                    key={square.picture.id}
                    index={0}
                  >
                    {(dragProvided) => (
                      <div
                        {...dragProvided.draggableProps}
                        {...dragProvided.dragHandleProps}
                        ref={dragProvided.innerRef}
                      >
                        <Card withBorder style={{ margin: '5px' }}>
                          <img
                            src={square.picture.picture}
                            style={{ width: 'auto', height: '130px' }}
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
        variant='gradient'
        gradient={{ deg: 133, from: 'blue', to: 'cyan' }}
        size='xs'
        radius='md'
        mt='xl'
        onClick={handleAddSquare}
      >
        Add New Cell
      </Button>
    </>
  )
}
