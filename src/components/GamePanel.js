import React, {useState, useEffect} from 'react';

import _ from 'lodash'
import shortid from 'shortid';

import PlayerPanel from './PlayerPanel';

export default function(props) {
    const [state, setState] = useState({game_status: {}});

    console.log('GamePanel.js:: state', state);

    return (
        <div style={{display: "flex"}}>
            {['host', 'player1', 'player2', 'player3'].map(game_role =>
                <div key={game_role} style={{margin: "auto"}}>
                    <PlayerPanel game_status={state.game_status} game_role={game_role} playerId={state[`${game_role}_player_id`]} answered={!!state.game_status[`${game_role}_answered`]}></PlayerPanel>

                    <button onClick={() => {
                        const new_state = {};

                        new_state[`${game_role}_player_id`] = !!state[`${game_role}_player_id`] ? null : shortid.generate();

                        setState({...state, ...new_state});
                    }} style={{display: 'block'}}>{!state[`${game_role}_player_id`] ? 'Join' : 'Leave'} {_.upperFirst(game_role)}</button>

                    <button onClick={() => {
                        const new_state = {game_status: {...state.game_status}};

                        if (game_role === 'host') {
                            new_state.game_status[`answer`] = Math.floor(Math.random() * 4);
                        }
                        else {
                            new_state[`${game_role}_answered`] = !state[`${game_role}_answered`];
                            new_state.my_answer = new_state.game_status[`${game_role}_answered`] = Math.floor(Math.random() * 4);
                        }

                        console.log('new_state', new_state)

                        setState({...state, ...new_state});
                    }} style={{display: 'block'}}>{_.upperFirst(game_role)} Answer</button>
                </div>
            )}
        </div>
    )
}