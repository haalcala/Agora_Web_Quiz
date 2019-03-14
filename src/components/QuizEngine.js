
import _ from 'lodash';
import shortid from 'shortid';

import Util from '../utils/index';
const {QUIZ_STATUS_TEXT, QUIZ_ROLE_HOST, QUIZ_ROLE_PLAYER, QUIZ_ROLE_AUDIENCE, GAME_STATUS_INITIALISED, GAME_STATUS_WAIT_FOR_PLAYERS, GAME_STATUS_STARTED, GAME_STATUS_ENDED} = Util;

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
    }

    onPlayerJoin = () => {};
    onPlayerLeave = () => {};
    
    onPlayerAnswer = () => {};

    createGame = async () => {
        const {game_role, game_status} = this;

        if (game_role === QUIZ_ROLE_HOST) {
            game_status.GAME_ID = shortid.generate();
        }
        else {
            throw new Error('Only \'host\' can create game.');
        }

        return game_status.GAME_ID;
    }

    joinGame = async (game_id) => {
        const {game_role, game_status} = this;
        
        if ([QUIZ_ROLE_PLAYER, QUIZ_ROLE_AUDIENCE].indexOf(game_role) > -1) {
            if (!game_id) {
                throw new Error('Missing required parameter \'game_id\'');
            }

            this.GAME_ID = game_id;
        } 
        else {
            throw new Error(`Invalid game role \'${game_role}\'`)
        }
    }

    leaveGame =  async () => {
        
    }

    sendAnswer = async (answer, playerId) => {
        if (answer >= 0 && answer < 4) {
            if (this.game_role === "host") {

            }
            else if (this.game_role.indexOf("player") === 0) {

            }
        }
        else {
            throw new Error("Answer can only be between 0 and 3, inclusive");
        }
    };

    assignQuizRole = async (new_player_id) => {
        const {game_status} = this;

        console.log('assignQuizRole:: new_player_id', new_player_id);
        
        let player_role;
        
        _.times(3).map(n => {
            let player_key = 'player' + (n+1);
            
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
    }
}