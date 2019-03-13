import React from 'react';

import _ from 'lodash';

export default class Util {
    static QUIZ_ROLES = ['host', 'player', 'audience'];

    static QUIZ_ROLE_PLAYER = 'player'
    static QUIZ_ROLE_HOST = 'host'
    static QUIZ_ROLE_AUDIENCE = 'audience'

    static GAME_STATUS_INITIALISED = 0;
    static GAME_STATUS_WAIT_FOR_PLAYERS = 1;
    static GAME_STATUS_STARTED = 2;
    static GAME_STATUS_ENDED = 3;

    static QUIZ_STATUS_TEXT = ["Game Initialised", "Wating for players", "Quiz Started", 'Quiz Ended'];
}