import React from 'react';
import { DragDropContext, Droppable, Draggable} from "react-beautiful-dnd";
import { Grid, Skeleton, Container, Card, Image} from '@mantine/core';


export default function LayoutArea({droppedPictures}){
    console.log( droppedPictures[0].picture);
    return(
        <>
        {/* <Card withBorder style={{ margin: '5px', height: '200px', marginLeftL: '0px'}}>
                

        <Droppable droppableId='square-1' type = "group">
            {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  
                   {droppedPictures.map((droppedPicture, index) => (
                        <Draggable draggableId={droppedPicture.id} key={droppedPicture.id} index={index}>
                        {(provided) => (
                            <div 
                                {...provided.dragHandleProps} 
                                {...provided.draggableProps} 
                                ref={provided.innerRef}
                            >
                                <Card withBorder style={{ margin: '5px' }}>
                                    <img src={droppedPicture.picture} style={{ width: 'auto', height: '130px' }} />    
                                </Card>
                            </div>
                        )}
                    </Draggable>
                        ))}                   
                </div>
            )}
        </Droppable>
       </Card> */}
       
      
          {droppedPictures.map((square) => (
            <Card withBorder style={{ margin: '5px', height: '200px', marginLeftL: '0px'}}>
            <Droppable droppableId={square.id} type="group">
              {(boxProvided) => (
                <div
                  {...boxProvided.droppableProps}
                  ref={boxProvided.innerRef}
                >
                  {square.picture && (
                    <Draggable draggableId={square.picture.id} key={square.picture.id} index={0}>
                      {(dragProvided) => (
                        <div
                          {...dragProvided.draggableProps}
                          {...dragProvided.dragHandleProps}
                          ref={dragProvided.innerRef}
                        >
                            <Card withBorder style={{ margin: '5px' }}>
                            <img src={square.picture.picture} style={{ width: 'auto', height: '130px' }}/> 
                            </Card>
                        </div>
                      )}
                    </Draggable>
                  )}
                  {boxProvided.placeholder}
                </div>
              )}
            </Droppable>
            </Card>
          ))}

         
        </>
        )
    
}
