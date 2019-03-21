import React, {useState, useEffect} from 'react';

import _ from 'lodash'
import shortid from 'shortid';

import PlayerPanel from './PlayerPanel';

import QuestionPanel from './QuestionPanel';

export default function(props) {
    const [state, setState] = useState({_GAME_ID: 'YOQs1FCsfE'});

    const {quiz_engine} = props;
    const {game_role, quiz_role, PLAYER_ID, game_status} = quiz_engine;

    console.log('[GamePanel.js]:: state', state, 'quiz_engine', quiz_engine);

    useEffect(() => {
        (async () => {
            quiz_engine.onGameStatusUpdate = () => {
                console.log(`[GamePanel.js]:: onGameStatusUpdate`);

                if (state.current_questionId != game_status.questionId) {
                    delete state.answer;
                }

                setState({...state});
            };

            quiz_engine.onPlayerJoin = (playerId) => {
                console.log(`[GamePanel.js]:: onPlayerJoin`, playerId);

                setState({...state});
            };
    
            if (game_role === "host") {
                console.log(`[GamePanel.js]:: Setting up onPlayerJoin`);
    
                quiz_engine.onPlayerAnswer = (answer, playerId) => {
                    console.log(`[GamePanel.js]:: onPlayerAnswer`, answer, playerId);
    
                    setState({...state});
                };
    
                await quiz_engine.createGame();
            }
        })();
    }, [props.quiz_engine]);

    const joinGame = async () => {
        if (state._GAME_ID) {
            state.GAME_ID = await quiz_engine.joinGame(state._GAME_ID);

            console.log(`[GamePanel.js]:: joinGame: Successfully joined with GAME_ID`, state.GAME_ID);

            if (quiz_engine.game_role === 'player') {
                await quiz_engine.requestAssignQuizRole();
            }

            // setState({...state});
        }
    };

    const onSelectAnswer = async answer => {
        console.log('[GamePanel.js]:: onSelectAnswer: answer', answer);

        setState({...state, answer})

        await quiz_engine.sendAnswer(answer);
    };

    console.log('[GamePanel.js]:: state', state);

    return (
        <div className='game-panel slide-in-top'>
            <div style={{flexGrow : 1, display: 'flex', border: '1px solid red', height: '100%'}}>
                {/* <div style={{border: '1px solid green', flexGrow: 1, margin: 'auto'}}>1</div> */}
                {quiz_engine.GAME_ID ?
                    <QuestionPanel game_role={game_role} quiz_role={quiz_role} game_status={game_status} onSelectAnswer={onSelectAnswer}/>
                :
                    <div className='slide-in-top' style={{margin: 'auto', _animationDelay: '1s'}}>
                        <div>
                            Enter Game ID:
                        </div>
                        <div>
                            <input type='text' onChange={e => setState({...state, _GAME_ID: e.target.value})} defaultValue={state._GAME_ID}></input>
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
                            my_answer={quiz_engine.game_role === 'host' ? quiz_engine[`${quiz_role}_answer`] : (quiz_role === quiz_engine.quiz_role && quiz_engine[`${quiz_role}_answer`])}
                            quiz_engine={quiz_engine} 
                            quiz_role={quiz_role} 
                            playerId={game_status[`${quiz_role}_player_id`]} 
                            videoStreamId={game_status[`${quiz_role}_video_stream_id`]} 
                            answered={!!game_status[`${quiz_role}_answered`]}></PlayerPanel>
                    </div>
                )}
            </div>
        </div>
    )
}