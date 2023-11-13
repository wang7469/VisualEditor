import React from 'react'
import { Card } from '@mantine/core'
import { Draggable } from 'react-beautiful-dnd'

export default function PalletAreaPicture({ pictureSource, pictureId, index }) {
  const [hoveredPictureIndex, setHoveredPictureIndex] = React.useState(null)

  return (
    <Draggable draggableId={pictureId} key={pictureId} index={index}>
      {(provided) => (
        <div
          {...provided.dragHandleProps}
          {...provided.draggableProps}
          ref={provided.innerRef}
        >
          <Card
            withBorder
            radius='sm'
            key={pictureId}
            style={{
              margin: '5px',
              boxShadow:
                index === hoveredPictureIndex
                  ? '0 4px 8px rgba(0, 0, 0, 0.1)'
                  : 'none',
              transition: 'box-shadow 0.3s ease-out',
            }}
            onMouseEnter={() => setHoveredPictureIndex(index)}
            onMouseLeave={() => setHoveredPictureIndex(null)}
          >
            <img
              src={pictureSource}
              style={{ width: 'auto', height: '130px' }}
            />
          </Card>
        </div>
      )}
    </Draggable>
  )
}
