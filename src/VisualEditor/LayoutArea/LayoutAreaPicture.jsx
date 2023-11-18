import { Draggable, Droppable } from 'react-beautiful-dnd'
import { Card, Button } from '@mantine/core'

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
              position: 'absolute',
              bottom: '5px',
              right: '5px',
              marginBottom: '30px',
            }}
          >
            {i}
          </Button>
          <Button
            variant='light'
            size='sm'
            radius='sm'
            onClick={handleSplit(i, false)}
            style={{
              position: 'absolute',
              bottom: '5px',
              right: '5px',
            }}
          >
            {i}
          </Button>
        </>
      )}
    </Card>
  )
}
