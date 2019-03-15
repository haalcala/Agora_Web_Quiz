import React, {useState, useEffect} from 'react';

import _ from 'lodash';
import shortid from 'shortid';

import Util from '../utils/index';
const {QUIZ_ROLE_HOST} = Util;

export default props => {
    const [state, setState] = useState({next_question_answers: []});

    useEffect(() => {
        if (state.show_panel) {
            if (props.onOpen) props.onOpen();
        }
        else {
            if (props.onClose) props.onClose();
        } 
    }, [state.show_panel]);

    const handleSetQuestion = e => {
        setState({...state, question: e.target.value});

        console.log('state', state);
    };

    const handleSetQuestionOptions = async (index, value) => {
        // console.log('handleSetQuestionOptions:: index, value', index, value);

        state.next_question_answers[index] = value;

        setState({...state});
    };

    const handleSendNextQuestion = async () => {
        const {state, signal} = this;
        const {game_status} = state;

        await this.handleReceiveQuestionFromHost(state.next_question, [...state.next_question_answers]);

        game_status.questionId = shortid.generate();
        game_status.question = state.next_question;
        game_status.question_answers = [...state.next_question_answers];
        delete game_status.answer;

        _.times(3).map(i => {
            let player_key = 'player' + (i+1);

            delete game_status[`${player_key}_correct_answer`];
            delete game_status[`${player_key}_answered`];
            delete state[`${player_key}_answer`];
        });

        await this.setGameStatus();

        this.setState({selected_answer: null});
    };

    const handleSendQuestionAnswer = async () => {
        const {state} = this;

        if (!(state.selected_answer >= 0)) {
            return console.log('Please select answer');
        }

        state.game_status.answer = state.selected_answer;

        _.times(3).map(i => {
            let player_key = 'player' + i;

            state.game_status[`${player_key}_correct_answer`] = state[`${player_key}_answer`] >= 0 && state[`${player_key}_answer`] == state.selected_answer;
        });

        await this.setGameStatus();
    };


    return (
        <div className={"host-question-panel" + (state.show_panel ? " host-question-panel-expand scale-in-ver-top" : "")}>
            {!state.show_panel ?
                <div onClick={() => setState({...state, show_panel: true})}
                    style={{}}>
                    <img style={{width: '64px', height: '64px'}} src={require('./quotes-icon-png-11.png')} />
                    </div>
                : 
                <div style={{display: 'flex'}}>
                    <div style={{textAlign: 'left'}}>
                        Host question panel

                        <div style={{textAlign: "left"}}>
                            <div className='field'>
                                <div className='label'>
                                    Question:
                                </div>
                                <div className='control'>
                                    <textarea onChange={handleSetQuestion} style={{width: "-webkit-fill-available", height: "10em"}}>{state.question}</textarea>
                                </div>
                            </div>
                        </div>

                        <div className="field">
                            <label className="label">Answer Choices</label>
                            {_.times(4).map(id => {
                                return (
                                    <div key={id} className="control">
                                        Option {'ABCD'.charAt(id)}: <textarea key={id} onChange={e => handleSetQuestionOptions(id, e.target.value)} value={state.next_question_answers[id]} className="input" type="text" placeholder={`Input Question Answer Option ${'ABCD'.charAt(id)}`} />
                                    </div>
                                )
                            })}
                        </div>

                        <div className="field">
                            <div className="control">
                                <button style={{width: '100%'}} onClick={handleSendNextQuestion} className={"button " + ((state.quizIsOn && state.quizRole == QUIZ_ROLE_HOST) && ' is-link' || '')}>Send Question</button>
                            </div>
                        </div>
                        <div className="field">
                            <div className="control">
                                <button style={{width: '100%'}} onClick={handleSendQuestionAnswer} className={"button " + ((state.quizIsOn && state.quizRole == QUIZ_ROLE_HOST) && ' is-link' || '')}>Give Answer</button>
                            </div>
                        </div>
                        <div className='field'>
                            <div className="control">
                                <button style={{width: '100%'}} onClick={() => setState({...state, show_panel: false})} className={"button " + ((state.quizIsOn && state.quizRole == QUIZ_ROLE_HOST) && ' is-link' || '')}>Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
};