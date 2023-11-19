import { Draggable, Droppable } from 'react-beautiful-dnd'
import { Card, Button } from '@mantine/core'
import { IconCut, IconScissors } from '@tabler/icons-react'

export default function LayoutAreaPicture({
  currentPicture,
  verticalSquareCellCount,
  heightCut,
  widthPercent,
  index,
  handleSplitCell,
}) {
  const imageSize = 800 / verticalSquareCellCount
  const i = index

  const handleSplit = (index, isHorizontal) => () => {
    handleSplitCell(index, isHorizontal)
  }

  return (
    <Card
      key={currentPicture.id}
      withBorder
      radius='sm'
      style={{
        marginTop: '2px',
        marginRight: '2px',
        height: `${imageSize / heightCut}px`,
        width: `${widthPercent}%`,
        padding: 0,
        border: '2px dotted lightgrey',
        // background: i === hoveredIndex ? '#e6f7ff' : 'transparent',
        // boxShadow:
        //   currentPicture.picture && i === hoveredIndex
        //     ? '0 4px 8px rgba(0, 0, 0, 0.1)'
        //     : 'none',
      }}
      // onMouseEnter={() => setHoveredIndex(i)}
      // onMouseLeave={() => setHoveredIndex(null)}
    >
      <Droppable
        key={currentPicture.id}
        droppableId={currentPicture.id}
        type='group'
      >
        {(boxProvided) => (
          <div {...boxProvided.droppableProps} ref={boxProvided.innerRef}>
            {currentPicture.picture && (
              <Draggable
                draggableId={currentPicture.id}
                key={currentPicture.id}
                index={i}
              >
                {(dragProvided) => (
                  <div
                    {...dragProvided.draggableProps}
                    {...dragProvided.dragHandleProps}
                    ref={dragProvided.innerRef}
                  >
                    <Card radius='sm' style={{ margin: '5px', padding: 0 }}>
                      <img
                        alt={currentPicture.id}
                        src={currentPicture.picture.picture}
                        style={{
                          width: '100%',
                          height: `${imageSize / heightCut}px`,
                        }}
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
      {currentPicture.picture && (
        <>
          <Button
            variant='light'
            size='sm'
            radius='sm'
            onClick={handleSplit(i, true)}
            style={{
              width: '35px',
              height: '35px',
              position: 'absolute',
              bottom: '2px',
              right: '2px',
              marginBottom: '33px',
              color: 'white',
              padding: '0px',
            }}
          >
            <IconCut stroke={3} style={{ width: '15px', height: '15px' }} />
          </Button>
          <Button
            variant='light'
            size='sm'
            radius='sm'
            onClick={handleSplit(i, false)}
            style={{
              width: '35px',
              height: '35px',
              position: 'absolute',
              bottom: '0px',
              right: '2px',
              color: 'white',
              padding: '0px',
            }}
          >
            <IconScissors
              stroke={3}
              style={{ width: '15px', height: '15px' }}
            />
          </Button>
        </>
      )}
    </Card>
  )
}
