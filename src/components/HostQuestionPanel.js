import React, {useState, useEffect} from 'react';

import _ from 'lodash';
import shortid from 'shortid';

import Util from '../utils/index';
const {QUIZ_ROLE_HOST} = Util;

export default props => {
    const [state, setState] = useState({next_question_answers: []});

    const {quiz_engine} = props;

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
        const {game_status} = state;

        await quiz_engine.sendQuestion(state.question, [...state.next_question_answers]);
    };

    const handleSendQuestionAnswer = async () => {
        if (!(state.selected_answer >= 0)) {
            return console.log('Please select answer');
        }

        await quiz_engine.sendAnswer(state.selected_answer);
    };

    const clearOptions = () => {
        const new_state = {...state};

        ['selected_answer', 'question'].map(key => delete new_state[key]);

        setState(new_state);
    }

    const handleSelectCorrectAnswer = (answer) => {
        console.log('handleSelectCorrectAnswer:: answer', answer);

        setState({...state, selected_answer: answer});
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
                                    <textarea onChange={handleSetQuestion} style={{width: "-webkit-fill-available", height: "10em"}} value={state.question}></textarea>
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
                            <label className="label">Correct Answer:</label>
                            <div className="control" style={{display: 'flex'}}>
                                {_.times(4).map(x => 
                                    <div key={x} className={'host-answer-item' + (state.selected_answer >= 0 && state.selected_answer === x ? ' host-answer-item-selected' : '')} onClick={handleSelectCorrectAnswer.bind(null, x)}>{'ABCD'.charAt(x)}</div>
                                )}
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