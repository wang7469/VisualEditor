import React from "react";
import PalletArea from "./PalletArea/PalletArea";
import LayoutArea from "./LayoutArea/LayoutArea";
import { Grid, Skeleton, Container, Card} from '@mantine/core';
import { DragDropContext, Droppable, Draggable} from "react-beautiful-dnd";

const pictures = [
    { id: '1', picture: 'https://images.unsplash.com/photo-1477554193778-9562c28588c0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80'},
    { id: '2', picture:  'https://images.unsplash.com/photo-1624298357597-fd92dfbec01d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80' },
    { id: '3', picture:  'https://images.unsplash.com/photo-1624298357597-fd92dfbec01d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80' },
    { id: '4', picture:  'https://images.unsplash.com/photo-1624298357597-fd92dfbec01d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80'},
    { id: '5', picture:  'https://images.unsplash.com/photo-1624298357597-fd92dfbec01d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80' },
  ];


export default function VisualEditor() {
    const [draggablePictures, setDraggablePictures] = React.useState(pictures);
    const [droppedPictures, setDroppedPictures] = React.useState([]);
    
    const handleDropEnd = (results) => {
        const {source, destination, type} = results;

        if(!destination || !source) return;
        if(destination.droppableId === source.droppableId && source.index === destination.index) return;

       
        const updatedDraggablePictures = [...draggablePictures];
        const updatedDroppedPictures = [...droppedPictures];
        
        // If dragging within the source card
        if (source.droppableId === 'source' && destination.droppableId === 'source') {
            const [removed] = updatedDraggablePictures.splice(source.index, 1);
            updatedDraggablePictures.splice(destination.index, 0, removed);
            setDraggablePictures(updatedDraggablePictures);
        }
    
        // If dragging from source to destination
        if (source.droppableId === 'source' && destination.droppableId === 'destination') {
            const [removed] = updatedDraggablePictures.splice(source.index, 1);
            setDraggablePictures(updatedDraggablePictures);
            setDroppedPictures((prevDroppedPictures) => [...prevDroppedPictures, removed]);
        }
    
        // If dragging within the destination card
        if (source.droppableId === 'destination' && destination.droppableId === 'destination') {
            const [removed] = updatedDroppedPictures.splice(source.index, 1);
            updatedDroppedPictures.splice(destination.index, 0, removed);
            setDroppedPictures(updatedDroppedPictures);
        }
    
        // If dragging from destination to source
        if (source.droppableId === 'destination' && destination.droppableId === 'source') {
            const [removed] = updatedDroppedPictures.splice(source.index, 1);
            setDroppedPictures(updatedDroppedPictures);
            setDraggablePictures((prevSourcePictures) => [...prevSourcePictures, removed]);
        }
        
    }

    return (
        <>
        <DragDropContext 
            onDragEnd={handleDropEnd}
        >
        <Container size="xl">
            <Grid>
            <Grid.Col span={{ base: 12, xs: 12 }}>
                    <Card withBorder radius="lg" padding="xl" style={{height: '100px', marginTop: '30px'}}>
                    </Card>
                
            </Grid.Col>
            <Grid.Col span={{ base: 12, xs: 6 }}>
                <Card withBorder radius="lg" padding="xl" style={{height: '900px', marginBottom: '40px'}}>
                    <PalletArea draggablePictures={draggablePictures} />
                </Card>                            
            </Grid.Col>
            <Grid.Col span={{ base: 12, xs: 6 }}>
                <Card withBorder radius="lg" padding="xl" style={{height: '900px'}}>
                    <LayoutArea droppedPictures={droppedPictures}/>
                </Card> 
            </Grid.Col>
            </Grid>
        </Container>
        </DragDropContext>
        </>
    );
  }