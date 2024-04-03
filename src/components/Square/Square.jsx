import React, { useState } from 'react'


import './Square.scss'


const circleSVG = (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
        <g
            id="SVGRepo_tracerCarrier"
            stroke-linecap="round"
            stroke-linejoin="round"
        ></g>
        <g id="SVGRepo_iconCarrier">
            {" "}
            <path
                d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                stroke="#ffffff"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
            ></path>{" "}
        </g>
    </svg>
)



const crossSVG = (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
        <g
            id="SVGRepo_tracerCarrier"
            stroke-linecap="round"
            stroke-linejoin="round"
        ></g>
        <g id="SVGRepo_iconCarrier">
            {" "}
            <path
                d="M19 5L5 19M5.00001 5L19 19"
                stroke="#fff"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
            ></path>{" "}
        </g>
    </svg>
)




const Square = ({ id, gameState, setGameState, currentPlayer, setCurrentPlayer, finishedState, finishedArrayState, socket, currentElement, playingAs }) => {

    const [icon, setIcon] = useState(null)


    // onclick square handler
    const handleSquareClick = () => {
        if (playingAs !== currentPlayer) {
            return;
        }

        if (finishedState) {
            return;
        }

        if (!icon) {
            if (currentPlayer === "circle") {
                setIcon(circleSVG);
            } else {
                setIcon(crossSVG)
            }

            const myCurrentPlayer = currentPlayer;
            socket.emit("playerMoveFromClient", {
                state: {
                    id,
                    sign: myCurrentPlayer,
                },
            })
            setCurrentPlayer(currentPlayer === "circle" ? "cross" : "circle");

            // setting up the state of the game
            // UPDATING THE GAME STATE
            setGameState((previousState) => {
                let newState = [...previousState]; // making copy to it
                // let newState = previousState.slice();
                // console.log(id);
                const rowIndex = Math.floor(id / 3);
                const colIndex = id % 3;

                newState[rowIndex][colIndex] = myCurrentPlayer;
                // console.log(newState)
                return newState;
            })
        }
    }



    return (
        <div
            className=
            {
                `square ${finishedState ? 'not-allowed' : ""} 
                ${currentPlayer !== playingAs ? 'not-allowed' : ""} 
                ${finishedArrayState.includes(id) ? finishedState + '-won' : ""}`
            }
            onClick={handleSquareClick}
        >
            {
                currentElement === "circle" ? circleSVG : currentElement === "cross" ? crossSVG : icon
            }
        </div>
    )
}

export default Square
