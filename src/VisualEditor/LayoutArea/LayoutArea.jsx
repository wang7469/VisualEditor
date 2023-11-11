import React from 'react';
import { DragDropContext, Droppable, Draggable} from "react-beautiful-dnd";
import { Grid, Skeleton, Container, Card, Image} from '@mantine/core';


export default function LayoutArea({droppedPictures}){
   console.log("in LayoutFun" + droppedPictures.length);
 
    return(

        <Droppable droppableId='destination' type = "group">
            {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                    {/* {[1, 2, 3, 4].map((index) => (
                        <Draggable key={index} draggableId={`layout-${index}`} index={index - 1}>
                        {(provided) => (
                            <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            >
                            <LayoutAreaDroppable droppedPictures={droppedPictures} />
                            </div>
                        )}
                        </Draggable>
                    ))} */}
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
        )
    
}

// function LayoutAreaDroppable({droppedPictures}){
//     return (
//         <div className="sub-card">
//           {droppedPictures.map((droppedPicture, index) => (
//             <div key={droppedPicture.id} className="dropped-picture">
//               <img src={droppedPicture.url} alt={`Dropped Picture ${index + 1}`} />
//             </div>
//           ))}
//         </div>
//       );
//     // <Card withBorder style={{ margin: '5px', height: '200px'}}>
                
//     // </Card>
//     // <Card withBorder style={{ margin: '5px', height: '200px'}}> 
//     // </Card>
//     // <Card withBorder style={{ margin: '5px', height: '200px'}}> 
//     // </Card>
//     // <Card withBorder style={{ margin: '5px', height: '200px'}}> 
//     // </Card>
// }