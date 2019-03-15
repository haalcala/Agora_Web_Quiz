
import _ from 'lodash';
import shortid from 'shortid';

import SignalingClient from '../lib/SignalingClient';

import Util from '../utils/index';

import {APP_ID} from '../utils/settings';

const {
    PLAYER_KEYS, 
    QUIZ_STATUS_TEXT, 
    QUIZ_ROLE_HOST, 
    QUIZ_ROLE_PLAYER, 
    QUIZ_ROLE_AUDIENCE, 
    GAME_STATUS_INITIALISED, 
    GAME_STATUS_WAIT_FOR_PLAYERS, 
    GAME_STATUS_STARTED, 
    GAME_STATUS_ENDED} = Util;

export default class QuizEngine {
    PLAYER_ID = shortid.generate();

    GAME_ID;

    game_status = {};

    rtcEngine;

    signal;

    state = {};

    constructor(game_role) {
        const {game_status} = this;

        console.log('[QuizEngine.js|constructor]('+game_role+'):: ----------------------------------------------------------------');
        
        this.game_role =  game_role;
        
        if (game_role === QUIZ_ROLE_HOST) {
            game_status.GAME_ID = this.GAME_ID = shortid.generate();
            game_status.host_player_id = this.PLAYER_ID;
        }
        else if ([QUIZ_ROLE_PLAYER, QUIZ_ROLE_AUDIENCE].indexOf(game_role) > -1) {
        } 
        else {
            throw new Error(`Invalid game role \'${game_role}\'`);
        }

        console.log('[QuizEngine.js|constructor]('+game_role+'):: game_status', game_status);

        this.signal = new SignalingClient(APP_ID);

        console.log('this.signal', this.signal);
    }

    /**
     * Only applies to 'host'
     */
    onPlayerJoin = async () => {};

    /**
     * Only applies to 'host'
     */
    onPlayerLeave = async () => {};
    
    /**
     * Only applies to 'host'
     */
    onPlayerAnswer = async () => {};

    /**
     * Only applies to 'player' and 'audience'.
     * 
     * Called when 'host' updates the 'game_status' object when a player, joins/leaves/answer
     */
    onGameStatusUpdate = async () => {};

    /**
     * Only applies to 'host'
     */
	setGameStatus = async () => {
		const { game_status, signal } = this;
        
        game_status.requestId = shortid.generate();

		let result = await this.setChannelAttribute('game_status', JSON.stringify(game_status));

		console.log('setGameStatus:: 2222 result', result);
	};

    /**
     * Only applies to 'host'
     */
	setChannelAttribute = (key, val) => {
		return this.signal.invoke('io.agora.signal.channel_set_attr', { channel: this.GAME_ID, name: key, value: val });
    }

    /**
     * Only applies to 'host'
     */
    createGame = async () => {
        console.log('[QuizEngine.js] createGame::',);

        const {game_role, game_status, signal, PLAYER_ID} = this;

        if (game_role === QUIZ_ROLE_HOST) {
            game_status.GAME_ID = shortid.generate();

            console.log('[QuizEngine.js] createGame:: logging in as ', PLAYER_ID);

            await signal.login(PLAYER_ID);

            const channel = await signal.join(game_status.GAME_ID);

            this.channel = channel;

            let result = await signal.invoke('io.agora.signal.channel_query_userlist', { name: game_status.GAME_ID });

            console.log('1111 result', result)

            if (result.list && result.list.length === 1 && result.list[0][0] === PLAYER_ID) {
                this.channel = channel;
    
                game_status.state = GAME_STATUS_WAIT_FOR_PLAYERS;
    
                game_status.host_player_id = PLAYER_ID;
    
                console.log('Created a new game successfully.');

                await this.setGameStatus();
            }
        }
        else {
            throw new Error('Only \'host\' can create game.');
        }

        return game_status.GAME_ID;
    };

    _onPlayerAnswer = async (...args) => {
        console.log('[QuizEngine.js] _onPlayerAnswer:: ...args', ...args);

        const {game_status} = this;

        const [answer, playerId] = args;

        PLAYER_KEYS.map(player_key => {
            if (game_status[player_key + '_player_id'] === playerId) {
                this[player_key + '_answer'] = answer;
                game_status[player_key + '_answered'] = true;
            }
        });

        setImmediate(this.onPlayerAnswer.bind(this, ...args));
    };

    /**
     * Only applies to 'player' and 'audience'
     */
    joinGame = async (game_id) => {
        console.log('[QuizEngine.js] joinGame:: game_id', game_id);

        const {game_role, game_status} = this;
        
        if ([QUIZ_ROLE_PLAYER, QUIZ_ROLE_AUDIENCE].indexOf(game_role) > -1) {
            if (!game_id) {
                throw new Error('Missing required parameter \'game_id\'');
            }

            this.GAME_ID = game_id;
        } 
        else {
            throw new Error(`Invalid game role \'${game_role}\'`);
        }
    };

    /**
     * Only applies to 'host', 'player' and 'audience'
     */
    leaveGame =  async () => {
        
    };


    /**
     * Only applies to 'host'
     */
    sendQuestion = async (question, answer_options) => {
        console.log('[QuizEngine.js] sendQuestion:: question', question, 'answer_options', answer_options);

        this.game_status.question = question;
        this.game_status.question_answers = answer_options;

        this.onGameStatusUpdate();
    };

    /**
     * Only applies to 'host' and 'player'
     */
    sendAnswer = async (answer, playerId) => {
        console.log('[QuizEngine.js] sendAnswer:: answer', answer, 'playerId', playerId);

        if (answer >= 0 && answer < 4) {
            if (this.game_role === "host") {
                this.game_status.answer = answer;
            }
            else if (this.game_role.indexOf("player") === 0) {

            }

            this.onGameStatusUpdate();
        }
        else {
            throw new Error("Answer can only be between 0 and 3, inclusive");
        }
    };

    /**
     * Only applies to 'player'
     */
    assignQuizRole = async (new_player_id) => {
        const {game_status} = this;

        console.log('[QuizEngine.js] assignQuizRole:: new_player_id', new_player_id);
        
        let player_role;
        
        PLAYER_KEYS.map(player_key => {            
            if (!player_role && !game_status[player_key + "_player_id"]) {
                game_status[player_key + "_player_id"] = new_player_id;
                player_role = player_key;
            }
        });

        console.log('assignQuizRole:: player_role', player_role, 'game_status', game_status);

        setImmediate(() => {
            if (this.onPlayerJoin) {
                this.onPlayerJoin(new_player_id);
            }
        });

        return player_role;
    };
}