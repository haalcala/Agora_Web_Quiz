import React, {useState, useEffect} from 'react';

import HostQuestionPanel from './HostQuestionPanel';
import CameraConfigPanel from './CameraConfigPanel';

import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Label, Form, FormGroup } from 'reactstrap';


export default props => {
    console.log('[MenuPanel.js]:: props', props);

    const [state, setState] = useState({open_panel: ''});

    const {quiz_engine} = props;

    const handleConfirmExit = async () => {
        if (!state.confirmExit) {
            setState({...state, confirmExit: true});
        }
        else {
            props.onExit();
        }
    }

    const toggle = async () => {
        setState({...state, confirmExit: !state.confirmExit});
    };

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

            <div className='settings-item-panel' onClick={handleConfirmExit}>
                <img style={{width: '48px', height: '48px', margin: 'auto'}} src={require("./logout.png")} alt='Logout'/>
            </div>
            
            <Modal isOpen={state.confirmExit} toggle={toggle} className={props.className} style={{display: 'flex', height: '100%', margin: 'auto'}} backdrop={state.backdrop}>
                <ModalHeader toggle={toggle}>Modal title</ModalHeader>
                <ModalBody>
                    Do you really want to exit?
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={handleConfirmExit}>Yes</Button>{' '}
                    <Button color="secondary" onClick={toggle}>Cancel</Button>
                </ModalFooter>
            </Modal>
        </div>
    );
};