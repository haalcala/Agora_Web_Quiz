import React, {useState, useEffect} from 'react';

import _ from 'lodash';

export default props => {
	const [state, setState] = useState({
		currentWindowId: -1,
		question: "",
		options : [],
    });
    
    const {game_status, game_role} = props;

	const selectAnswer = async (answer) => {
        if (game_role !== 'player') {
            return;
        }

        if (props.answer_from_host) {
            return;
        }

        console.log(answer);
        
        props.onSelectAnswer(answer)
	}

    console.log('QuestionPanel.render::');

    const {answer_from_host, question, question_answers, selected_answer} = game_status;

    return (
        // <div className="card" style={{ border: "1px solid red", width: "100%", padding: "1em"}}>
        //     <div className="card" style={{border: "1px solid green", height: "-webkit-fill-available"}}>
        //         <div className="card" style={{width: "50em", margin: "auto", display: "block"}}>
        //             <h1>Question:</h1>
        //             <h1 style={{textAlign: "center"}}>
        //                 {question}
        //             </h1>
        //             {answer_from_host ? (
        //                 <div>
        //                     <h1>Answer:</h1>
        //                     <h1 style={{textAlign: "left", textDecoration: "underline", marginLeft: "3em"}}>
        //                         {`${'ABCD'.charAt(answer_from_host)}. ${question_answers[answer_from_host]}`}
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
        //                     <AnswerItem key={i} selected_answer={selected_answer} answer_from_host={answer_from_host} i={i} option={question_answers[i]} selectAnswer={this.selectAnswer}></AnswerItem>
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
                    {answer_from_host ? (
                        <div>
                            <h1>Answer:</h1>
                            <h1 style={{textAlign: "left", textDecoration: "underline", marginLeft: "3em"}}>
                                {`${'ABCD'.charAt(answer_from_host)}. ${question_answers && question_answers[answer_from_host]}`}
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
                            isSelectable={game_role.indexOf('player')===0} 
                            key={i} 
                            selected_answer={selected_answer} 
                            answer_from_host={answer_from_host} 
                            i={i} 
                            option={question_answers && question_answers[i]} 
                            selectAnswer={selectAnswer.bind(null, i)} />
                        )
                })}
                </div>
            </div>
        </div>
    );
}

function AnswerItem(props) {
    const {isSelectable, selected_answer, answer_from_host, i, option, selectAnswer} = props;

    // console.log("selected_answer", selected_answer, "answer_from_host", answer_from_host, "i", i, "option", option, "selectAnswer", selectAnswer);

    const classes = ['answer-item'];

    if (isSelectable) {
        classes.push('is-link')
    }

    return (
        <div className={classes.concat([selected_answer == i ? " selected": ""]).join(' ')} onClick={() => selectAnswer(i)} >
            <div style={{display: "inline", width: "1em"}}>
                {answer_from_host ? (selected_answer == i ? (answer_from_host == selected_answer ? "✔︎" : "✘") : " ") : " "} 
            </div>
            <div key={i} style={{display: "inline", marginLeft: ".2em"}}>
                {`${'ABCD'.charAt(i)}.  ${option}`}
            </div>
        </div>
    );
}