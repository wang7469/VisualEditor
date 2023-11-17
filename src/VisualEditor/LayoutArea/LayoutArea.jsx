import React from 'react'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import { Card, Button } from '@mantine/core'
import { IconSquareRoundedPlus } from '@tabler/icons-react'
import LayoutAreaPicture from './LayoutAreaPicture'

export default function LayoutArea({
  droppedPictures,
  onAddSquare,
  verticalSquareCellCount,
  handleSplitCell,
}) {
  console.log(droppedPictures)

  const findPicById = (arr, id) => {
    const index = arr.findIndex((element) => element.id === id)
    if (index !== -1) {
      return arr[index]
    }
    return {}
  }
  // const findLongestIdPic = (objects) => {
  //   let maxIdLength = 0
  //   let indexOfLongestId = -1

  //   objects.forEach((obj, index) => {
  //     const idLength = obj.id.length
  //     if (idLength > maxIdLength) {
  //       maxIdLength = idLength
  //       indexOfLongestId = index
  //     }
  //   })

  //   return indexOfLongestId
  // }

  // const removePicById = (idToRemove, subArrayOfDroppedPictures) => {
  //   const index = subArrayOfDroppedPictures.findIndex(
  //     (element) => element.id === idToRemove
  //   )
  //   if (index !== -1) {
  //     subArrayOfDroppedPictures.splice(index, 1)
  //   }
  // }

  // const findPairs = (objects) => {
  //   if (objects.length < 2) return [-1, -1]
  //   for (let i = 0; i < objects.length - 1; i++) {
  //     // Split IDs and remove the number part
  //     const idParts1 = objects[i].id.split('-')
  //     const idParts2 = objects[i + 1].id.split('-')

  //     // Remove the number after 'square' for comparison
  //     idParts1.splice(1, 1)
  //     idParts2.splice(1, 1)

  //     // Compare the rest of the ID
  //     if (idParts1.join('-') === idParts2.join('-')) {
  //       return [i, i + 1] // Return the indices of the first pair
  //     }
  //   }
  //   return [-1, -1]
  // }

  // const findTwoLongestIds = (objs) => {
  //   let maxIndex = 0,
  //     secondMaxIndex = 1
  //   if (objs[1].id.split('-').length > objs[0].id.split('-').length) {
  //     maxIndex = 1
  //     secondMaxIndex = 0
  //   }

  //   objs.forEach((obj, index) => {
  //     if (obj.id.split('-').length > objs[maxIndex].id.split('-').length) {
  //       secondMaxIndex = maxIndex
  //       maxIndex = index
  //     } else if (
  //       obj.id.split('-').length > objs[secondMaxIndex].id.split('-').length &&
  //       index !== maxIndex
  //     ) {
  //       secondMaxIndex = index
  //     }
  //   })

  //   return [maxIndex, secondMaxIndex]
  // }

  const getLastWordOfId = (id) => {
    const parts = id.split('-')
    return parts[parts.length - 1]
  }

  const getSecondLastWordOfId = (id) => {
    const parts = id.split('-')
    if (parts.length > 1) {
      return parts[parts.length - 2]
    } else {
      return ''
    }
  }

  const [hoveredIndex, setHoveredIndex] = React.useState(null)
  const resultComponents = []

  for (let i = 0; i < droppedPictures.length; ) {
    const currentPicture = droppedPictures[i]

    if (!currentPicture.isSplit || currentPicture.horizontalSplitCount === 0) {
      const heightCut = Math.pow(2, currentPicture.verticalSplitCount)
      resultComponents.push(
        <LayoutAreaPicture
          currentPicture={currentPicture}
          verticalSquareCellCount={verticalSquareCellCount}
          heightCut={heightCut}
          widthPercent={100}
          index={i}
          handleSplitCell={handleSplitCell}
        />
      )
      i++
    } else {
      const processedPicturesMap = {}

      let groupStartingIndex = i
      let groupEndingIndex = i
      let prevAddedPicIndex = null
      let splitPictureGroup = null

      while (groupEndingIndex < droppedPictures.length) {
        if (
          droppedPictures[groupEndingIndex].isSplit &&
          droppedPictures[groupEndingIndex].horizontalSplitCount !== 0
        ) {
          groupEndingIndex++
        } else {
          break
        }
      }

      i = groupEndingIndex
      console.log(i)

      //we will focus on process the following subarray
      const subArrayOfDroppedPictures = droppedPictures.slice(
        groupStartingIndex,
        groupEndingIndex
      )

      //********************************************************************************************************* */

      for (let i = 0; i < subArrayOfDroppedPictures.length - 1; i++) {
        const picToWrap1 = subArrayOfDroppedPictures[i]
        const picToWrap2 = subArrayOfDroppedPictures[i + 1]
        const idParts1 = picToWrap1.id.split('-')
        const idParts2 = picToWrap2.id.split('-')

        const cellIndex1 = parseInt(picToWrap1.id.split('-')[1]) - 1
        const cellIndex2 = parseInt(picToWrap2.id.split('-')[1]) - 1

        const heightPercent = Math.pow(2, picToWrap1.verticalSplitCount)
        const widthPercent = 100 / Math.pow(2, picToWrap1.horizontalSplitCount)

        let direction = getLastWordOfId(picToWrap1.id)

        let eachWidth = direction === 'vertical' ? 100 : 50

        // let divWidth = null
        // if (
        //   subArrayOfDroppedPictures.length == 2 ||
        //   getSecondLastWordOfId(picToWrap2.id) === 'vertical'
        // ) {
        //   divWidth = 100
        // } else {
        //   divWidth = 50
        // }

        idParts1.splice(1, 1)
        idParts2.splice(1, 1)

        if (
          idParts1.join('-') === idParts2.join('-') &&
          subArrayOfDroppedPictures[i].parentCell ===
            subArrayOfDroppedPictures[i + 1].parentCell
        ) {
          let tempGroup = []
          console.log(heightPercent)
          tempGroup.push(
            <LayoutAreaPicture
              currentPicture={picToWrap1}
              verticalSquareCellCount={verticalSquareCellCount}
              heightCut={heightPercent}
              widthPercent={eachWidth}
              index={cellIndex1}
              handleSplitCell={handleSplitCell}
            />
          )

          tempGroup.push(
            <LayoutAreaPicture
              currentPicture={picToWrap2}
              verticalSquareCellCount={verticalSquareCellCount}
              heightCut={heightPercent}
              widthPercent={eachWidth}
              index={cellIndex2}
              handleSplitCell={handleSplitCell}
            />
          )

          splitPictureGroup = (
            <div
              key={picToWrap1.id}
              style={{
                display: 'flex',
                flexDirection: direction === 'vertical' ? 'column' : 'row',
                width: '100%',
              }}
              data-width={
                direction === 'vertical' ? widthPercent : widthPercent * 2
              }
            >
              {tempGroup}
            </div>
          )
          processedPicturesMap[picToWrap1.id] = splitPictureGroup
        }
      }

      //********************************************start process the map here  */

      //now we have processed map ready
      const group = []
      let subGroup = []
      for (let picId in processedPicturesMap) {
        console.log(picId)
      }
      // console.log(subArrayOfDroppedPictures)

      let totalWidth = 0
      for (let picId in processedPicturesMap) {
        if (processedPicturesMap[picId] !== null) {
          const index = subArrayOfDroppedPictures.findIndex(
            (element) => element.id === picId
          )
          const pic = subArrayOfDroppedPictures[index]

          var indexOfPic
          for (
            indexOfPic = 0;
            indexOfPic < subArrayOfDroppedPictures.length;
            indexOfPic++
          ) {
            if (subArrayOfDroppedPictures[indexOfPic].id === picId) break
          }

          let prevIndex = indexOfPic - 1
          let nextIndex = indexOfPic + 2

          //case 1: one single horizontal split
          if (pic.horizontalSplitCount === 1 && pic.isHorizontalSplit) {
            console.log('case1')
            group.push(
              <div
                key={picId}
                style={{
                  // display: 'flex',
                  // flexDirection:
                  //   getSecondLastWordOfId(picId) === 'vertical'
                  //     ? 'column'
                  //     : 'row',
                  width: `100%`,
                }}
              >
                {processedPicturesMap[picId]}
              </div>
            )
          }
          //case 2: previous is a picture we need to wrap them together with current div
          //        previous could ONLY BE A PICTURE as we are iterate from front to end
          else if (
            prevIndex >= 0 &&
            picId.split('-').length -
              subArrayOfDroppedPictures[prevIndex].id.split('-').length ===
              1 &&
            !(subArrayOfDroppedPictures[prevIndex].id in processedPicturesMap)
          ) {
            console.log('case2')
            const currentShortestLength =
              subArrayOfDroppedPictures[prevIndex].id.split('-').length
            const prevPic = subArrayOfDroppedPictures[prevIndex]
            const currentPic = findPicById(subArrayOfDroppedPictures, picId)
            totalWidth = currentPic.isHorizontalSplit
              ? currentPic.widthPercentTaken * 2
              : currentPic.widthPercentTaken
            console.log(totalWidth)
            const splitDirection = getLastWordOfId(prevPic.id)
            const picWidth = splitDirection === 'vertical' ? 100 : 50
            const heightCut = Math.pow(2, prevPic.verticalSplitCount)
            const squareCellIndex = parseInt(prevPic.id.split('-')[1]) - 1
            // const outerDivWidth = getSecondLastWordOfId(picId) === 'vertical' ? 100 : 50;
            const divDirection =
              getSecondLastWordOfId(picId) === 'vertical' ? 'column' : 'row'

            const prevPicDiv = (
              <LayoutAreaPicture
                currentPicture={prevPic}
                verticalSquareCellCount={verticalSquareCellCount}
                heightCut={heightCut}
                widthPercent={picWidth}
                index={squareCellIndex}
                handleSplitCell={handleSplitCell}
              />
            )

            const currentDiv = processedPicturesMap[picId]
            const updatedCurrentDiv = (
              <div
                key={currentDiv.key}
                style={{
                  ...currentDiv.props.style,
                  width:
                    getSecondLastWordOfId(picId) === 'vertical'
                      ? '100%'
                      : '50%',
                }}
                data-width={currentDiv.props['data-width']}
              >
                {currentDiv.props.children}
              </div>
            )

            subGroup.push(
              <div
                key={picId}
                style={{
                  display: 'flex',
                  flexDirection: { divDirection },
                  width: `100%`,
                }}
                data-width={
                  getSecondLastWordOfId(picId) === 'vertical'
                    ? prevPic.widthPercentTaken
                    : prevPic.widthPercentTaken * 2
                }
              >
                {prevPicDiv}
                {updatedCurrentDiv}
              </div>
            )

            console.log('combied with previous pic ' + prevPic.id)

            if (getSecondLastWordOfId(picId) === 'horizontal')
              totalWidth += prevPic.widthPercentTaken

            let prevPrevIndex = prevIndex
            let indexOfNext = nextIndex
            while (totalWidth < 100) {
              console.log('test')
              prevPrevIndex -= 1
              if (
                prevPrevIndex >= 0 &&
                currentShortestLength -
                  subArrayOfDroppedPictures[prevPrevIndex].id.split('-')
                    .length ===
                  1
              ) {
                console.log('e')
              } else if (
                indexOfNext < subArrayOfDroppedPictures.length &&
                currentShortestLength -
                  subArrayOfDroppedPictures[indexOfNext].id.split('-')
                    .length ===
                  1
              ) {
                const nextPic = subArrayOfDroppedPictures[indexOfNext]

                const splitDirection = getLastWordOfId(nextPic.id)
                const picWidth = splitDirection === 'vertical' ? 100 : 50
                const heightCut = Math.pow(2, nextPic.verticalSplitCount)
                const squareCellIndex = parseInt(nextPic.id.split('-')[1]) - 1
                const outerDivWidth = 100

                const nextPicDiv = (
                  <LayoutAreaPicture
                    currentPicture={nextPic}
                    verticalSquareCellCount={verticalSquareCellCount}
                    heightCut={heightCut}
                    widthPercent={picWidth}
                    index={squareCellIndex}
                    handleSplitCell={handleSplitCell}
                  />
                )

                const currentDiv = subGroup.pop()

                subGroup.push(
                  <div
                    key={picId}
                    style={{
                      display: 'flex',
                      flexDirection:
                        getSecondLastWordOfId(picId) === 'vertical'
                          ? 'column'
                          : 'row',
                      width: `${outerDivWidth}%`,
                    }}
                    data-width={
                      getSecondLastWordOfId(picId) === 'vertical'
                        ? nextPic.widthPercentTaken
                        : nextPic.widthPercentTaken * 2
                    }
                  >
                    {currentDiv}
                    {nextPicDiv}
                  </div>
                )
                if (getLastWordOfId(nextPic.id) === 'horizontal')
                  totalWidth += nextPic.widthPercentTaken
                indexOfNext++
              }
              // else if(indexOfNext < subArrayOfDroppedPictures.length && subArrayOfDroppedPictures[indexOfNext].id.split('-').length == currentShortestLength &&
              // subArrayOfDroppedPictures[indexOfNext].id in processedPicturesMap)
              //   {
              //     console.log("not be here?" + totalWidth)
              //       const nextDiv = processedPicturesMap[subArrayOfDroppedPictures[indexOfNext].id]
              //       const currentDiv = group.pop()
              //       group.push(
              //         <div
              //           key={subArrayOfDroppedPictures[indexOfNext].id}
              //           style={{
              //             display: 'flex',
              //             flexDirection:
              //               getSecondLastWordOfId(subArrayOfDroppedPictures[indexOfNext].id) === 'vertical'
              //                 ? 'column'
              //                 : 'row',
              //             width: `100%`,
              //           }}
              //         >
              //           {currentDiv}
              //           {nextDiv}
              //         </div>
              //       )
              //       indexOfNext += 2
              // }
              else {
                break
              }
            }
            if (totalWidth < 100 && group.length > 0) {
              const prev = group.pop()
              const subGroupDiv = subGroup.pop()
              const updatedSubGroup = (
                <div
                  key={subGroupDiv.key}
                  style={{
                    ...subGroupDiv.props.style,
                    width: '50%',
                  }}
                  data-width={subGroupDiv.props['data-width']}
                >
                  {subGroupDiv.props.children}
                </div>
              )

              const updatedPrev = (
                <div
                  key={prev.key}
                  style={{
                    ...prev.props.style,
                    width: '50%',
                  }}
                  data-width={prev.props['data-width']}
                >
                  {prev.props.children}
                </div>
              )

              // if (prev.props['data-width'] * 2 === 100) {
              //   resultComponents.push(
              //     <div
              //       key={`combined-${group.length}`}
              //       style={{
              //         display: 'flex',
              //         flexDirection: 'row',
              //         width: `100%`,
              //       }}
              //       data-width={prev.props['data-width'] * 2}
              //     >
              //       {updatedPrev}
              //       {updatedSubGroup}
              //     </div>
              //   )
              // } else {
              console.log('sohuld be bpushded')
              group.push(
                <div
                  key={`combined-${group.length}`}
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    width: `100%`,
                  }}
                  data-width={prev.props['data-width'] * 2}
                >
                  {updatedPrev}
                  {updatedSubGroup}
                </div>
              )
              // }
              subGroup = []
            } else if (totalWidth == 100) {
              group.push(subGroup[0])
              subGroup = []
              totalWidth = 0
            } else {
              console.log(subGroup)
              group.push(subGroup[0])
              subGroup = []
              console.log(
                'prev pic matches and search of prev and next pic ended' +
                  prevPic.id
              )
            }
          }
          //case 3: next index is a div, need to wrap
          // else if(nextIndex < subArrayOfDroppedPictures.length && (subArrayOfDroppedPictures[nextIndex].id.split('-').length <= picId.split('-').length) && subArrayOfDroppedPictures[nextIndex].id in processedPicturesMap){
          //   console.log("case3 " + picId)
          //   const currentDiv = processedPicturesMap[picId]
          //   const nextDiv = processedPicturesMap[subArrayOfDroppedPictures[nextIndex].id]
          //   processedPicturesMap[subArrayOfDroppedPictures[nextIndex].id] = null

          //   group.push(
          //     <div
          //       key={picId}
          //       style={{
          //         display: 'flex',
          //         flexDirection:
          //           getSecondLastWordOfId(picId) === 'vertical'
          //             ? 'column'
          //             : 'row',
          //         width: `100%`,
          //       }}
          //     >
          //       {currentDiv}
          //       {nextDiv}
          //     </div>
          //   )
          // }
          //case 4: next index is a pic
          else if (
            nextIndex < subArrayOfDroppedPictures.length &&
            picId.split('-').length -
              subArrayOfDroppedPictures[nextIndex].id.split('-').length ===
              1
          ) {
            console.log('case4')
            let subGroup2 = []
            const currentPic = findPicById(subArrayOfDroppedPictures, picId)
            totalWidth = currentPic.isHorizontalSplit
              ? currentPic.widthPercentTaken * 2
              : currentPic.widthPercentTaken
            console.log(totalWidth)
            const nextPic = subArrayOfDroppedPictures[nextIndex]

            const splitDirection = getLastWordOfId(nextPic.id)
            const picWidth = splitDirection === 'vertical' ? 100 : 50
            const heightCut = Math.pow(2, nextPic.verticalSplitCount)
            const squareCellIndex = parseInt(nextPic.id.split('-')[1]) - 1
            const outerDivWidth = 100
            // (subArrayOfDroppedPictures.length == 2 || getSecondLastWordOfId(picId) === 'vertical') ? 100 : 50;

            const nextPicDiv = (
              <LayoutAreaPicture
                currentPicture={nextPic}
                verticalSquareCellCount={verticalSquareCellCount}
                heightCut={heightCut}
                widthPercent={picWidth}
                index={squareCellIndex}
                handleSplitCell={handleSplitCell}
              />
            )

            const currentDiv = processedPicturesMap[picId]
            const updatedCurrentDiv = (
              <div
                key={currentDiv.key}
                style={{
                  ...currentDiv.props.style,
                  width:
                    getSecondLastWordOfId(picId) === 'vertical'
                      ? '100%'
                      : '50%',
                }}
                data-width={currentDiv.props['data-width']}
              >
                {currentDiv.props.children}
              </div>
            )
            console.log(
              getSecondLastWordOfId(picId) === 'vertical'
                ? nextPic.widthPercentTaken
                : nextPic.widthPercentTaken * 2
            )
            group.push(
              <div
                key={picId}
                style={{
                  display: 'flex',
                  flexDirection:
                    getSecondLastWordOfId(picId) === 'vertical'
                      ? 'column'
                      : 'row',
                  width: '100%',
                }}
                data-width={
                  getSecondLastWordOfId(picId) === 'vertical'
                    ? nextPic.widthPercentTaken
                    : nextPic.widthPercentTaken * 2
                }
              >
                {updatedCurrentDiv}
                {nextPicDiv}
              </div>
            )
            console.log(group)
          } else {
            //case 5: div and div combination
            console.log('case 5 ' + picId)
            group.push(processedPicturesMap[picId])
            console.log(group)

            // let updatedUnfinishedDiv = null
            // if(subGroup.length > 0){
            //   const unfinishedDiv = subGroup.pop()
            //   updatedUnfinishedDiv = (
            //     <div
            //       key={unfinishedDiv.key}
            //       style={{
            //         ...unfinishedDiv.props.style,
            //         width: "50%"
            //       }}
            //       data-width={unfinishedDiv.props['data-width']}
            //     >
            //       {unfinishedDiv.props.children}
            //     </div>
            //   )
            // }

            // const updatedCurrentDiv = (
            //   <div
            //     key={processedPicturesMap[picId].key}
            //     style={{
            //       ...processedPicturesMap[picId].props.style,
            //       width: "50%"
            //     }}
            //     data-width={processedPicturesMap.props['data-width']}
            //   >
            //     {processedPicturesMap[picId].props.children}
            //   </div>
            // )

            // resultComponents.push(
            //   <div
            //       key={`divCombined-${picId}`}
            //       style={{
            //         display: 'flex',
            //         flexDirection: "row",
            //         width: "100%",
            //       }}
            //     >
            //       {updatedUnfinishedDiv}
            //       {updatedCurrentDiv}
            //     </div>

            // )
          }
        }
      }

      let currentRowWidth = 0
      let finalGroup = []
      console.log(group)
      console.log(resultComponents)

      for (let i = 0; i < group.length; i++) {
        if (currentRowWidth < 100) {
          finalGroup.push(group[i])
          currentRowWidth += group[i].props['data-width']
          console.log(finalGroup)
        } else {
          if (finalGroup.length == 2) {
            const updatedDiv1 = (
              <div
                key={finalGroup[0].key}
                style={{
                  ...finalGroup[0].props.style,
                  width: '50%',
                }}
                data-width={finalGroup[0].props['data-width']}
              >
                {finalGroup[0].props.children}
              </div>
            )

            const updatedDiv2 = (
              <div
                key={finalGroup[1].key}
                style={{
                  ...finalGroup[1].props.style,
                  width: '50%',
                }}
                data-width={finalGroup[1].props['data-width']}
              >
                {finalGroup[1].props.children}
              </div>
            )

            resultComponents.push(
              <div
                key={`finalDiv-${resultComponents.length}`}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  width: `100%`,
                }}
                data-width={currentRowWidth}
              >
                {updatedDiv1}
                {updatedDiv2}
              </div>
            )
          } else if (finalGroup.length == 1) {
            const updatedDiv1 = (
              <div
                key={finalGroup[0].key}
                style={{
                  ...finalGroup[0].props.style,
                  width: '100%',
                }}
                data-width={finalGroup[0].props['data-width']}
              >
                {finalGroup[0].props.children}
              </div>
            )

            resultComponents.push(
              <div
                key={`finalDiv-${resultComponents.length}`}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  width: `100%`,
                }}
                data-width={currentRowWidth}
              >
                {updatedDiv1}
              </div>
            )
          }

          finalGroup = []
          currentRowWidth = 0
          console.log('not here')
        }
      }

      //check if finalGroup have item left
      if (finalGroup.length === 2) {
        console.log(finalGroup + 'is 2')
        const updatedDiv1 = (
          <div
            key={finalGroup[0].key}
            style={{
              ...finalGroup[0].props.style,
              width: '50%',
            }}
            data-width={finalGroup[0].props['data-width']}
          >
            {finalGroup[0].props.children}
          </div>
        )

        const updatedDiv2 = (
          <div
            key={finalGroup[1].key}
            style={{
              ...finalGroup[1].props.style,
              width: '50%',
            }}
            data-width={finalGroup[1].props['data-width']}
          >
            {finalGroup[1].props.children}
          </div>
        )

        resultComponents.push(
          <div
            key={`finalDiv-${resultComponents.length}`}
            style={{
              display: 'flex',
              flexDirection: 'row',
              width: `100%`,
            }}
            data-width={currentRowWidth}
          >
            {updatedDiv1}
            {updatedDiv2}
          </div>
        )
      } else if (finalGroup.length === 1) {
        console.log(finalGroup + 'is 1')
        console.log(finalGroup)
        console.log(currentPicture)
        const updatedDiv1 = (
          <div
            key={finalGroup[0].key}
            style={{
              ...finalGroup[0].props.style,
              width: '100%',
            }}
            data-width={finalGroup[0].props['data-width']}
          >
            {finalGroup[0].props.children}
          </div>
        )

        resultComponents.push(
          <div
            key={`finalDiv-${resultComponents.length}`}
            style={{
              display: 'flex',
              flexDirection: 'row',
              width: `100%`,
            }}
            data-width={currentRowWidth}
          >
            {updatedDiv1}
          </div>
        )
      }
    }
  }

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
}
