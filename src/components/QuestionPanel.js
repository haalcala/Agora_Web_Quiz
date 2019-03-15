import React, {useState, useEffect} from 'react';

import _ from 'lodash';

export default props => {
	const [state, setState] = useState({
		currentWindowId: -1,
		question: "",
		options : [],
    });
    
    const {game_status} = props;

	const selectAnswer = async (answer) => {
        if (props.answer_from_host) {
            return;
        }

        console.log(answer);
        
        props.onSelectAnswer(answer)
	}

    console.log('QuestionPanel.render::');

    const {answer_from_host, question, question_answers, selected_answer} = props;

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
        <div style={{ _border: "1px dashed red", width: "100%", padding: "1em", display: 'flex', flexDirection: 'column'}}>
            <div style={{border: '1px solid green', height: '50%', marginBottom: '1em'}}>
                <div className="" style={{width: "50em", margin: "auto", display: "block"}}>
                        <h1>Question:</h1>
                        <h1 style={{textAlign: "center"}}>
                            {question}
                        </h1>
                        {answer_from_host ? (
                            <div>
                                <h1>Answer:</h1>
                                <h1 style={{textAlign: "left", textDecoration: "underline", marginLeft: "3em"}}>
                                    {`${'ABCD'.charAt(answer_from_host)}. ${question_answers[answer_from_host]}`}
                                </h1>
                            </div>
                        ) : ""}
                    </div>
            </div>
            <div style={{border: '1px solid green', height: '50%'}}>
                <div>
                {_.times(4).map(i => {
                    return (<AnswerItem key={i} selected_answer={selected_answer} answer_from_host={answer_from_host} i={i} option={question_answers[i]} selectAnswer={selectAnswer}></AnswerItem>)
                })}
                </div>
            </div>
        </div>
    );
}

function AnswerItem(props) {
    const {selected_answer, answer_from_host, i, option, selectAnswer} = props;

    // console.log("selected_answer", selected_answer, "answer_from_host", answer_from_host, "i", i, "option", option, "selectAnswer", selectAnswer);

    return (
        <div className={"column answer-item is-link" + (selected_answer == i ? " selected": "")} onClick={() => selectAnswer(i)} >
            <div style={{display: "inline", width: "1em"}}>
                {answer_from_host ? (selected_answer == i ? (answer_from_host == selected_answer ? "✔︎" : "✘") : " ") : " "} 
            </div>
            <div key={i} style={{display: "inline", marginLeft: ".2em"}}>
                {`${'ABCD'.charAt(i)}.  ${option}`}
            </div>
        </div>
    );
}