import React, {useState, useEffect} from 'react'

import {Col} from 'reactstrap';

import _ from 'lodash';

export default function PlayerPanel(props) {
    console.log(`[${props.game_role}]:: `, 'PlayerPanel:: props', props);

    const {game_role} = props;

    const [state, setState] = useState({joined: false});
    const [state2, setState2] = useState({count: 0});

    console.log(`[${props.game_role}]:: `, 'state.joined', state.joined, 'props.game_role', props.game_role, );

    let just_joined = false;

    if (!!state.joined != !!props.playerId) {
        state.joined = !!props.playerId;

        // if (state.joined) {
            just_joined = true;
        // }
    }

    let just_answered;

    if (!!state.answered != !!props.my_answer) {
        state.answered = !!props.my_answer;
        
        just_answered = !state.just_answered;
    }

    console.log(`[${props.game_role}]:: `, 'just_joined', just_joined, 'just_answered', just_answered);

    // console.log(`[${props.game_role}]:: `, 'state, setState', state, setState);
    // console.log(`[${props.game_role}]:: `, 'state2, setState2', state2, setState2);

    useEffect(() => {
        
        setTimeout(() => {
            console.log(`[${props.game_role}]:: `, 'useEffect:: props', props);
            console.log(`[${props.game_role}]:: `, 'useEffect:: just_joined', just_joined);
            setState({...state})
        }, 600);
    }, [props.playerId + props.my_answer]);

    const label_style = {_border: "1px solid red"};

    return (
        <div className={["player-icon", props.playerId ? 'shadow-drop-center' : ''].join(' ')} style={{_border: "1px dashed green"}}>
            <div className="window-item" id={"video-" + game_role}>
                <img src={require("./player.jpg")} 
                    style={{display: "block", width: "-webkit-fill-available", paddingTop: "1em"}}/>
            </div>
            <div className={['player-label', just_joined ? 'player_joined' : ''].join(' ')} style={label_style}>{props.playerId && _.upperFirst(props.game_role) || "..."}</div>
            <div className={['player_answer_tab', !!props.answered ? 'player_new_answer' : '', just_answered ? 'rotate-scale-up' : ' '].join(' ')} style={{}}>
                {(props.answered && 'ABCD'.charAt(props.my_answer)) || null}
            </div>
        </div>
    );
}