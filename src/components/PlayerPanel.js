import React, {useState, useEffect} from 'react'

import {Col} from 'reactstrap';

import _ from 'lodash';

export default function PlayerPanel(props) { 
    const {quiz_role, quiz_engine, answered, playerId, my_answer, videoStreamId} = props;
    const {game_status} = quiz_engine;

    const [state, setState] = useState({joined: false});
    
    console.log(`[${quiz_role}]:: `, 'PlayerPanel:: props', props, 'state', state);

    // console.log(`[${quiz_role}]:: `, 'state.joined', state.joined);

    let just_joined = false;

    if (state.playerId != playerId) {
        state.playerId = playerId;

        // if (state.joined) {
            just_joined = true;
        // }
    }

    let just_answered;

    if (state.my_answer != my_answer) {
        state.my_answer = my_answer;
        
        just_answered = !state.just_answered;
    }

    // console.log(`[${quiz_role}]:: `, 'just_joined', just_joined, 'just_answered', just_answered);

    // console.log(`[${quiz_role}]:: `, 'state, setState', state, setState);
    // console.log(`[${quiz_role}]:: `, 'state2, setState2', state2, setState2);

    useEffect(() => {
        // console.log(`[${quiz_role}]:: `, 'useEffect:: 111 props', props, 'just_joined', just_joined);
        setTimeout(() => {
            let dom = document.querySelector(`#video-${quiz_role}`);
            
            console.log(`[${quiz_role}]:: `, 'useEffect:: dom', dom);
    
            if (videoStreamId) {
                if (videoStreamId === quiz_engine.video_stream_id) {
                    quiz_engine.setupLocalVideo(dom);
                }
                else {
                    quiz_engine.subscribe(videoStreamId, dom);
                }
            }
            
            // console.log(`[${quiz_role}]:: `, 'useEffect:: 222 props', props, 'just_joined', just_joined);
            setState({...state})
        }, 600);
    }, [playerId, my_answer, videoStreamId]);

    // console.log(`[${quiz_role}]:: `, 'player label classes', ['player-label', just_joined ? 'player_joined' : ''].join(' '));
    // console.log(`[${quiz_role}]:: `, 'player_answer_tab classes', ['player_answer_tab', answered ? 'player_new_answer' : '', just_answered ? 'rotate-scale-up' : ' '].join(' '));
    
    
    // console.log(`[${quiz_role}]:: `, 'quiz_role.indexOf(\'host\')', quiz_role.indexOf('host'));
    // console.log(`[${quiz_role}]:: `, 'quiz_role.indexOf(\'player\')', quiz_role.indexOf('player'));
    // console.log(`[${quiz_role}]:: `, 'quiz_role === quiz_engine.game_role', quiz_role === quiz_engine.game_role);
    // console.log(`[${quiz_role}]:: `, 'answered', answered);
    // console.log(`[${quiz_role}]:: `, 'quiz_role', quiz_role);

    return (
        <div className={["player-icon", playerId ? 'shadow-drop-center' : ''].join(' ')} style={{_border: "1px dashed green"}}>
            <div>
                <div className="window-item" id={"video-" + quiz_role}>
                    <img src={require("./player.jpg")} 
                        style={{display: (videoStreamId ? 'none' : 'block'), width: "-webkit-fill-available", paddingTop: "1em"}}/>
                </div>
            </div>
            <div className={['player-label', just_joined ? 'player_joined' : ''].join(' ')}>
                {playerId && `${_.upperFirst(quiz_role)} ${playerId == quiz_engine.PLAYER_ID && '(ME)' || ''}` || "..."}
            </div>
            <div className={['player_answer_tab', answered ? 'player_new_answer' : '', just_answered ? 'rotate-scale-up' : ' '].join(' ')} style={{}}>
                {answered && (
                    (quiz_engine.game_role === 'host' 
                        || (quiz_role.indexOf('player') === 0 && quiz_role === quiz_engine.game_role)
                    ) ? 'ABCD'.charAt(my_answer) 
                    : 
                        (game_status.answer >= 0 ?(game_status[`${quiz_role}_answer_correct`] ? '👍🏻' : '👎🏻') : '!')
                    )
                || null}
            </div>
        </div>
    );
}