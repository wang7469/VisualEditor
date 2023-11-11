import { Card } from '@mantine/core';
import { Draggable} from "react-beautiful-dnd";

export default function PalletAreaPicture({pictureSource, pictureId, index}){
    return(
        <Draggable draggableId={pictureId} key={pictureId} index={index}>
            {(provided) => (
                <div 
                    {...provided.dragHandleProps} 
                    {...provided.draggableProps} 
                    ref={provided.innerRef}
                >
                    <Card withBorder style={{ margin: '5px' }}>
                        <img src={pictureSource} style={{ width: 'auto', height: '130px' }} />    
                    </Card>
                </div>
            )}
        </Draggable>
    )
}