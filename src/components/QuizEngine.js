
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

const SHARE_ID = 2;

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
            game_status.host_player_id = this.PLAYER_ID;
        }
        else if ([QUIZ_ROLE_PLAYER, QUIZ_ROLE_AUDIENCE].indexOf(game_role) > -1) {
        } 
        else {
            throw new Error(`Invalid game role '${game_role}'`);
        }

        console.log('[QuizEngine.js|constructor]('+game_role+'):: game_status', game_status);

        this.signal = new SignalingClient(APP_ID);
        // this.rtcEngine = new AgoraRtcEngine();
        this.rtcEngine = AgoraRTC.createClient({mode: 'live', codec: "h264"}); // eslint-disable-line 

        console.log('this.signal', this.signal);
        console.log('this.rtcEngine', this.rtcEngine);

        this.subscribeEvents();
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
        console.log('[QuizEngine.js] setGameStatus::',);

		const { game_status, signal } = this;
        
        game_status.requestId = shortid.generate();

		let result = await this.setChannelAttribute('game_status', JSON.stringify(game_status));

		console.log('[QuizEngine.js] setGameStatus:: 2222 result', result);
	};

	subscribeEvents = () => {
        console.log('[QuizEngine.js] subscribeEvents:: ', );
        console.log('[QuizEngine.js] subscribeEvents:: ', );
        console.log('[QuizEngine.js] subscribeEvents:: ', );
        console.log('[QuizEngine.js] subscribeEvents:: ', );
        console.log('[QuizEngine.js] subscribeEvents:: ', );
        console.log('[QuizEngine.js] subscribeEvents:: ', );
        console.log('[QuizEngine.js] subscribeEvents:: ', );
        console.log('[QuizEngine.js] subscribeEvents:: ', );
        console.log('[QuizEngine.js] subscribeEvents:: ', );
        console.log('[QuizEngine.js] subscribeEvents:: ', );
        console.log('[QuizEngine.js] subscribeEvents:: ', );
        console.log('[QuizEngine.js] subscribeEvents:: ', );
        console.log('[QuizEngine.js] subscribeEvents:: ', );
        console.log('[QuizEngine.js] subscribeEvents:: ', );
        console.log('[QuizEngine.js] subscribeEvents:: ', );
        console.log('[QuizEngine.js] subscribeEvents:: ', );
        console.log('[QuizEngine.js] subscribeEvents:: ', );
        console.log('[QuizEngine.js] subscribeEvents:: ', );
        console.log('[QuizEngine.js] subscribeEvents:: ', );
        console.log('[QuizEngine.js] subscribeEvents:: ', );
        console.log('[QuizEngine.js] subscribeEvents:: ', );
        console.log('[QuizEngine.js] subscribeEvents:: ', );
        console.log('[QuizEngine.js] subscribeEvents:: ', );
        console.log('[QuizEngine.js] subscribeEvents:: ', );
        console.log('[QuizEngine.js] subscribeEvents:: ', );
        console.log('[QuizEngine.js] subscribeEvents:: ', );
        console.log('[QuizEngine.js] subscribeEvents:: ', );
        console.log('[QuizEngine.js] subscribeEvents:: ', );
        console.log('[QuizEngine.js] subscribeEvents:: ', );
        console.log('[QuizEngine.js] subscribeEvents:: ', );
        console.log('[QuizEngine.js] subscribeEvents:: ', );
        console.log('[QuizEngine.js] subscribeEvents:: ', );
        console.log('[QuizEngine.js] subscribeEvents:: ', );
        console.log('[QuizEngine.js] subscribeEvents:: ', );
        console.log('[QuizEngine.js] subscribeEvents:: ', );
        console.log('[QuizEngine.js] subscribeEvents:: ', );
        console.log('[QuizEngine.js] subscribeEvents:: ', );
        console.log('[QuizEngine.js] subscribeEvents:: ', );
        console.log('[QuizEngine.js] subscribeEvents:: ', );
        console.log('[QuizEngine.js] subscribeEvents:: ', );

		const { signal, PLAYER_ID } = this;

		console.log('signal', signal);

		signal.sessionEmitter.on('onMessageInstantReceive', async (account, uid, msg) => {
			console.log('---===>>> signal.sessionEmitter.on(\'onMessageInstantReceive\':: account, uid, msg', account, uid, msg, typeof(msg));

            // this.onReceiveMessage(account, msg, 'instant');

            if (msg.charAt(0) === "{" && msg.charAt(msg.length-1) === "}") {
                msg = JSON.parse(msg);
            }

            console.log('---- msg', msg, typeof(msg));
            
			const { state } = this;
            const { game_status, quizRole } = state;

            const [command, val] = typeof(msg) === "string" && msg.split(",") || [];

            console.log('state', state, 'command', command, 'val', val);

            if (quizRole === QUIZ_ROLE_HOST) {
                if (command === 'answer') {
                    _.times(4).map(i => {
                        if (game_status[`player${i+1}_player_id`] === account) {
                            state[`player${i+1}_answer`] = val;

                            game_status[`player${i+1}_answered`] = true;
    
							console.log(`player${i+1}_answer`, val);
							
							this.setGameStatus();

                            // this.setState({});
                        }
					});
					

                }
                else if (command === "assign_player") {
                    if (game_status.host_player_id === PLAYER_ID) {
                        let next_player;
        
                        _.times(3).map(i => {
                            if (!next_player && !game_status['player' + (i + 1) + '_player_id']) {
                                next_player = game_status['player' + (i + 1) + '_player_id'] = account;

                                delete game_status[`player${i+1}_answered`];
                            }
                        });
        
                        console.log('next_player', next_player);
        
                        next_player && await this.setGameStatus();        
                    }        
                }
            }
            else if (quizRole === QUIZ_ROLE_AUDIENCE || quizRole === QUIZ_ROLE_PLAYER) {
                if (msg.game_status) {
                    console.log('setting new game_status');

                    // this.setState({game_status: msg.game_status});
                }
            }
		});
		signal.channelEmitter.on('onMessageChannelReceive', (account, uid, msg) => {
			console.log('---===>>> signal.channelEmitter.on(\'onMessageChannelReceive\':: account, uid, msg', account, uid, msg);

			// if (account !== signal.account) {
			//     this.onReceiveMessage(signal.channel.name, msg, 'channel');
			// }
		});

		signal.channelEmitter.on('onChannelUserLeaved', (account, uid) => {
			console.log('---===>>> signal.channelEmitter.on(\'onChannelUserLeaved\':: account, uid', account, uid);

			const { state } = this;
			const { game_status } = state;

			if (state.quizRole === QUIZ_ROLE_HOST) {
				_.times(3).map(n => {
					const player_key = `player${n}_player_id`;
					if (game_status[player_key] === account) {
                        console.log('removing player with account id', account);

						delete game_status[player_key];
						delete game_status[`player${n}_video_stream_id`];
					}
				});

				this.setGameStatus();
			}
		});

		signal.channelEmitter.on('onChannelUserJoined', async (account, uid) => {
			console.log('---===>>> signal.channelEmitter.on(\'onChannelUserJoined\':: account, uid', account, uid);

			const { state, signal } = this;
			const { game_status } = state;

			// console.log('game_status.state', game_status.state);

            state.quizIsOn && state.quizRole === QUIZ_ROLE_HOST && await signal.sendMessage(account, JSON.stringify({game_status}));
		});

		signal.channelEmitter.on('onChannelAttrUpdated', async (key, val, op, ...args) => {
            console.log('---===>>> signal.channelEmitter.on(\'onChannelAttrUpdated\':: key, val, op, ...args', key, val, op, ...args);

            if (op === "set") {
                return;
            }

            const {video_stream_id, game_role, game_status} = this;

            const {questionId} = game_status;

            console.log('signal.channelEmitter.on(\'onChannelAttrUpdated\':: this', this);
            
            if (key === 'game_status') {
                const game_status = val = JSON.parse(val);
    
                ['host', 'player1', 'player2', 'player3'].map(async game_role => {
                    if (game_status[game_role + '_player_id'] == PLAYER_ID) {
                        this.game_role = game_role;
                    }
                });

                this.game_status = game_status;
        
                const new_state = {};

                if (game_status.questionId != questionId) {
                    new_state.answer_from_host = ""; 
                    delete new_state.selected_answer;
                }

                ['question', 'question_answers'].map(prop => {
                    new_state[prop] = game_status[prop];
                });

                new_state.answer_from_host = game_status.answer;

                // this.setState(new_state);

                this.onGameStatusUpdate();
            }
            else if (key === 'video_stream_id' && game_role === QUIZ_ROLE_HOST) {
                const [game_role, video_stream_id] = val.split(',');

                game_status[`${game_role}_video_stream_id`] = parseInt(video_stream_id);

                delete this[`${game_role}_video_stream_id`];

                this.setGameStatus();
            }
		});

		this.rtcEngine.on('joinedchannel', (channel, uid, elapsed) => {
			const { state } = this;
			const { game_status } = state;

			console.log('---===>>> this.rtcEngine.on(\'joinedchannel\'):: channel, uid, elapsed', channel, uid, elapsed);

			state.video_stream_id = uid;

			if (state.quizRole === QUIZ_ROLE_HOST) {
				game_status.host_video_stream_id = uid;

				this.setupVideoPanels();
            }
            else if (state.quizRole === QUIZ_ROLE_PLAYER && state.game_role) {
                if (!game_status[state.game_role + '_video_stream_id'] && state.video_stream_id) {
                    process.nextTick(() => {
                        this.setChannelAttribute('video_stream_id', [state.game_role, state.video_stream_id].join(','));
                    });
                }
            }
		});

		this.rtcEngine.on('userjoined', (uid, elapsed) => {
			console.log('---===>>> this.rtcEngine.on(\'userjoined\'):: uid, elapsed', uid, elapsed);
			if (uid === SHARE_ID && this.state.localVideoSource) {
				return
			}

			// this.setState({
			// 	users: this.state.users.push(uid)
			// });
		});

		this.rtcEngine.on('removestream', (uid, reason) => {
			console.log('---===>>> this.rtcEngine.on(\'removestream\'):: uid, reason', uid, reason);
			// // this.setState({
			// 	users: this.state.users.delete(this.state.users.indexOf(uid))
			// });
		});

		this.rtcEngine.on('leavechannel', () => {
			console.log('---===>>> this.rtcEngine.on(\'leavechannel\')::');

			const new_state = {
				local: '', localVideoSource: '',
				users: this.state.users.splice(0),
				videos_on: []
			};

			console.log('---===>>> new_state', new_state);

			// this.setState(new_state);
		});

		this.rtcEngine.on('audiodevicestatechanged', () => {
			console.log('---===>>> this.rtcEngine.on(\'audiodevicestatechanged\')::');

			// this.setState({
			// 	audioDevices: this.rtcEngine.getAudioRecordingDevices(),
			// 	audioPlaybackDevices: this.rtcEngine.getAudioPlaybackDevices()
			// });
		});

		this.rtcEngine.on('videodevicestatechanged', () => {
			console.log("this.rtcEngine.on('videodevicestatechanged')::");

			// this.setState({
			// 	videoDevices: this.rtcEngine.getVideoDevices()
			// });
		});

		this.rtcEngine.on('audiovolumeindication', (
			uid,
			volume,
			speakerNumber,
			totalVolume
		) => {
			// console.log("this.rtcEngine.on('audiovolumeindication')::");
			// console.log(`uid${uid} volume${volume} speakerNumber${speakerNumber} totalVolume${totalVolume}`)
		});

		this.rtcEngine.on('error', (...err) => {
			console.log('---===>>> this.rtcEngine.on(\'error\')::');
			console.error(...err)
		});

		this.rtcEngine.on('executefailed', funcName => {
			console.log('this.rtcEngine.on(\'executefailed\')::');
			console.error(funcName, 'failed to execute')
		});
    }
    
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
            this.GAME_ID = game_status.GAME_ID = shortid.generate();

            console.log('[QuizEngine.js] createGame:: logging in as ', PLAYER_ID);

            await signal.login(PLAYER_ID);

            const channel = await signal.join(game_status.GAME_ID);

            console.log('[QuizEngine.js] createGame:: channel', channel);

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

        const {game_role, game_status, signal, PLAYER_ID} = this;
        
        if ([QUIZ_ROLE_PLAYER, QUIZ_ROLE_AUDIENCE].indexOf(game_role) > -1) {
            if (!game_id) {
                throw new Error('Missing required parameter \'game_id\'');
            }

            const login_result = await signal.login(this.PLAYER_ID);

            console.log('login_result', login_result);

            const channel = this.channel = await signal.join(game_id);

            let start = new Date();
            
            let game_role, reason;
            
            let timer_id = setInterval(async () => {
                const {game_status} = this;
                
                if (game_status) {                    
                    let player_count = 0;

                    _.times(4).map(i => {
                        if (game_status[`player${i+1}_player_id`] === PLAYER_ID) {
                            game_role = `player${i+1}`
                        }

                        if (game_status[`player${i+1}_player_id`]) {
                            player_count++;
                        }
                    });

                    if (game_status && game_status.state === GAME_STATUS_STARTED) {
                        reason = "Game already started";
                    }
                    else if (game_status && game_status.state === GAME_STATUS_ENDED) {
                        reason = "Game already ended";
                    }
                    else if (player_count === 3) {
                        reason = "Game is full";
                    }
                }
                
                if (reason || game_role || (new Date() - start) >= 10000) {
                    console.log('joinGame:: game_status', game_status);

                    if (game_role) {
                        console.log('Successfully joined game as', game_role);

                        // this.setState({ quizIsOn: true, quizRole: QUIZ_ROLE_PLAYER, game_id, current_state: `Joined and awaiting quiz start from host.` });

                        // this.handleJoin();

                        this.onPlayerJoin();
                    }
                    else {
                        console.log('ERROR: Unable to join game' + (reason ? ` (Reason: ${reason})` : ""));

                        // this.setState({current_state: 'ERROR: Unable to join game' + (reason ? ` (Reason: ${reason})` : "")});
                    }

                    clearInterval(timer_id);
                }
            }, 100);

            return game_id;
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

        await this.setGameStatus();

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

            await this.setGameStatus();

            this.onGameStatusUpdate();
        }
        else {
            throw new Error("Answer can only be between 0 and 3, inclusive");
        }
    };

    /**
     * Only applies to 'player'
     */
    requestAssignQuizRole = async () => {
        const {game_status, signal} = this;

        console.log('[QuizEngine.js] requestAssignQuizRole:: ', );
        
        await signal.sendMessage(game_status.host_player_id, "assign_player");
    };

    /**
     * Only applies to 'host'
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