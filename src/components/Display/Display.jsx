import React, { useEffect, useState } from 'react'

import Square from '../Square/Square'
import CheckWinner from '../Icons/helper'
import PlayOnline from './PlayOnline/PlayOnline'

import './Display.scss'

import { io } from 'socket.io-client'
import Swal from 'sweetalert2';



// O-X Grid
const squareRender = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]



const Display = () => {

    // useState hook for storing the state and changing of state
    const [gameState, setGameState] = useState(squareRender);
    const [currentPlayer, setCurrentPlayer] = useState('circle')
    const [finishedState, setFinishedState] = useState(false);
    const [finishedArrayState, setFinishedArrayState] = useState([]);
    const [playOnline, setPlayOnline] = useState(false);
    const [socket, setSocket] = useState(null);
    const [playerName, setPlayerName] = useState("");
    const [opponentName, setOpponentName] = useState(null);
    const [playingAs, setPlayingAs] = useState(null);

    // const CheckWinner = () => {
    //     // row checks
    //     for (let row = 0; row < gameState.length; row++) {
    //         if (gameState[row][0] === gameState[row][1] && gameState[row][1] === gameState[row][2]) {
    //             setFinishedArrayState([row * 3 + 0, row * 3 + 1, row * 3 + 2]);
    //             return gameState[row][0];
    //         }
    //     }

    //     // column checks
    //     for (let col = 0; col < gameState.length; col++) {
    //         if (gameState[0][col] === gameState[1][col] && gameState[1][col] === gameState[2][col]) {
    //             return gameState[0][col];
    //         }
    //     }

    //     // diagonal checks
    //     if (gameState[0][0] === gameState[1][1] && gameState[1][1] === gameState[2][2]) {
    //         return gameState[0][0];
    //     }
    //     if (gameState[0][2] === gameState[1][1] && gameState[1][1] === gameState[2][0]) {
    //         return gameState[0][2];
    //     }


    //     // checks a drawGame
    //     const isDrawGame = gameState.flat().every((ele) => {
    //         if (ele === "circle" || ele === "cross") return true;
    //     });

    //     if (isDrawGame) return "draw";


    //     return null;
    // }




    // useEffect Hooks
    useEffect(() => {
        const winner = CheckWinner(gameState, setFinishedArrayState);
        if (winner) {
            setFinishedState(winner);
        }
    }, [gameState])




    // UserName(player)
    const takePlayerName = async () => {
        const New_PlayerName = await Swal.fire({
            title: "Enter your name?",
            input: "text",
            showCancelButton: true,
            inputValidator: (value) => {
                if (!value) {
                    return "You need to write something!";
                }
            }
        });
        return New_PlayerName;
    }


    // socket hooks
    socket?.on("connect", () => {
        // alert("socket connected")
        setPlayOnline(true);
    })
    socket?.on("OpponentNotFound", () => {
        setOpponentName(false);
    })
    socket?.on("OppoenetFound", (data) => {
        console.log(data);
        setPlayingAs(data.playingAs);
        setOpponentName(data.opponentName);
    })
    socket?.on("playerMoveFromServer", (data) => {
        console.log(data);
        // setCurrentPlayer(data.state.currentPlayer);
        const id = data.state.id;
        setGameState((prevState) => {
            let newState = [...prevState];
            const rowIndex = Math.floor(id / 3);
            const colIndex = id % 3;
            newState[rowIndex][colIndex] = data.state.sign;
            return newState;
        });
        setCurrentPlayer(data.state.sign === "circle" ? "cross" : "circle");
    })
    socket?.on("opponentLeftMatch", () => {
        setFinishedState("opponentLeftMatch");
    })


    const handlePlayOnline = async () => {
        const result = await takePlayerName();
        // console.log(result); // return an object
        if (!result.isConfirmed) {
            return;
        }
        const Username = result.value;
        setPlayerName(Username);

        const newSocket = io("http://localhost:3500", {
            autoConnect: true
        });
        newSocket?.emit(
            "request_to_play",
            {
                playerName: Username
            }
        )

        setSocket(newSocket);
    }

    // if you want to play online-Game
    if (!playOnline) {
        return (
            <div className="main-container">
                <button onClick={handlePlayOnline} className='playOnline'>Play Online</button>
            </div>
        )
    }

    // Searching for opponenet 
    if (playOnline && !opponentName) {
        return (
            <p>-----Waiting for Opponent-----</p>
        )
    }


    return (
        <>
            <div className="move-detection">
                <div className={`leftSide ${currentPlayer === playingAs ? 'current__move__' + currentPlayer : ''}`}>
                    {playerName}
                </div>
                <div className={`rightSide ${currentPlayer !== playingAs ? 'current__move__' + currentPlayer : ''}`}>
                    {opponentName}
                </div>
            </div>


            <div className='center__container'>
                <h1 className='game-heading header'>
                    Tic Tac Toe
                </h1>
                <div className="square-wrapper">
                    {
                        gameState.map((array, rowIndex) =>
                            array.map((ele, colIndex) => {
                                return (
                                    <Square
                                        id={((3 * rowIndex) + colIndex)}
                                        key={((3 * rowIndex) + colIndex)}
                                        gameState={gameState}
                                        setGameState={setGameState}
                                        currentPlayer={currentPlayer}
                                        setCurrentPlayer={setCurrentPlayer}
                                        finishedState={finishedState}
                                        finishedArrayState={finishedArrayState}
                                        socket={socket}
                                        currentElement={ele}
                                        playingAs={playingAs}
                                    />
                                )
                            })
                        )
                    }
                </div>
                {
                    finishedState && finishedState !== "opponentLeftMatch" && finishedState !== "draw" && (
                        <h3 className='result__container'>
                            {
                                <span className='opponenet'>
                                    {finishedState === playingAs ? "You " : opponentName}
                                </span>
                            }
                            &nbsp;Won the Game
                        </h3>
                    )
                }
                {
                    finishedState && finishedState !== "opponentLeftMatch" && finishedState === "draw" && (
                        <h3 className='result__container'>
                            It's a Draw Game
                        </h3>
                    )
                }
            </div>
            {
                !finishedState && opponentName && (
                    <h3 className="finished__state">
                        You are playing against&nbsp;
                        <span className='opponenet'>
                            {opponentName}
                        </span>
                    </h3>
                )
            }
            {
                finishedState && finishedState === "opponentLeftMatch" && (
                    <h3 className="finished__state">
                        You Won the Match,&nbsp;
                        <span className='opponenet'>
                            {opponentName}
                        </span>
                        &nbsp;left the match
                    </h3>
                )
            }
        </>
    )
}

export default Display
