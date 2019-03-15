import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

import _ from 'lodash'
import shortid from 'shortid';

// import { Alert } from 'react-bootstrap'
// import {Alert} from 'reactstrap';
// import './node_modules/bootstrap/css/'
import 'bootstrap/dist/css/bootstrap.min.css';

import { videoProfileList, audioProfileList, audioScenarioList, APP_ID, SHARE_ID } from './utils/settings'
import base64Encode from './utils/base64'
import GamePanel from './components/GamePanel'

import MenuPanel from './components/MenuPanel' 

import QuizEngine from './components/QuizEngine'

import ModalExample from './components/ModalExample'

import {Container, Row, Col} from 'reactstrap'

import Util from './utils/index';
const {QUIZ_STATUS_TEXT, QUIZ_ROLE_HOST, QUIZ_ROLE_PLAYER, QUIZ_ROLE_AUDIENCE, GAME_STATUS_INITIALISED, GAME_STATUS_WAIT_FOR_PLAYERS, GAME_STATUS_STARTED, GAME_STATUS_ENDED} = Util;

console.log('App.js:: GAME_STATUS_WAIT_FOR_PLAYERS', GAME_STATUS_WAIT_FOR_PLAYERS, 'GAME_STATUS_STARTED', GAME_STATUS_STARTED, 'GAME_STATUS_ENDED', GAME_STATUS_ENDED);

export default (props) => {
	const [state, setState] = useState({
		showModal: false,
		// quiz_engine : new QuizEngine('host')
	});

	const {quiz_engine, game_role} = state;

	useEffect(() => {
		console.log("[App.js] useEffect::");

		if (state.game_role) {
			setTimeout(() => {
				const quiz_engine = new QuizEngine(state.game_role);

				setState({...state, quiz_engine});
			}, 2000);
		}
	}, [state.game_role]);

	// setTimeout(() => {
	// 	const quiz_engine = new QuizEngine('host');

	// 	setState({...state, quiz_engine});
	// }, 1000);

	return (
		<div className="App">
			{/* <div style={{position: "absolute", top: 0, left: 0}}>{_.upperFirst(state.game_role)}</div> */}

			{/* <button onClick={() => {
				this.setState({showModal: !state.showModal})
			}}>Show modal</button>

			{state.showModal ? 
			<ModalExample modal={state.showModal} buttonLabel="Show!"></ModalExample> : ""} */}

			{/* <Container style={{border: "1px solid red", width: "100%", display: "block"}}>
				<Row style={{border: "1px solid green", width: "100%",}}>
					<Col>.col</Col>
					<Col>.col</Col>
				</Row>
			</Container> */}


			<Container style={{height: '100%'}}>	
				{quiz_engine ? 
					<GamePanel quiz_engine={quiz_engine}/>
					: 
					<div className={game_role ? 'bounce-out-top' : 'slide-in-elliptic-top-fwd'} style={{height: '40em', _border: '1px solid red', display:'flex', flexDirection:'column', justifyContent:'space-around'}}>
						<div className="main-menu-item" onClick={() => setState({...state, game_role: 'host'})}>Host</div>
						<div className="main-menu-item" onClick={() => setState({...state, game_role: 'player'})}>Participate</div>
						<div className="main-menu-item" onClick={() => setState({...state, game_role: 'audience'})}>Watch</div>
					</div>
				}
			</Container>

			{quiz_engine ? 
				<MenuPanel quiz_engine={quiz_engine} />
				: null}
		</div>
	);
}
