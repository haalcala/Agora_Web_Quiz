import React, {useState, useEffect} from 'react';

import HostQuestionPanel from './HostQuestionPanel'
import CameraConfigPanel from './CameraConfigPanel'

export default props => {
    const [state, setState] = useState({open_panel: ''});

    const {quiz_engine} = props;

    return (
        <div className='settings-panel'>
            {quiz_engine.game_role === 'host' && (state.open_panel === 'question' || !state.has_others_open) ? 
                <HostQuestionPanel 
                    quiz_engine={quiz_engine}
                    onOpen={() => setState({...state, open_panel: 'question', has_others_open: true})} 
                    onClose={() => setState({...state, open_panel: '', has_others_open: false})} 
                    />
                : null
            }

            {state.open_panel === 'camera' || !state.has_others_open ? 
                <CameraConfigPanel 
                    quiz_engine={quiz_engine}
                    onOpen={() => setState({...state, open_panel: 'camera', has_others_open: true})} 
                    onClose={() => setState({...state, open_panel: '', has_others_open: false})} 
                />
            : null}
        </div>
    );
};