import React, { useState } from 'react';
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
import SignalingClient from './lib/SignalingClient';

import GameContext from './components/GameContext'
import ModalExample from './components/ModalExample'

import { watchFile } from 'fs';

import {Container, Row, Col} from 'reactstrap'

import Util from './utils/index';
const {QUIZ_STATUS_TEXT, QUIZ_ROLE_HOST, QUIZ_ROLE_PLAYER, QUIZ_ROLE_AUDIENCE, GAME_STATUS_INITIALISED, GAME_STATUS_WAIT_FOR_PLAYERS, GAME_STATUS_STARTED, GAME_STATUS_ENDED} = Util;

const PLAYER_ID = shortid.generate();

let GAME_ID = 'Wbo-OUgMQ';

console.log('App.js:: PLAYER_ID', PLAYER_ID, 'GAME_STATUS_WAIT_FOR_PLAYERS', GAME_STATUS_WAIT_FOR_PLAYERS, 'GAME_STATUS_STARTED', GAME_STATUS_STARTED, 'GAME_STATUS_ENDED', GAME_STATUS_ENDED);

let host_game_context = new GameContext('host');

const game_contexts = [
	host_game_context, 
	// new GameContext('player'), 
	// new GameContext('audience')
];

export default (props) => {
	const [state, setState] = useState({
		showModal: false,
		game_role: "host",
	});

	(async () => {
		console.log('aaaa', new Date())

		await new Promise(resolve => {
			setTimeout(resolve, 1000);
		})

		console.log('test', new Date());
	})();

	const handleSelectAnswer = (answer) => {
		
	}

	const handleSendQuestion = (answer) => {

	}

	const handleSendAnswer = (answer) => {

	}

	if (host_game_context) {
		host_game_context.onPlayerJoin((...args) => {
			console.log(`[App.js]:: onPlayerJoin`, ...args);
		});
	}

	return (
		<div className="App">
			{/* <div style={{position: "absolute", top: 0, left: 0}}>{_.upperFirst(state.game_role)}</div> */}

			<button onClick={() => {
				this.setState({showModal: !state.showModal})
			}}>Show modal</button>

			{state.showModal ? 
			<ModalExample modal={state.showModal} buttonLabel="Show!"></ModalExample> : ""}

			<Container style={{border: "1px solid red", width: "100%", display: "block"}}>
				<Row style={{border: "1px solid green", width: "100%",}}>
					<Col>.col</Col>
					<Col>.col</Col>
				</Row>
			</Container>

			<Container>	
				{game_contexts.map(game_context => (
					<GamePanel key={shortid.generate()} game_context={game_context}/>
				))}
			</Container>
		</div>
	);
}
