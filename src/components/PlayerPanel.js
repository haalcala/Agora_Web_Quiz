import React, {useState, useEffect} from 'react'

import {Col} from 'reactstrap';

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

    console.log(`[${props.game_role}]:: `, 'just_joined', just_joined);

    // console.log(`[${props.game_role}]:: `, 'state, setState', state, setState);
    // console.log(`[${props.game_role}]:: `, 'state2, setState2', state2, setState2);

    useEffect(() => {
        console.log(`[${props.game_role}]:: `, 'useEffect:: props', props);
    }, ['playerId']);

    const label_style = {border: "1px solid red"};

    if (just_joined) {
        label_style.animationName = "player_joined";
        label_style.animationDuration = "1s";
    }

    return (
        <div className="player-icon" style={{border: "1px dashed green"}}>
            <div className="window-item" id={"video-" + game_role}>
                <img src={require("./player.jpg")} 
                    style={{display: "block", width: "-webkit-fill-available", paddingTop: "1em"}}/>
            </div>
            <div className="player-label" style={label_style}>{props.playerId && props.game_role || "..."}</div>
        </div>
    );
}