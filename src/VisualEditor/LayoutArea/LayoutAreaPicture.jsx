import { Draggable } from 'react-beautiful-dnd'
import { Card, Button } from '@mantine/core'

export default function LayoutAreaPicture({ square, imageSize }) {
  ;<Draggable draggableId={square.picture.id} key={square.picture.id} index={0}>
    {(dragProvided) => (
      <div
        {...dragProvided.draggableProps}
        {...dragProvided.dragHandleProps}
        ref={dragProvided.innerRef}
      >
        <Card withBorder radius='sm' style={{ margin: '5px' }}>
          <img
            src={square.picture.picture}
            style={{ width: 'auto', height: `${imageSize}px` }}
          />
        </Card>
      </div>
    )}
  </Draggable>
}
