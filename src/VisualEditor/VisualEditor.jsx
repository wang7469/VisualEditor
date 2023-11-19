import React from 'react'
import PalletArea from './PalletArea/PalletArea'
import LayoutArea from './LayoutArea/LayoutArea'
import { Grid, Container, Card, Text } from '@mantine/core'
import { DragDropContext } from 'react-beautiful-dnd'
import PICTURES from './PicturesData'
import ActionArea from './ActionArea/ActionArea'
import { IconCut, IconScissors } from '@tabler/icons-react'

export default function VisualEditor() {
  //array of object, each object contains a id and a picture, and picture has two fields: id and picture
  const initialDestinationSquares = Array.from({ length: 4 }, (_, index) => ({
    id: `square-${index + 1}`,
    picture: null,
    isSplit: false,
    isHorizontalSplit: false,
    horizontalSplitCount: 0,
    verticalSplitCount: 0,
    widthPercentTaken: 0,
    heightPercentTaken: 0,
    parentCell: null,
  }))

  const [verticalSquareCellCount, setVerticalSquareCellCount] =
    React.useState(4)
  const [draggablePictures, setDraggablePictures] = React.useState(PICTURES)
  const [droppedPictures, setDroppedPictures] = React.useState(
    initialDestinationSquares
  )
  const [savedVersions, setSavedVersions] = React.useState([])
  const [clickCount, setClickCount] = React.useState(0)
  const [isButtonDisabled, setIsButtonDisabled] = React.useState(false)

  const handleSave = (name) => {
    const newVersion = {
      id: savedVersions.length + 1,
      versionName: name,
      data: droppedPictures,
    }

    setSavedVersions([...savedVersions, newVersion])
    alert(
      'Your current layout has been successfully saved, and the layout area will now reset.'
    )
    setDroppedPictures(initialDestinationSquares)
  }

  const handleLoad = (name) => {
    //assume there is no duplicate names
    savedVersions.forEach((version) => {
      if (version.versionName === name) {
        setDroppedPictures(version.data)
        console.log(version.data)
        console.log(droppedPictures)
        alert('loaded')
      }
    })
  }

  const handleAddSquare = () => {
    if (clickCount >= 10) {
      return
    }
    const newSquare = {
      id: `square-${droppedPictures.length + 1}`,
      picture: null,
      isSplit: false,
      isHorizontalSplit: false,
      horizontalSplitCount: 0,
      verticalSplitCount: 0,
      widthPercentTaken: 0,
      heightPercentTaken: 0,
      parentCell: null,
    }
    setVerticalSquareCellCount(verticalSquareCellCount + 1)
    setDroppedPictures([...droppedPictures, newSquare])

    const newClickCount = clickCount + 1
    setClickCount(newClickCount)
    console.log(newClickCount)
    if (newClickCount >= 10) {
      setIsButtonDisabled(true)
    }
  }

  const handleSplitCell = (index, isHorizontal) => {
    const updatedPictures = [...droppedPictures]
    // Remove the original cell
    const droppedPictureInfo = updatedPictures[index]
    updatedPictures.splice(index, 1)
    const horizontalSplitCount = isHorizontal
      ? droppedPictureInfo.horizontalSplitCount + 1
      : droppedPictureInfo.horizontalSplitCount
    const verticalSplitCount = isHorizontal
      ? droppedPictureInfo.verticalSplitCount
      : droppedPictureInfo.verticalSplitCount + 1

    const createNewCell = (suffix) => ({
      id: `${droppedPictureInfo.id}-${suffix}`,
      picture: droppedPictureInfo.picture,
      isSplit: true,
      isHorizontalSplit: isHorizontal,
      horizontalSplitCount: horizontalSplitCount,
      verticalSplitCount: verticalSplitCount,
      widthPercentTaken: 100 / Math.pow(2, horizontalSplitCount),
      heightPercentTaken: 100 / Math.pow(2, verticalSplitCount),
      parentCell: droppedPictureInfo.id,
    })

    const newCell1 = createNewCell(isHorizontal ? 'horizontal' : 'vertical')
    const newCell2 = createNewCell(isHorizontal ? 'horizontal' : 'vertical')
    // Insert the new cells at the same position as the original cell
    updatedPictures.splice(index, 0, newCell1, newCell2)

    // Update id for newCell2 and subsequent cells
    const startIndex = updatedPictures.findIndex(
      (cell) => cell.id === newCell2.id
    )

    for (let i = startIndex + 1; i < updatedPictures.length; i++) {
      const [prefix, number, ...rest] = updatedPictures[i].id.split('-')
      const newNumber = parseInt(number, 10) + 1
      updatedPictures[i].id = `${prefix}-${newNumber}${
        rest.length > 0 ? `-${rest.join('-')}` : ''
      }`
    }

    setDroppedPictures(updatedPictures)
  }

  const handleDropEnd = (results) => {
    const { source, destination } = results

    if (!destination || !source) return

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
            >
              <ActionArea
                onLoad={handleLoad}
                onSave={handleSave}
                savedVersions={savedVersions}
              />
            </Card>
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
                isButtonDisabled={isButtonDisabled}
              />
            </Card>
            {isButtonDisabled && (
              <Text
                fz='xs'
                tt='uppercase'
                fw={700}
                c='dimmed'
                style={{
                  marginTop: '5px',
                  marginLeft: '20px',
                  marginRight: '20px',
                }}
              >
                Button disabled: maximum layout space reached
              </Text>
            )}
            {!isButtonDisabled && (
              <Text
                fz='xs'
                tt='uppercase'
                fw={700}
                style={{
                  marginTop: '5px',
                  marginLeft: '20px',
                  marginRight: '20px',
                  color: 'white',
                  padding: '5px',
                }}
              >
                <IconCut stroke={3} style={{ width: '20px', height: '20px' }} />{' '}
                vertical split picture in half
                <IconScissors
                  stroke={3}
                  style={{ width: '20px', height: '20px', marginLeft: '10px' }}
                />{' '}
                horizontal split picture in half
              </Text>
            )}
          </Grid.Col>
        </Grid>
      </Container>
    </DragDropContext>
  )
}
