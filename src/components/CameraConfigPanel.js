import React, {useState, useEffect} from 'react';

export default props => {
    const {quiz_engine} = props;

    const [state, setState] = useState({});

    useEffect(() => {
        if (state.show_panel) {
            if (props.onOpen) props.onOpen();
        }
        else {
            if (props.onClose) props.onClose();
        } 
        
        (async () => {
            const video_devices = await quiz_engine.getVideoDevices();
    
            console.log('video_devices', video_devices);
        })();
    }, [state.show_panel]);

    console.log('[CameraConfigPanel.js]:: quiz_engine', quiz_engine);


    return (
        <div className='settings-item-panel'>
            <img src={require('./list-512.png')} style={{width: '64px', height: '64px'}}/>
        </div>
    );
}