import React from 'react'
import PalletArea from './PalletArea/PalletArea'
import LayoutArea from './LayoutArea/LayoutArea'
import { Grid, Container, Card } from '@mantine/core'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import PICTURES from './PicturesData'

export default function VisualEditor() {
  //array of object, each object contains a id and a picture, and picture has two fields: id and picture
  const initialDestinationSquares = Array.from({ length: 4 }, (_, index) => ({
    id: `square-${index + 1}`,
    picture: null,
  }))

  const [draggablePictures, setDraggablePictures] = React.useState(PICTURES)
  const [droppedPictures, setDroppedPictures] = React.useState(
    initialDestinationSquares
  )

  const handleAddSquare = () => {
    const newSquare = {
      id: `square-${droppedPictures.length + 1}`,
      picture: null,
    }

    setDroppedPictures([...droppedPictures, newSquare])
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
    }

    // If dragging within the destination squares
    if (
      source.droppableId.startsWith('square') &&
      destination.droppableId.startsWith('square')
    ) {
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

    // If dragging from source to newly added square cell
    // if (source.droppableId === 'source' && destination.droppableId === `square-${droppedPictures.length}`) {
    //     const [removed] = updatedDraggablePictures.splice(source.index, 1);
    //     const newSquareIndex = droppedPictures.length - 1;

    //     // Move the current photo to the newly added square cell
    //     updatedDroppedPictures[newSquareIndex].picture = removed;

    //     setDraggablePictures(updatedDraggablePictures);
    //     setDroppedPictures(updatedDroppedPictures);
    //   }
  }

  return (
    <div
      style={{
        backgroundColor: '#11284b',
        backgroundImage:
          'linear-gradient(250deg, rgba(130, 201, 30, 0) 0%, #062343 70%)',
      }}
    >
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
                style={{ height: '900px', marginBottom: '40px' }}
              >
                <PalletArea draggablePictures={draggablePictures} />
              </Card>
            </Grid.Col>
            <Grid.Col span={{ base: 12, xs: 6 }}>
              <Card
                withBorder
                radius='lg'
                padding='xl'
                style={{ height: '900px' }}
              >
                <LayoutArea
                  droppedPictures={droppedPictures}
                  onAddSquare={handleAddSquare}
                />
              </Card>
            </Grid.Col>
          </Grid>
        </Container>
      </DragDropContext>
    </div>
  )
}
