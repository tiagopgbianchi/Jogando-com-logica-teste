import Board from "../Components/board-component"
import { passagemConfig } from "../Logic/gameConfig"
import { passagemRules } from "../Logic/gameRules"
export default function BaseGamePage(){
    return (
        <Board gameConfig={passagemConfig} gameRules={passagemRules}/>
    )
}