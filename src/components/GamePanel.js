import React, {useState, useEffect} from 'react';

import _ from 'lodash'
import shortid from 'shortid';

import PlayerPanel from './PlayerPanel';

import QuestionPanel from './QuestionPanel';

/*

state: 
    .GAME_ID (*String) - the game (or session) id. Auto-generated when joining as a 'host' and manually entered if joining as 'player' or 'audience'
    .PLAYER_ID - the user's unique id. Auto-generated when the app is started.

    .my_answer (0-3) - when host, player1-3 select answer

    .game_role ('host', 'player', 'audience') - when you enter the game as

    .quiz_role ('host', 'player{1-3}') - 'host' is automatically assigned if you entered the game (game_role) as 'host'.


    .player{1-3}_answer (0-3) - each player's answer sent to the game host

    .video_stream_id - the current user's video id
    .{host|player{1-3}}_video_stream_id (true/false) - a flag if the x_video_stream_id has already been rendered (rtcEngine.subscribe)

    .game_status:

        .state (0-3) - 0 - uninitialised; 1 - waiting for players; 2 - started; 3 - ended

        .player{1-3}_player_id (*String) - The respective player's playerId
        .player{1-3}_video_stream_id (*Number) - The respective player's Agora video id

        .player{1-3}_answered (true/false) - when a player already sent an answer
        .player{1-3}_answer_correct (true/false) - when the host send an answer and whether the each player's answer is correct or not

        .host_player_id (*String) - the host player's playerId
        .host_video_stream_id (*Number) - The host's Agora video id

        .questionId (*String) - the unique id for the question.
        .question (*String) - the current question
        .question_answers [*String] - the answer options for the current question
        .answer (0-3) - the answer provided by the host
*/

export default function(props) {
    const [state, setState] = useState({_GAME_ID: 'ZmvvCkKdNf'});

    const {quiz_engine} = props;
    const {game_role, PLAYER_ID, game_status} = quiz_engine;

    console.log('[GamePanel.js]:: state', state, 'quiz_engine', quiz_engine);

    useEffect(() => {
        (async () => {
            quiz_engine.onGameStatusUpdate = () => {
                console.log(`[GamePanel.js]:: onGameStatusUpdate`);

                setState({});
            };

            quiz_engine.onPlayerJoin = (playerId) => {
                console.log(`[GamePanel.js]:: onPlayerJoin`, playerId);

                setState({});
            };
    
            if (game_role === "host") {
                console.log(`[GamePanel.js]:: Setting up onPlayerJoin`);
    
                quiz_engine.onPlayerAnswer = (answer, playerId) => {
                    console.log(`[GamePanel.js]:: onPlayerAnswer`, answer, playerId);
    
                    setState({});
                };
    
                await quiz_engine.createGame();
            }
        })();
    }, [props.quiz_engine]);

    const joinGame = async () => {
        if (state._GAME_ID) {
            state.GAME_ID = await quiz_engine.joinGame(state._GAME_ID);

            console.log(`[GamePanel.js]:: joinGame: Successfully joined with GAME_ID`, state.GAME_ID);

            await quiz_engine.requestAssignQuizRole();


        }
    };

    return (
        <div className='game-panel slide-in-top'>
            <div style={{flexGrow : 1, display: 'flex', border: '1px solid red', height: '100%'}}>
                {/* <div style={{border: '1px solid green', flexGrow: 1, margin: 'auto'}}>1</div> */}
                {state.GAME_ID ?
                    <QuestionPanel game_role={game_role} game_status={game_status}/>
                :
                    <div className='slide-in-top' style={{margin: 'auto', _animationDelay: '1s'}}>
                        <div>
                            Enter Game ID:
                        </div>
                        <div>
                            <input onChange={e => setState({...state, _GAME_ID: e.target.value})} value={state._GAME_ID}></input>
                        </div>
                        <div>
                            <button onClick={joinGame}>Done</button>
                        </div>
                    </div>
                }
            </div>
            <div className='players-panel'>
                {/* <div>{_.upperFirst(game_role)} <div style={{display: 'block'}}/> PLAYER_ID {PLAYER_ID}</div> */}
                {['host', 'player1', 'player2', 'player3'].map(quiz_role =>
                    <div key={quiz_role} style={{margin: "auto", _border: '1px dashed green', marginTop: '0px'}}>
                        <PlayerPanel 
                            my_answer={quiz_engine[`${quiz_role}_answer`]}
                            quiz_engine={quiz_engine} 
                            quiz_role={quiz_role} 
                            playerId={game_status[`${quiz_role}_player_id`]} 
                            answered={!!game_status[`${quiz_role}_answered`]}></PlayerPanel>

                        {/* {quiz_role.indexOf(game_role) !== 0 ? (
                            <button onClick={async () => {
                                console.log(`game_status[${quiz_role}_player_id] ${game_status[`${quiz_role}_player_id`]}`)
                                if (game_status[`${quiz_role}_player_id`]) {
                                    delete game_status[`${quiz_role}_player_id`];

                                    setState({});
                                }
                                else {
                                    const new_player_id = shortid.generate();
        
                                    const player_role = await quiz_engine.assignQuizRole(new_player_id);
                                }
                            }} style={{display: 'block'}}>{!game_status[`${quiz_role}_player_id`] ? 'Join' : 'Leave'} {_.upperFirst(quiz_role)}</button>
                        ) : null}

                        {game_status[`${quiz_role}_player_id`] ? (
                            <button onClick={async () => {
                                const answer = Math.floor(Math.random() * 4);
        
                                if (game_role === 'host') {
                                    if (quiz_role === 'host') {
                                        await quiz_engine.sendAnswer(answer, game_status[`${quiz_role}_player_id`]);
                                    }
                                    else {
                                        quiz_engine._onPlayerAnswer(answer, game_status[`${quiz_role}_player_id`]);
                                    }
                                }
                                else if (game_role === 'player') {
                                    // simulate receing
                                }
        
                                console.log('quiz_engine', quiz_engine)
        
                                // setState({});
                            }} style={{display: 'block'}}>{_.upperFirst(quiz_role)} Answer</button>
                        ) : null} */}
                    </div>
                )}
            </div>
        </div>
    )
}