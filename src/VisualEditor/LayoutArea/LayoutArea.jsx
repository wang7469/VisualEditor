import React from 'react'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import { Card, Button } from '@mantine/core'
import { IconSquareRoundedPlus } from '@tabler/icons-react'

export default function LayoutArea({
  droppedPictures,
  onAddSquare,
  verticalSquareCellCount,
  handleSplitCell,
}) {
  console.log(droppedPictures)
  const handleSplit = (index, isHorizontal) => () => {
    handleSplitCell(index, isHorizontal)
  }

  const imageSize = 800 / verticalSquareCellCount
  const [hoveredIndex, setHoveredIndex] = React.useState(null)

  const resultComponents = []
  let totalWidth = 0
  let outerGroup = []
  let group = []
  let innerSubGroup = []
  let finalGroup = []
  let currentGroupWidth = 0
  let subGroupWidth = 0
  let currentGroupHorizontalDir = true
  let prevGroupHorizontalDir = null
  let isPrevASplit = false

  for (let i = 0; i < droppedPictures.length; ) {
    const currentPicture = droppedPictures[i]

    if (!currentPicture.isSplit || currentPicture.horizontalSplitCount === 0) {
      // if (outerGroup.length != 0) {
      //   finalGroup.push(
      //     <div
      //       key='ifClause'
      //       style={{
      //         display: 'flex',
      //         flexDirection: prevGroupHorizontalDir ? 'row' : 'column',
      //         width: `${subGroupWidth}%`,
      //       }}
      //     >
      //       {outerGroup}
      //     </div>
      //   )

      //   totalWidth += subGroupWidth
      //   outerGroup = []
      //   outerGroup.push(innerSubGroup)
      //   subGroupWidth = currentGroupWidth
      // }

      // if (totalWidth === 100) {
      //   resultComponents.push(
      //     <div
      //       key={currentPicture.id}
      //       style={{ display: 'flex', flexDirection: 'row', width: '100%' }}
      //     >
      //       {finalGroup}
      //     </div>
      //   )
      //   totalWidth = 0
      //   finalGroup = []
      // }

      const heightCut = Math.pow(2, currentPicture.verticalSplitCount)
      resultComponents.push(
        <Card
          key={currentPicture.id}
          withBorder
          radius='sm'
          style={{
            marginTop: '5px',
            marginRight: '5px',
            height: `${imageSize / heightCut}px`,
            width: `100%`,
            padding: 0,
            border: '2px dotted lightgrey',
            background: i === hoveredIndex ? '#e6f7ff' : 'transparent',
            boxShadow:
              currentPicture.picture && i === hoveredIndex
                ? '0 4px 8px rgba(0, 0, 0, 0.1)'
                : 'none',
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
                            src={currentPicture.picture.picture}
                            style={{
                              width: '100%',
                              height: `${imageSize / heightCut - 10}px`,
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
                SplitH
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
                SplitV
              </Button>
            </>
          )}
        </Card>
      )
      i++
      isPrevASplit = false
      prevGroupHorizontalDir = null
    } else {
      while (
        i < droppedPictures.length &&
        droppedPictures[i].id.length === currentPicture.id.length
      ) {
        const nextPicture = droppedPictures[i]
        // console.log('nextPicture' + nextPicture.id)
        currentGroupHorizontalDir = nextPicture.isHorizontalSplit
        const heightCut = Math.pow(2, nextPicture.verticalSplitCount)
        const widthCut = Math.pow(2, nextPicture.horizontalSplitCount)
        // console.log('widthcut' + widthCut)
        // console.log('heightcut' + heightCut)

        group.push(
          <Card
            key={nextPicture.id}
            withBorder
            radius='sm'
            style={{
              marginTop: '5px',
              marginRight: '5px',
              height: `${imageSize / heightCut}px`,
              width: `${nextPicture.widthPercent}%`,
              padding: 0,
              border: '2px dotted lightgrey',
              background: i === hoveredIndex ? '#e6f7ff' : 'transparent',
              boxShadow:
                nextPicture.picture && i === hoveredIndex
                  ? '0 4px 8px rgba(0, 0, 0, 0.1)'
                  : 'none',
            }}
            // onMouseEnter={() => setHoveredIndex(i)}
            // onMouseLeave={() => setHoveredIndex(null)}
          >
            <Droppable
              key={nextPicture.id}
              droppableId={nextPicture.id}
              type='group'
            >
              {(boxProvided) => (
                <div {...boxProvided.droppableProps} ref={boxProvided.innerRef}>
                  {nextPicture.picture && (
                    <Draggable
                      draggableId={nextPicture.id}
                      key={nextPicture.id}
                      index={i}
                    >
                      {(dragProvided) => (
                        <div
                          {...dragProvided.draggableProps}
                          {...dragProvided.dragHandleProps}
                          ref={dragProvided.innerRef}
                        >
                          <Card
                            radius='sm'
                            style={{ margin: '5px', padding: 0 }}
                          >
                            <img
                              src={nextPicture.picture.picture}
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
            {nextPicture.picture && (
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

        // console.log(group)

        if (currentGroupHorizontalDir) {
          currentGroupWidth +=
            100 / Math.pow(2, nextPicture.horizontalSplitCount)
        } else {
          currentGroupWidth =
            100 / Math.pow(2, nextPicture.horizontalSplitCount)
        }
        i++
      }
      // console.log("horizon" + currentGroupWidth);
      // console.log("total" + totalWidth)

      finalGroup.push(
        <div
          key={currentPicture.id}
          style={{
            display: 'flex',
            flexDirection: currentGroupHorizontalDir ? 'row' : 'column',
            width: `${currentGroupWidth}%`,
          }}
        >
          {group}
        </div>
      )

      console.log(innerSubGroup)
      console.log(prevGroupHorizontalDir)
      console.log(currentGroupHorizontalDir)
      console.log(outerGroup)

      // if (
      //   (prevGroupHorizontalDir === null ||
      //   prevGroupHorizontalDir === currentGroupHorizontalDir)
      // ) {
      //   console.log('here1')
      //   outerGroup.push(innerSubGroup)

      //   if (currentGroupHorizontalDir) {
      //     subGroupWidth += currentGroupWidth
      //   } else {
      //     subGroupWidth = currentGroupWidth
      //   }
      // } else {
      //   console.log('here2 when dealing with picture ' + currentPicture.id)
      //   console.log(outerGroup)
      //   finalGroup.push(
      //     <div
      //       key='elseClause'
      //       style={{
      //         display: 'flex',
      //         flexDirection: prevGroupHorizontalDir ? 'row' : 'column',
      //         width: `${subGroupWidth}%`,
      //       }}
      //     >
      //       {outerGroup}
      //     </div>
      //   )

      //   console.log(outerGroup)
      //   totalWidth += subGroupWidth
      //   outerGroup = []
      //   outerGroup.push(innerSubGroup)
      //   subGroupWidth = currentGroupWidth
      // }

      console.log(finalGroup)
      group = []
      totalWidth += currentGroupWidth
      currentGroupWidth = 0

      // prevGroupHorizontalDir = currentGroupHorizontalDir

      if (totalWidth === 100) {
        resultComponents.push(
          <div
            key={currentPicture.id}
            style={{ display: 'flex', flexDirection: 'row', width: '100%' }}
          >
            {finalGroup}
          </div>
        )
        totalWidth = 0
        finalGroup = []
      }
      isPrevASplit = true
    }
  }
  console.log(resultComponents)

  return (
    <div>
      {resultComponents.map((component, index) => (
        <React.Fragment key={index}>{component}</React.Fragment>
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
    </div>
  )

  //   const [prevGroupDir, setPrevGroupDir] = React.useState(true)

  //for each droppedPicture, we get its width and height first
  // return (
  //   <>
  //     {droppedPictures.map((square, index) => {
  //       const widthCut = Math.pow(2, square.horizontalSplitCount);
  //       const heightCut = Math.pow(2, square.verticalSplitCount)
  //       console.log(square.isHorizontalSplit)
  //       // setCurrentOccupiedWidth(currentOccupiedWidth+(100/widthCut));

  //       return (
  //           <Card
  //                   key={square.id}
  //                   withBorder
  //                   radius='sm'
  //                   style={{
  //                     marginTop: '5px',
  //                     marginRight: '5px',
  //                     height: `${square.isSplit ? (imageSize / heightCut) : "250px"}`,
  //                     width: `${100/widthCut}%`,
  //                     padding: 0,
  //                     border: '2px dotted lightgrey',
  //                     background: index === hoveredIndex ? '#e6f7ff' : 'transparent',
  //                     boxShadow:
  //                       square.picture && index === hoveredIndex
  //                         ? '0 4px 8px rgba(0, 0, 0, 0.1)'
  //                         : 'none',
  //                   }}
  //                   onMouseEnter={() => setHoveredIndex(index)}
  //                   onMouseLeave={() => setHoveredIndex(null)}
  //                 >
  //                   <Droppable key={square.id} droppableId={square.id} type='group'>
  //                     {(boxProvided) => (
  //                       <div {...boxProvided.droppableProps} ref={boxProvided.innerRef}>
  //                         {square.picture && (
  //                           <Draggable
  //                             draggableId={square.picture.id}
  //                             key={square.picture.id}
  //                             index={index}
  //                           >
  //                             {(dragProvided) => (
  //                               <div
  //                                 {...dragProvided.draggableProps}
  //                                 {...dragProvided.dragHandleProps}
  //                                 ref={dragProvided.innerRef}
  //                               >
  //                                 <Card
  //                                   radius='sm'
  //                                   style={{ margin: '5px', padding: 0 }}
  //                                 >
  //                                   <img
  //                                     src={square.picture.picture}
  //                                     style={{
  //                                       width: '100%',
  //                                       height: `${(imageSize / heightCut)}px`,
  //                                     }}
  //                                   />
  //                                 </Card>
  //                               </div>
  //                             )}
  //                           </Draggable>
  //                         )}
  //                         {boxProvided.placeholder}
  //                       </div>
  //                     )}
  //                   </Droppable>
  //                   {square.picture && (
  //                     <>
  //                       <Button
  //                         variant='light'
  //                         size='sm'
  //                         radius='sm'
  //                         onClick={() => handleSplit(index, true)}
  //                         style={{
  //                           position: 'absolute',
  //                           bottom: '5px',
  //                           right: '5px',
  //                           marginBottom: '30px',
  //                         }}
  //                       >
  //                         SplitH
  //                       </Button>
  //                       <Button
  //                         variant='light'
  //                         size='sm'
  //                         radius='sm'
  //                         onClick={() => handleSplit(index, false)}
  //                         style={{
  //                           position: 'absolute',
  //                           bottom: '5px',
  //                           right: '5px',
  //                         }}
  //                       >
  //                         SplitV
  //                       </Button>
  //                     </>
  //                   )}
  //                 </Card>
  //           )
  //       })}

  //             <Button
  //       variant='light'
  //       size='sm'
  //       radius='sm'
  //       onClick={onAddSquare}
  //       style={{ marginTop: '10px' }}
  //       rightSection={
  //         <IconSquareRoundedPlus
  //           stroke={1.25}
  //           style={{ width: '1.15rem', height: '1.25rem' }}
  //         />
  //       }
  //     >
  //       Add New Cell
  //     </Button>
  //   </>
  // )
}
