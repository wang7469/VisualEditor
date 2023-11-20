import React from 'react'
import { Button } from '@mantine/core'
import { IconSquareRoundedPlus } from '@tabler/icons-react'
import LayoutAreaPicture from './LayoutAreaPicture'

export default function LayoutArea({
  droppedPictures,
  onAddSquare,
  verticalSquareCellCount,
  handleSplitCell,
  isButtonDisabled,
}) {
  console.log(droppedPictures)

  const findPicById = (arr, id) => {
    const index = arr.findIndex((element) => element.id === id)
    if (index !== -1) {
      return arr[index]
    }
    return {}
  }

  const isSubId = (firstId, secondId) => {
    if (
      firstId === null ||
      secondId === null ||
      firstId === undefined ||
      secondId === undefined
    ) {
      console.log('firstId or secondId passed to isSubId function is undefined')
      return false
    }

    let firstIdParts = firstId.split('-')
    let secondIdParts = secondId.split('-')

    firstIdParts.splice(1, 1)
    secondIdParts.splice(1, 1)

    if (secondIdParts.length !== firstIdParts.length - 1) {
      return false
    }

    for (let i = 0; i < secondIdParts.length; i++) {
      if (secondIdParts[i] !== firstIdParts[i]) {
        return false
      }
    }
    return true
  }

  const locateGroup = (group, id) => {
    for (let i = 0; i < group.length; i++) {
      if (parseInt(group[i].key.split('-')[1]) < parseInt(id.split('-')[1])) {
        continue
      } else {
        return i
      }
    }
    return 4
  }

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

  const hasSameIdPattern = (id1, id2) => {
    const parts1 = id1.split('-')
    const parts2 = id2.split('-')

    if (parts1.length !== parts2.length) {
      return false
    }

    if (
      parts1.length > 3 &&
      parts1[parts1.length - 2] === 'vertical' &&
      parts2.length > 3 &&
      parts2[parts2.length - 2] === 'vertical'
    ) {
      const number1 = parseInt(parts1[1], 10)
      const number2 = parseInt(parts2[1], 10)

      if (number2 - number1 === 2) {
        return true
      }
    }
    return false
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
      let pairIdsMap = new Set()

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

      //we will focus on process the following subarray
      const subArrayOfDroppedPictures = droppedPictures.slice(
        groupStartingIndex,
        groupEndingIndex
      )
      let processedPictures = new Array(subArrayOfDroppedPictures.length).fill(
        false
      )

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

        idParts1.splice(1, 1)
        idParts2.splice(1, 1)

        if (
          idParts1.join('-') === idParts2.join('-') &&
          subArrayOfDroppedPictures[i].parentCell ===
            subArrayOfDroppedPictures[i + 1].parentCell &&
          !pairIdsMap.has(picToWrap1.id) &&
          !pairIdsMap.has(picToWrap2.id)
        ) {
          processedPictures[i] = true
          processedPictures[i + 1] = true

          pairIdsMap.add(picToWrap1.id)
          pairIdsMap.add(picToWrap2.id)

          let tempGroup = []
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
                direction === 'vertical'
                  ? picToWrap1.widthPercentTaken
                  : picToWrap1.widthPercentTaken * 2
              }
              data-height={
                direction === 'vertical'
                  ? picToWrap1.heightPercentTaken * 2
                  : picToWrap1.heightPercentTaken
              }
            >
              {tempGroup}
            </div>
          )
          processedPicturesMap[picToWrap1.id] = splitPictureGroup
        }
      }

      // *************************MAY BE REMOVED?????****************************** */
      let j = 0
      const keys = Object.keys(processedPicturesMap)

      while (j < keys.length - 1) {
        const key1 = keys[j]
        const key2 = keys[j + 1]

        if (
          hasSameIdPattern(key1, key2) &&
          processedPicturesMap[key1] &&
          processedPicturesMap[key2]
        ) {
          const width = processedPicturesMap[key1].props['data-width']
          const height = processedPicturesMap[key1].props['data-height']

          const combined = (
            <div
              key={key1}
              style={{
                display: 'flex',
                flexDirection:
                  getSecondLastWordOfId(key1) === 'vertical' ? 'column' : 'row',
                width: '100%',
              }}
              data-width={
                getSecondLastWordOfId(key1) === 'vertical' ? width : width * 2
              }
              data-height={
                getSecondLastWordOfId(key1) === 'vertical' ? height * 2 : height
              }
            >
              {processedPicturesMap[key1]}
              {processedPicturesMap[key2]}
            </div>
          )

          processedPicturesMap[key1] = combined
          delete processedPicturesMap[key2]

          keys.splice(i, 2)
        }
        j++
      }

      const group = []
      let subGroup = []
      for (let picId in processedPicturesMap) {
        console.log(picId)
      }

      let totalWidth = 0
      for (let picId in processedPicturesMap) {
        if (processedPicturesMap[picId] !== null) {
          const index = subArrayOfDroppedPictures.findIndex(
            (element) => element.id === picId
          )
          const pic = subArrayOfDroppedPictures[index]

          let indexOfPic
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
            console.log('case1 ' + picId)
            group.push(processedPicturesMap[picId])
          }
          //case 2: previous is a picture we need to wrap them together with current div
          //        previous could ONLY BE A PICTURE as we are iterate from front to end
          else if (
            prevIndex >= 0 &&
            isSubId(picId, subArrayOfDroppedPictures[prevIndex].id) &&
            !pairIdsMap.has(subArrayOfDroppedPictures[prevIndex].id) &&
            !processedPictures[prevIndex]
          ) {
            console.log('case2 ' + picId)
            subGroup = []
            const prevPic = subArrayOfDroppedPictures[prevIndex]
            let lastPicture = prevPic
            const currentPic = findPicById(subArrayOfDroppedPictures, picId)
            totalWidth = currentPic.isHorizontalSplit
              ? currentPic.widthPercentTaken * 2
              : currentPic.widthPercentTaken
            const splitDirection = getLastWordOfId(prevPic.id)
            const picWidth = splitDirection === 'vertical' ? 100 : 50
            const heightCut = Math.pow(2, prevPic.verticalSplitCount)
            const squareCellIndex = parseInt(prevPic.id.split('-')[1]) - 1

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

            if (
              prevIndex - 1 >= 0 &&
              isSubId(
                subArrayOfDroppedPictures[prevIndex - 1].id,
                subArrayOfDroppedPictures[prevIndex].id
              ) &&
              !pairIdsMap.has(subArrayOfDroppedPictures[prevIndex - 1].id)
            ) {
              if (!processedPictures[prevIndex]) {
                const updatedPrevPicDiv = (
                  <LayoutAreaPicture
                    currentPicture={prevPic}
                    verticalSquareCellCount={verticalSquareCellCount}
                    heightCut={heightCut}
                    widthPercent='100'
                    index={squareCellIndex}
                    handleSplitCell={handleSplitCell}
                  />
                )
                group.push(
                  <div
                    key={prevPic.id}
                    style={{ width: '100%' }}
                    data-width={prevPic.widthPercentTaken}
                    data-height={prevPic.heightPercentTaken}
                  >
                    {updatedPrevPicDiv}
                  </div>
                )
                processedPictures[prevIndex] = true
              }
              group.push(processedPicturesMap[picId])
              continue
            }

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
                data-height={currentDiv.props['data-height']}
              >
                {currentDiv.props.children}
              </div>
            )

            subGroup.push(
              <div
                key={prevPic.id}
                style={{
                  display: 'flex',
                  flexDirection:
                    getSecondLastWordOfId(picId) === 'vertical'
                      ? 'column'
                      : 'row',
                  width: `100%`,
                }}
                data-width={
                  getSecondLastWordOfId(picId) === 'vertical'
                    ? prevPic.widthPercentTaken
                    : prevPic.widthPercentTaken * 2
                }
                data-height={
                  getSecondLastWordOfId(picId) === 'vertical'
                    ? prevPic.heightPercentTaken * 2
                    : prevPic.heightPercentTaken
                }
              >
                {prevPicDiv}
                {updatedCurrentDiv}
              </div>
            )

            if (getSecondLastWordOfId(picId) === 'horizontal')
              totalWidth += prevPic.widthPercentTaken
            processedPictures[prevIndex] = true

            //start search around
            let prevPrevIndex = prevIndex
            let indexOfNext = nextIndex
            while (totalWidth < 100) {
              if (
                prevPrevIndex - 1 >= 0 &&
                isSubId(
                  lastPicture.id,
                  subArrayOfDroppedPictures[prevPrevIndex - 1].id
                ) &&
                !pairIdsMap.has(
                  subArrayOfDroppedPictures[prevPrevIndex - 1].id
                ) &&
                !processedPictures[prevPrevIndex - 1]
              ) {
                prevPrevIndex--
                processedPictures[prevPrevIndex] = true
                const prevPrevPic = subArrayOfDroppedPictures[prevPrevIndex]
                lastPicture = prevPrevPic
                const splitDirection = getLastWordOfId(prevPrevPic.id)
                const prevPicWidth = splitDirection === 'vertical' ? 100 : 50
                const heightCut = Math.pow(2, prevPrevPic.verticalSplitCount)
                const squareCellIndex =
                  parseInt(prevPrevPic.id.split('-')[1]) - 1

                const prevPrevPicDiv = (
                  <LayoutAreaPicture
                    currentPicture={prevPrevPic}
                    verticalSquareCellCount={verticalSquareCellCount}
                    heightCut={heightCut}
                    widthPercent={prevPicWidth}
                    index={squareCellIndex}
                    handleSplitCell={handleSplitCell}
                  />
                )
                const currentDiv = subGroup.pop()
                const updatedCurrentDiv = (
                  <div
                    key={currentDiv.key}
                    style={{
                      ...currentDiv.props.style,
                      width:
                        getLastWordOfId(prevPrevPic.id) === 'vertical'
                          ? '100%'
                          : '50%',
                    }}
                    data-width={currentDiv.props['data-width']}
                    data-height={currentDiv.props['data-height']}
                  >
                    {currentDiv.props.children}
                  </div>
                )

                subGroup.push(
                  <div
                    key={prevPrevPic.id}
                    style={{
                      display: 'flex',
                      flexDirection:
                        getLastWordOfId(prevPrevPic.id) === 'vertical'
                          ? 'column'
                          : 'row',
                      width: `100%`,
                    }}
                    data-width={
                      getLastWordOfId(prevPrevPic.id) === 'vertical'
                        ? prevPrevPic.widthPercentTaken
                        : prevPrevPic.widthPercentTaken * 2
                    }
                    data-height={
                      getLastWordOfId(prevPrevPic.id) === 'vertical'
                        ? prevPrevPic.heightPercentTaken * 2
                        : prevPrevPic.heightPercentTaken
                    }
                  >
                    {prevPrevPicDiv}
                    {updatedCurrentDiv}
                  </div>
                )
                if (getLastWordOfId(prevPrevPic.id) === 'horizontal') {
                  totalWidth += prevPrevPic.widthPercentTaken
                }
              } else if (
                indexOfNext < subArrayOfDroppedPictures.length &&
                isSubId(
                  lastPicture.id,
                  subArrayOfDroppedPictures[indexOfNext].id
                ) &&
                !pairIdsMap.has(subArrayOfDroppedPictures[indexOfNext - 1].id)
              ) {
                const nextPic = subArrayOfDroppedPictures[indexOfNext]
                lastPicture = nextPic
                const splitDirection = getLastWordOfId(nextPic.id)
                const picWidth = splitDirection === 'vertical' ? 100 : 50
                const heightCut = Math.pow(2, nextPic.verticalSplitCount)
                const squareCellIndex = parseInt(nextPic.id.split('-')[1]) - 1

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
                    key={nextPic.id}
                    style={{
                      display: 'flex',
                      flexDirection:
                        getSecondLastWordOfId(picId) === 'vertical'
                          ? 'column'
                          : 'row',
                      width: `100%`,
                    }}
                    data-width={
                      getSecondLastWordOfId(picId) === 'vertical'
                        ? nextPic.widthPercentTaken
                        : nextPic.widthPercentTaken * 2
                    }
                    data-height={
                      getSecondLastWordOfId(picId) === 'vertical'
                        ? nextPic.heightPercentTaken * 2
                        : nextPic.heightPercentTaken
                    }
                  >
                    {currentDiv}
                    {nextPicDiv}
                  </div>
                )
                if (getLastWordOfId(nextPic.id) === 'horizontal') {
                  totalWidth += nextPic.widthPercentTaken
                }
                indexOfNext++
                processedPictures[indexOfNext] = true
              } else {
                break
              }
            }

            group.push(subGroup[0])
            subGroup = []
            totalWidth = 0
          }
          //case 4: next index is a pic
          else if (
            nextIndex < subArrayOfDroppedPictures.length &&
            isSubId(picId, subArrayOfDroppedPictures[nextIndex].id) &&
            !pairIdsMap.has(subArrayOfDroppedPictures[nextIndex].id)
          ) {
            console.log('case4')
            subGroup = []
            const currentPic = findPicById(subArrayOfDroppedPictures, picId)
            totalWidth = currentPic.isHorizontalSplit
              ? currentPic.widthPercentTaken * 2
              : currentPic.widthPercentTaken
            const nextPic = subArrayOfDroppedPictures[nextIndex]
            let lastPic = nextPic

            const splitDirection = getLastWordOfId(nextPic.id)
            const picWidth = splitDirection === 'vertical' ? 100 : 50
            const heightCut = Math.pow(2, nextPic.verticalSplitCount)
            const squareCellIndex = parseInt(nextPic.id.split('-')[1]) - 1

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

            if (
              nextIndex + 1 < subArrayOfDroppedPictures.length &&
              isSubId(subArrayOfDroppedPictures[nextIndex + 1].id, nextPic.id)
            ) {
              const updatedPrevPicDiv = (
                <LayoutAreaPicture
                  currentPicture={nextPic}
                  verticalSquareCellCount={verticalSquareCellCount}
                  heightCut={heightCut}
                  widthPercent='100'
                  index={squareCellIndex}
                  handleSplitCell={handleSplitCell}
                />
              )
              group.push(processedPicturesMap[picId])
              group.push(
                <div
                  key={nextPic.id}
                  style={{ width: '100%' }}
                  data-width={nextPic.widthPercentTaken}
                  data-height={nextPic.heightPercentTaken}
                >
                  {updatedPrevPicDiv}
                </div>
              )

              processedPictures[nextIndex] = true
              continue
            }

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
                data-height={currentDiv.props['data-height']}
              >
                {currentDiv.props.children}
              </div>
            )

            subGroup.push(
              <div
                key={nextPic.id}
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
                data-height={
                  getSecondLastWordOfId(picId) === 'vertical'
                    ? nextPic.heightPercentTaken * 2
                    : nextPic.heightPercentTaken
                }
              >
                {updatedCurrentDiv}
                {nextPicDiv}
              </div>
            )

            processedPictures[nextIndex] = true
            if (getSecondLastWordOfId(picId) === 'horizontal')
              totalWidth += nextPic.widthPercentTaken

            let prevPrevIndex = prevIndex
            let indexOfNext = nextIndex
            let previousProcessedId = nextPic.id

            while (totalWidth < 100) {
              if (
                indexOfNext + 1 < subArrayOfDroppedPictures.length &&
                isSubId(
                  previousProcessedId,
                  subArrayOfDroppedPictures[indexOfNext + 1].id
                )
              ) {
                indexOfNext++
                const nextNextPic = subArrayOfDroppedPictures[indexOfNext]
                lastPic = nextNextPic
                const splitDirection = getLastWordOfId(nextNextPic.id)
                const picWidth = splitDirection === 'vertical' ? 100 : 50
                const heightCut = Math.pow(2, nextNextPic.verticalSplitCount)
                const squareCellIndex =
                  parseInt(nextNextPic.id.split('-')[1]) - 1

                const nextNextPicDiv = (
                  <LayoutAreaPicture
                    currentPicture={nextNextPic}
                    verticalSquareCellCount={verticalSquareCellCount}
                    heightCut={heightCut}
                    widthPercent={picWidth}
                    index={squareCellIndex}
                    handleSplitCell={handleSplitCell}
                  />
                )
                const currentDiv = subGroup.pop()
                const updatedCurrentDiv = (
                  <div
                    key={currentDiv.key}
                    style={{
                      ...currentDiv.props.style,
                      width:
                        getLastWordOfId(nextNextPic.id) === 'vertical'
                          ? '100%'
                          : '50%',
                    }}
                    data-width={
                      getLastWordOfId(nextNextPic.id) === 'vertical'
                        ? nextNextPic.widthPercentTaken
                        : nextNextPic.widthPercentTaken * 2
                    }
                    data-height={
                      getLastWordOfId(nextNextPic.id) === 'vertical'
                        ? nextNextPic.heightPercentTaken * 2
                        : nextNextPic.heightPercentTaken
                    }
                  >
                    {currentDiv.props.children}
                  </div>
                )

                subGroup.push(
                  <div
                    key={nextNextPic.id}
                    style={{
                      display: 'flex',
                      flexDirection:
                        getLastWordOfId(nextNextPic.id) === 'vertical'
                          ? 'column'
                          : 'row',
                      width: `100%`,
                    }}
                    data-width={
                      getLastWordOfId(nextNextPic.id) === 'vertical'
                        ? nextNextPic.widthPercentTaken
                        : nextNextPic.widthPercentTaken * 2
                    }
                    data-height={
                      getLastWordOfId(nextNextPic.id) === 'vertical'
                        ? nextNextPic.heightPercentTaken * 2
                        : nextNextPic.heightPercentTaken
                    }
                  >
                    {updatedCurrentDiv}
                    {nextNextPicDiv}
                  </div>
                )
                if (getLastWordOfId(nextNextPic.id) === 'horizontal') {
                  totalWidth += nextNextPic.widthPercentTaken
                }
                previousProcessedId = nextNextPic.id
                processedPictures[indexOfNext] = true
              } else if (
                prevPrevIndex >= 0 &&
                isSubId(
                  lastPic.id,
                  subArrayOfDroppedPictures[prevPrevIndex].id
                ) &&
                !pairIdsMap.has(subArrayOfDroppedPictures[prevPrevIndex].id)
              ) {
                processedPictures[prevPrevIndex] = true
                const prevPrevPic = subArrayOfDroppedPictures[prevPrevIndex]
                lastPic = prevPrevPic
                const splitDirection = getLastWordOfId(prevPrevPic.id)
                const prevPicWidth = splitDirection === 'vertical' ? 100 : 50
                const heightCut = Math.pow(2, prevPrevPic.verticalSplitCount)
                const squareCellIndex =
                  parseInt(prevPrevPic.id.split('-')[1]) - 1

                const prevPrevPicDiv = (
                  <LayoutAreaPicture
                    currentPicture={prevPrevPic}
                    verticalSquareCellCount={verticalSquareCellCount}
                    heightCut={heightCut}
                    widthPercent={prevPicWidth}
                    index={squareCellIndex}
                    handleSplitCell={handleSplitCell}
                  />
                )
                const currentDiv = subGroup.pop()
                const updatedCurrentDiv = (
                  <div
                    key={currentDiv.key}
                    style={{
                      ...currentDiv.props.style,
                      width:
                        getLastWordOfId(prevPrevPic.id) === 'vertical'
                          ? '100%'
                          : '50%',
                    }}
                    data-width={currentDiv.props['data-width']}
                    data-height={currentDiv.props['data-height']}
                  >
                    {currentDiv.props.children}
                  </div>
                )
                subGroup.push(
                  <div
                    key={prevPrevPic.id}
                    style={{
                      display: 'flex',
                      flexDirection:
                        (getLastWordOfId(prevPrevPic.id) === 'vertical') ===
                        'vertical'
                          ? 'column'
                          : 'row',
                      width: `100%`,
                    }}
                    data-width={
                      getLastWordOfId(prevPrevPic.id) === 'vertical'
                        ? prevPrevPic.widthPercentTaken
                        : prevPrevPic.widthPercentTaken * 2
                    }
                    data-height={
                      getLastWordOfId(prevPrevPic.id) === 'vertical'
                        ? prevPrevPic.heightPercentTaken * 2
                        : prevPrevPic.heightPercentTaken
                    }
                  >
                    {prevPrevPicDiv}
                    {updatedCurrentDiv}
                  </div>
                )
                if (getLastWordOfId(prevPrevPic.id) === 'horizontal') {
                  totalWidth += prevPrevPic.widthPercentTaken
                }
                prevPrevIndex--
              } else {
                break
              }
            }
            group.push(subGroup[0])
          } else {
            //case 5: div and div combination
            console.log('case 5 ' + picId)
            group.push(processedPicturesMap[picId])
          }
        }
      }

      for (let i = 0; i < processedPictures.length; i++) {
        if (!processedPictures[i]) {
          const picture = subArrayOfDroppedPictures[i]
          const picWidth = 100
          const heightCut = Math.pow(2, picture.verticalSplitCount)
          const squareCellIndex = parseInt(picture.id.split('-')[1]) - 1

          const picDiv = (
            <LayoutAreaPicture
              currentPicture={picture}
              verticalSquareCellCount={verticalSquareCellCount}
              heightCut={heightCut}
              widthPercent={picWidth}
              index={squareCellIndex}
              handleSplitCell={handleSplitCell}
            />
          )
          group.splice(
            locateGroup(group, picture.id),
            0,
            <div
              key={picture.id}
              style={{ width: `${picture.widthPercentTaken}%` }}
              data-width={picture.widthPercentTaken}
              data-height={picture.heightPercentTaken}
            >
              {picDiv}
            </div>
          )
        }
      }

      // console.log(group)
      // for(let i = 0; i < group.length; ){
      //   let heightOfGroup = group[i].props[`data-height`]
      //   while(heightOfGroup < 100){
      //     const currentGroup = group[i]
      //     console.log(i+1 < group.length)
      //     if(i+1 < group.length && group[i+1].props['data-width'] === currentGroup.props['data-width'] && group[i+1].props['data-height'] < (100-heightOfGroup)){
      //       console.log("here?")
      //       const div = (
      //           <div
      //           key={`${currentGroup.key}`}
      //           style={{
      //             display: 'flex',
      //             flexDirection: 'column',
      //             width: `100%`,
      //           }}
      //           data-width={currentGroup.props['data-width']}
      //           data-height={currentGroup.props['data-height'] + group[i+1].props['data-height'] }
      //         >
      //           {currentGroup}
      //           {group[i+1]}
      //         </div>
      //       )
      //       group.splice(i, 2)
      //       group.splice(i, 0, div)
      //       heightOfGroup += group[i+1].props['data-height']
      //       i++
      //     }else{
      //       break
      //     }

      //   }
      //   i++
      // }

      let currentRowWidth = 0
      let finalGroup = []
      let maxRowHeight = 0
      console.log(group)

      for (let i = 0; i < group.length; ) {
        if (currentRowWidth < 100) {
          finalGroup.push(group[i])
          currentRowWidth += group[i].props['data-width']
          // maxRowHeight = Math.max(maxRowHeight, group[i].props['data-height'])
          console.log(group[i])
        } else {
          let finalDiv = []
          //   for (let j = 0; j < finalGroup.length; j++) {
          //     const currentDiv = finalGroup[j]
          //     console.log(currentDiv)

          //     if(currentDiv.props['data-height'] < maxHeightOfRow){
          //       if(!(j+1 < finalGroup.length)){
          //         const combineVertically = (
          //               <div
          //           key={`finalDiv-${i+j}`}
          //           style={{
          //             display: 'flex',
          //             flexDirection: 'column',
          //             width: `${group[i].props['data-width']}%`,
          //           }}
          //           data-width={group[i].props['data-width']}
          //         >
          //           {currentDiv}
          //           {group[i]}
          //         </div>)
          //       }else{
          //         console.log("simply combine with the next on in finalGroup")
          //       }
          //     }else{

          //     }
          //  }

          for (let i = 0; i < finalGroup.length; i++) {
            const currentDiv = finalGroup[i]

            finalDiv.push(
              <div
                key={currentDiv.key}
                style={{
                  ...currentDiv.props.style,
                  width: `${currentDiv.props['data-width']}%`,
                }}
                data-width={currentDiv.props['data-width']}
              >
                {currentDiv.props.children}
              </div>
            )
          }

          resultComponents.push(
            <div
              key={`finalDiv-${resultComponents.length}`}
              style={{
                display: 'flex',
                flexDirection: 'row',
                width: `100%`,
              }}
              data-width='100'
            >
              {finalDiv}
            </div>
          )

          finalGroup = []
          finalGroup.push(group[i])
          currentRowWidth = 0
          currentRowWidth += group[i].props['data-width']
        }

        i++
      }

      let finalDiv = []
      for (let i = 0; i < finalGroup.length; i++) {
        const currentDiv = finalGroup[i]
        finalDiv.push(
          <div
            key={currentDiv.key}
            style={{
              ...currentDiv.props.style,
              width: `${currentDiv.props['data-width']}%`,
            }}
            data-width={currentDiv.props['data-width']}
          >
            {currentDiv.props.children}
          </div>
        )
      }
      resultComponents.push(
        <div
          key={`finalDiv-${resultComponents.length}`}
          style={{
            display: 'flex',
            flexDirection: 'row',
            width: `100%`,
          }}
          data-width='100'
        >
          {finalDiv}
        </div>
      )
    }
  }

  return (
    <div style={{ maxHeight: '900px', height: 'auto' }}>
      {resultComponents.map((component, index) => (
        <React.Fragment key={index}>{component}</React.Fragment>
      ))}
      <Button
        variant='light'
        size='sm'
        radius='sm'
        onClick={onAddSquare}
        disabled={isButtonDisabled}
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
