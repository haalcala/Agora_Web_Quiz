import React, {useState, useEffect} from 'react';

import _ from 'lodash';

export default props => {
    const {game_status, game_role} = props;

	const [state, setState] = useState({
		currentWindowId: -1,
		question: "",
		options : [],
    });
    
	const handleSelectAnswer = async (answer) => {
        console.log('QuestionPanel.handleSelectAnswer:: answer', answer);

        if (game_role.indexOf('player') !== 0) {
            return;
        }

        if (props.answer) {
            return;
        }

        console.log(answer);

        setState({...state, selected_answer: answer});
        
        props.onSelectAnswer(answer);
	}

    console.log('QuestionPanel.render:: game_status', game_status);
    console.log('QuestionPanel.render:: state', state);

    const { answer, question, question_answers } = game_status;

    if (game_role === 'host') {
        state.selected_answer = game_status.answer;
    }

    const { selected_answer } = state;

    return (
        // <div className="card" style={{ border: "1px solid red", width: "100%", padding: "1em"}}>
        //     <div className="card" style={{border: "1px solid green", height: "-webkit-fill-available"}}>
        //         <div className="card" style={{width: "50em", margin: "auto", display: "block"}}>
        //             <h1>Question:</h1>
        //             <h1 style={{textAlign: "center"}}>
        //                 {question}
        //             </h1>
        //             {answer ? (
        //                 <div>
        //                     <h1>Answer:</h1>
        //                     <h1 style={{textAlign: "left", textDecoration: "underline", marginLeft: "3em"}}>
        //                         {`${'ABCD'.charAt(answer)}. ${question_answers[answer]}`}
        //                     </h1>
        //                 </div>
        //             ) : ""}
        //         </div>
        //     </div>
        //     <div style={{visibility: "hidden"}}>1</div>
        //     <div className="card" style={{border: "1px solid green", display: "block", columnGap: ".3em"}}>
        //         <div style={{margin: "1em"}}>
        //             {_.times(4).map(i => {
        //                 return (
        //                     <AnswerItem key={i} selected_answer={selected_answer} answer={answer} i={i} option={question_answers[i]} selectAnswer={this.selectAnswer}></AnswerItem>
        //                 );
        //             })}
        //         </div>
        //     </div>
        // </div>
        <div style={{ _border: "1px dashed red", width: "100%", padding: "1em", display: (game_status.question ? 'flex' : 'none'), flexDirection: 'column'}}>
            <div style={{_border: '1px solid green', height: '50%', marginBottom: '1em'}}>
                <div className="" style={{width: "50em", margin: "auto", display: (game_status.question ? 'block' : 'none')}}>
                    <h1>Question:</h1>
                    <h1 style={{textAlign: "center"}}>
                        {question}
                    </h1>
                    {answer >= 0 ? (
                        <div>
                            <h1>Answer:</h1>
                            <h1 style={{textAlign: "left", textDecoration: "underline", marginLeft: "3em"}}>
                                {`${'ABCD'.charAt(answer)}. ${question_answers && question_answers[answer]}`}
                            </h1>
                        </div>
                    ) : ""}
                </div>
            </div>
            <div style={{_border: '1px solid green', height: '50%'}}>
                <div>
                {_.times(4).map(i => {
                    return (
                        <AnswerItem 
                            key={i} 
                            isSelectable={game_role.indexOf('player')===0} 
                            selected_answer={selected_answer} 
                            answer={answer} 
                            i={i} 
                            option={question_answers && question_answers[i]} 
                            selectAnswer={handleSelectAnswer.bind(null, i)} />
                        )
                })}
                </div>
            </div>
        </div>
    );
}

function AnswerItem(props) {
    const {isSelectable, selected_answer, answer, i, option} = props;

    console.log('AnswerItem:: props', props)

    // console.log("selected_answer", selected_answer, "answer", answer, "i", i, "option", option, "selectAnswer", selectAnswer);

    const classes = ['answer-item'];

    if (isSelectable) {
        classes.push('answer-item-selectable')
    }

    return (
        <div className={classes.concat([selected_answer == i ? " selected": ""]).join(' ')} 
            onClick={props.selectAnswer} 
            >
            <div style={{display: "inline", width: "1em"}}>
                {answer >= 0 ? (selected_answer == i ? (answer == selected_answer ? "✔︎" : "✘") : " ") : " "} 
            </div>
            <div style={{display: "inline", marginLeft: ".2em"}}>
                {`${'ABCD'.charAt(i)}.  ${option}`}
            </div>
        </div>
    );
}