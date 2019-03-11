import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import _ from 'lodash'

// import { Alert } from 'react-bootstrap'
// import {Alert} from 'reactstrap';
// import './node_modules/bootstrap/css/'
import 'bootstrap/dist/css/bootstrap.min.css';

import { videoProfileList, audioProfileList, audioScenarioList, APP_ID, SHARE_ID } from './utils/settings'
import base64Encode from './utils/base64'
import QuestionPanel from './components/QuestionPanel'
import SignalingClient from './lib/SignalingClient';

import ModalExample from './components/ModalExample'

import PlayerPanel from './components/PlayerPanel';

import shortid from 'shortid';
import { watchFile } from 'fs';

import {Container, Row, Col} from 'reactstrap'

const [QUIZ_ROLE_HOST, QUIZ_ROLE_PLAYER, QUIZ_ROLE_AUDIENCE, PLAYER_ID] = ['host', 'player', 'audience', shortid.generate()];

const [GAME_STATUS_INITIALISED, GAME_STATUS_WAIT_FOR_PLAYERS, GAME_STATUS_STARTED, GAME_STATUS_ENDED] = _.times(4);

let GAME_ID = 'Wbo-OUgMQ';

const QUIZ_STATUS_TEXT = ["Game Initialised", "Wating for players", "Quiz Started", 'Quiz Ended'];


console.log('PLAYER_ID', PLAYER_ID, 'GAME_STATUS_WAIT_FOR_PLAYERS', GAME_STATUS_WAIT_FOR_PLAYERS, 'GAME_STATUS_STARTED', GAME_STATUS_STARTED, 'GAME_STATUS_ENDED', GAME_STATUS_ENDED);


class App extends Component {
	state = {
		showModal: false
	}

	render() {
		const { state } = this;

		(async () => {
			console.log('aaaa', new Date())

			await new Promise(resolve => {
				setTimeout(resolve, 1000);
			})

			console.log('test', new Date());
		})();

		return (
			<div className="App">
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

				<div style={{display: "flex"}}>
					{['host', 'player1', 'player2', 'player3'].map(game_role =>
						<div key={game_role} style={{margin: "auto"}}>
							<PlayerPanel game_role={game_role} playerId={state[`${game_role}_player_id`]}></PlayerPanel>
	
							<button onClick={() => {
								const new_state = {};

								new_state[`${game_role}_player_id`] = !!state[`${game_role}_player_id`] ? null : shortid.generate();

								this.setState(new_state);
							}}>Join {game_role}</button>
						</div>
					)}
				</div>
			</div>
		);
	}
}

export default App;
