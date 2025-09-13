import Board from "../Components/board-component"
import {gameConfig } from "../Logic/gameConfig"
import { gameRules } from "../Logic/gameRules"
export default function MathWarPage(){
    return (
        <Board gameConfig={gameConfig} gameRules={gameRules}/>
    )
}