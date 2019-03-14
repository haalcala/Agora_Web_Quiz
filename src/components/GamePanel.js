import React, {useState, useEffect} from 'react';

import _ from 'lodash'
import shortid from 'shortid';

import PlayerPanel from './PlayerPanel';

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
    const [state, setState] = useState({});

    const {quiz_engine} = props;
    const {game_role, PLAYER_ID, game_status} = quiz_engine;

    console.log('[GamePanel.js]:: state', state, 'quiz_engine', quiz_engine);

    useEffect(() => {
        if (game_role === "host") {
            console.log(`[GamePanel.js]:: Setting up onPlayerJoin`);

            quiz_engine.onPlayerJoin = (playerId) => {
                console.log(`[GamePanel.js]:: onPlayerJoin`, playerId);

                setState({});
            };

            quiz_engine.onPlayerAnswer = (answer, playerId) => {
                console.log(`[GamePanel.js]:: onPlayerAnswer`, answer, playerId);

                setState({});
            };
        }
    }, [props.quiz_engine]);


    return (
        <div style={{display: "flex"}}>
            <div>{_.upperFirst(game_role)} <div style={{display: 'block'}}/> PLAYER_ID {PLAYER_ID}</div>
            {['host', 'player1', 'player2', 'player3'].map(quiz_role =>
                <div key={quiz_role} style={{margin: "auto", border: '1px dashed green', marginTop: '0px'}}>
                    <PlayerPanel 
                        my_answer={quiz_engine[`${quiz_role}_answer`]}
                        quiz_engine={quiz_engine} 
                        quiz_role={quiz_role} 
                        playerId={game_status[`${quiz_role}_player_id`]} 
                        answered={!!game_status[`${quiz_role}_answered`]}></PlayerPanel>

                    {quiz_role.indexOf(game_role) !== 0 ? (
                        <button onClick={async () => {
                            console.log(`game_status[${quiz_role}_player_id] ${game_status[`${quiz_role}_player_id`]}`)
                            if (game_status[`${quiz_role}_player_id`]) {
                                delete game_status[`${quiz_role}_player_id`];
                            }
                            else {
                                const new_player_id = shortid.generate();
    
                                const player_role = await quiz_engine.assignQuizRole(new_player_id);
                            }
                        }} style={{display: 'block'}}>{!game_status[`${quiz_role}_player_id`] ? 'Join' : 'Leave'} {_.upperFirst(quiz_role)}</button>
                    ) : null}

                    <button onClick={async () => {
                        if (game_role === 'host') {
                            const answer = Math.floor(Math.random() * 4);

                            await quiz_engine.sendAnswer(answer, game_status[`${quiz_role}_player_id`]);

                            setImmediate(() => {
                                if (this.onPlayerAnswer) {
                                    this.onPlayerAnswer(answer, game_status[`${quiz_role}_player_id`]);
                                }
                            });    
                        }
                        else {
                            quiz_engine.game_status[`${quiz_role}_answered`] = !state[`${quiz_role}_answered`];
                            quiz_engine.my_answer = quiz_engine[`${quiz_role}_answer`] = Math.floor(Math.random() * 4);
                        }

                        console.log('quiz_engine', quiz_engine)

                        setState({});
                    }} style={{display: 'block'}}>{_.upperFirst(quiz_role)} Answer</button>
                </div>
            )}
        </div>
    )
}