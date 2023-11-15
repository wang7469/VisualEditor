import React from 'react'
import PalletArea from './PalletArea/PalletArea'
import LayoutArea from './LayoutArea/LayoutArea'
import { Grid, Container, Card } from '@mantine/core'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import PICTURES from './PicturesData'

export default function VisualEditor() {
  //array of object, each object contains a id and a picture, and picture has two fields: id and picture
  const initialDestinationSquares = 
    Array.from({ length: 4 }, (_, index) => ({
      id: `square-${index + 1}`,
      picture: null,
      isSplit: false,
      isHorizontalSplit: false,
      horizontalSplitCount: 0,
      verticalSplitCount: 0,
      widthPercent: 100,
    }))

  const [verticalSquareCellCount, setVerticalSquareCellCount] =
    React.useState(4)
  const [draggablePictures, setDraggablePictures] = React.useState(PICTURES)
  const [droppedPictures, setDroppedPictures] = React.useState(
    initialDestinationSquares
  )

  const handleAddSquare = () => {
    const newSquare = {
      id: `square-${droppedPictures.length + 1}`,
      picture: null,
    }
    setVerticalSquareCellCount(verticalSquareCellCount + 1)
    setDroppedPictures([...droppedPictures, newSquare])
  }

  const handleSplitCell = (index, isHorizontal) => {
    const updatedPictures = [...droppedPictures]
    // Remove the original cell
    const droppedPictureInfo = updatedPictures[index]
    updatedPictures.splice(index, 1)

    const createNewCell = (suffix) => ({
      id: `${droppedPictureInfo.id}-${suffix}`,
      picture: droppedPictureInfo.picture,
      isSplit: true,
      isHorizontalSplit: isHorizontal,
      horizontalSplitCount: isHorizontal
        ? droppedPictureInfo.horizontalSplitCount + 1
        : droppedPictureInfo.horizontalSplitCount,
      verticalSplitCount: isHorizontal
        ? droppedPictureInfo.verticalSplitCount
        : droppedPictureInfo.verticalSplitCount + 1,
      widthPercent: 100,
    })

    const newCell1 = createNewCell(isHorizontal ? "horizontal" : "vertical")
    const newCell2 = createNewCell(isHorizontal ? "horizontal" : "vertical")
    // Insert the new cells at the same position as the original cell
    updatedPictures.splice(index, 0, newCell1, newCell2)

    // Update id for newCell2 and subsequent cells
    const startIndex = updatedPictures.findIndex(
      (cell) => cell.id === newCell2.id
    )

    for (let i = startIndex + 1; i < updatedPictures.length; i++) {
      const [prefix, number, ...rest] = updatedPictures[i].id.split('-');
    const newNumber = parseInt(number, 10) + 1;
    updatedPictures[i].id = `${prefix}-${newNumber}${rest.length > 0 ? `-${rest.join('-')}` : ''}`;

    }

    //reset all width percentage to 100%
    for (let i = 0; i < updatedPictures.length; i++) {
      updatedPictures[i].widthPercent = 100;
    }

    //mark splitted pictures with 50% width percent
    for (let i = 0; i < updatedPictures.length - 1; i++) {
      const idLength = updatedPictures[i].id.split('-').length;
      const nextIdLength = updatedPictures[i+1].id.split('-').length;

      // Check if the current object and the next object have the same id length
      if (idLength > 2 && (idLength === nextIdLength)) {
        updatedPictures[i].widthPercent = 50;
        updatedPictures[i + 1].widthPercent = 50;
      }
    }

    console.log(updatedPictures)
    setDroppedPictures(updatedPictures)
  }

  const handleDropEnd = (results) => {
    const { source, destination, type } = results

    if (!destination || !source) return
    // if(destination.droppableId === source.droppableId && source.index === destination.index) return;

    const updatedDraggablePictures = [...draggablePictures]
    const updatedDroppedPictures = [...droppedPictures]

    // If dragging from source to destination
    if (
      source.droppableId === 'source' &&
      destination.droppableId.startsWith('square')
    ) {
      console.log('dragging from source to destination')
      const [removed] = updatedDraggablePictures.splice(source.index, 1)
      const destinationSquareIndex =
        parseInt(destination.droppableId.split('-')[1], 10) - 1

      // Move the current photo in the destination square back to the source
      if (updatedDroppedPictures[destinationSquareIndex].picture) {
        updatedDraggablePictures.push(
          updatedDroppedPictures[destinationSquareIndex].picture
        )
      }

      updatedDroppedPictures[destinationSquareIndex].picture = removed

      setDraggablePictures(updatedDraggablePictures)
      setDroppedPictures(updatedDroppedPictures)
      // console.log(droppedPictures)
    }

    // If dragging within the destination squares
    if (
      source.droppableId.startsWith('square') &&
      destination.droppableId.startsWith('square')
    ) {
      console.log('dragging within destination')
      const sourceSquareIndex =
        parseInt(source.droppableId.split('-')[1], 10) - 1
      const destinationSquareIndex =
        parseInt(destination.droppableId.split('-')[1], 10) - 1

      // Move the current photo in the destination square back to the source
      if (updatedDroppedPictures[destinationSquareIndex].picture) {
        updatedDraggablePictures.push(
          updatedDroppedPictures[destinationSquareIndex].picture
        )
      }

      // Swap the photos between source and destination squares
      const temp = updatedDroppedPictures[sourceSquareIndex].picture
      updatedDroppedPictures[sourceSquareIndex].picture =
        updatedDroppedPictures[destinationSquareIndex].picture
      updatedDroppedPictures[destinationSquareIndex].picture = temp

      // setDraggablePictures(updatedDraggablePictures);
      setDroppedPictures(updatedDroppedPictures)
    }

    // If dragging from destination back to source
    if (
      source.droppableId.startsWith('square') &&
      destination.droppableId === 'source'
    ) {
      console.log('dragging from destination back to source')
      const sourceIndex = parseInt(source.droppableId.split('-')[1], 10) - 1

      // Check if the square has a picture before attempting to remove it
      const [removed] = updatedDroppedPictures[sourceIndex]?.picture
        ? [updatedDroppedPictures[sourceIndex].picture]
        : []

      if (removed) {
        updatedDraggablePictures.push(removed)
        updatedDroppedPictures[sourceIndex].picture = null

        setDraggablePictures(updatedDraggablePictures)
        setDroppedPictures(updatedDroppedPictures)
      }
    }
  }

  return (
    <DragDropContext onDragEnd={handleDropEnd}>
      <Container size='xl'>
        <Grid>
          <Grid.Col span={{ base: 12, xs: 12 }}>
            <Card
              withBorder
              radius='lg'
              padding='xl'
              style={{ height: '100px', marginTop: '30px' }}
            ></Card>
          </Grid.Col>
          <Grid.Col span={{ base: 12, xs: 6 }}>
            <Card
              withBorder
              radius='lg'
              padding='xl'
              style={{
                height: '900px',
                marginBottom: '40px',
                padding: '20px',
              }}
            >
              <PalletArea draggablePictures={draggablePictures} />
            </Card>
          </Grid.Col>
          <Grid.Col span={{ base: 12, xs: 6 }}>
            <Card
              withBorder
              radius='lg'
              padding='xl'
              style={{ height: '900px', padding: '20px' }}
            >
              <LayoutArea
                droppedPictures={droppedPictures}
                onAddSquare={handleAddSquare}
                verticalSquareCellCount={verticalSquareCellCount}
                handleSplitCell={handleSplitCell}
              />
            </Card>
          </Grid.Col>
        </Grid>
      </Container>
    </DragDropContext>
  )
}
