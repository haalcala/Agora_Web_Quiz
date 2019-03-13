import React, {useState, useEffect} from 'react';

import _ from 'lodash'
import shortid from 'shortid';

import PlayerPanel from './PlayerPanel';

export default function(props) {
    const [state, setState] = useState({game_status: {}});

    const {game_role} = props;

    console.log('GamePanel.js:: state', state);

    return (
        <div style={{display: "flex"}}>
            <div>{game_role}</div>
            {['host', 'player1', 'player2', 'player3'].map(quiz_role =>
                <div key={quiz_role} style={{margin: "auto", border: '1px dashed green'}}>
                    <PlayerPanel 
                        my_answer={state[`${quiz_role}_answer`]}
                        game_status={state.game_status} 
                        quiz_role={quiz_role} 
                        playerId={state[`${quiz_role}_player_id`]} 
                        answered={!!state.game_status[`${quiz_role}_answered`]}></PlayerPanel>

                    <button onClick={() => {
                        const new_state = {};

                        new_state[`${quiz_role}_player_id`] = !!state[`${quiz_role}_player_id`] ? null : shortid.generate();

                        setState({...state, ...new_state});
                    }} style={{display: 'block'}}>{!state[`${quiz_role}_player_id`] ? 'Join' : 'Leave'} {_.upperFirst(quiz_role)}</button>

                    <button onClick={() => {
                        const new_state = {game_status: {...state.game_status}};

                        if (quiz_role === 'host') {
                            if (typeof(state.game_status.answer) === 'undefined') {
                                new_state.game_status[`answer`] = Math.floor(Math.random() * 4);
                            }
                            else {
                                delete new_state.game_status.answer;
                            }
                        }
                        else {
                            new_state.game_status[`${quiz_role}_answered`] = !state[`${quiz_role}_answered`];
                            new_state.my_answer = new_state[`${quiz_role}_answer`] = Math.floor(Math.random() * 4);
                        }

                        console.log('new_state', new_state)

                        setState({...state, ...new_state});
                    }} style={{display: 'block'}}>{_.upperFirst(quiz_role)} Answer</button>
                </div>
            )}
        </div>
    )
}