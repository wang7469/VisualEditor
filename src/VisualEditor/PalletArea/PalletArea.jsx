import { DragDropContext, Droppable, Draggable} from "react-beautiful-dnd";
import PalletAreaPicture from "./PalletAreaPicture";

export default function PalletArea({draggablePictures}){
    return (
    <Droppable droppableId='source' type = "group">
        {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
                {draggablePictures.map((eachPicture, index) => 
                    <PalletAreaPicture pictureSource={eachPicture.picture} pictureId={eachPicture.id} index={index}/>
                )}
            </div>
        )}
    </Droppable> 
    )

}
