import React, {useState, useEffect} from 'react';

export default props => {
    const [state, setState] = useState({});

    useEffect(() => {
        if (state.show_panel) {
            if (props.onOpen) props.onOpen();
        }
        else {
            if (props.onClose) props.onClose();
        } 
    }, [state.show_panel]);

    return (
        <div className='settings-item-panel'>
            <img src={require('./list-512.png')} style={{width: '64px', height: '64px'}}/>
        </div>
    );
}