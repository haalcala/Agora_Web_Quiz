import React, {useState, useEffect} from 'react';

import _ from 'lodash';

import base64Encode from '../utils/base64';

export const videoProfileList = [
    {
      value: 0,
      label: '160x120	15fps	65kbps'
    },
    {
      value: 20,
      label: '320x240	15fps	200kbps'
    },
    {
      value: 30,
      label: '640x360	15fps	400kbps'
    },
    {
      value: 43,
      label: '640x480	30fps	750kbps'
    },
    {
      value: 50,
      label: '1280x720 15fps 1130kbps'
    },
    {
      value: 60,
      label: '1920x1080 15fps 2080kbps'
    }
  ]
  
  export const audioProfileList = [
    {
      value: 0,
      label: 'AUDIO_PROFILE_DEFAULT'
    },
    {
      value: 1,
      label: 'AUDIO_PROFILE_SPEECH_STANDARD'
    },
    {
      value: 2,
      label: 'AUDIO_PROFILE_MUSIC_STANDARD'
    },
    {
      value: 3,
      label: 'AUDIO_PROFILE_MUSIC_STANDARD_STEREO'
    },
    {
      value: 4,
      label: 'AUDIO_PROFILE_MUSIC_HIGH_QUALITY'
    },
    {
      value: 5,
      label: 'AUDIO_PROFILE_MUSIC_HIGH_QUALITY_STEREO'
    } 
  ];
  
  export const audioScenarioList = [
    {
      value: 0,
      label: 'AUDIO_PROFILE_DEFAULT'
    },
    {
      value: 1,
      label: 'AUDIO_SCENARIO_CHATROOM_ENTERTAINMENT'
    },
    {
      value: 2,
      label: 'AUDIO_SCENARIO_EDUCATION'
    },
    {
      value: 3,
      label: 'AUDIO_SCENARIO_GAME_STREAMING'
    },
    {
      value: 4,
     label: 'AUDIO_SCENARIO_SHOWROOM'
    },
    {
      value: 5,
      label: 'AUDIO_SCENARIO_CHATROOM_GAMING'
    } 
  ];
  
  export default props => {
    const {quiz_engine} = props;
    const {rtcEngine} = quiz_engine;

    const [state, setState] = useState({
        camera: 0,
        mic: rtcEngine.microphoneId,
    });

    useEffect(() => {
        if (state.show_panel) {
            if (props.onOpen) props.onOpen();
        }
        else {
            if (props.onClose) props.onClose();
        } 
        
        (async () => {
            const videoDevices = await rtcEngine.getVideoDevices();
            const audioDevices = await rtcEngine.getAudioRecordingDevices();
            const audioPlaybackDevices = await rtcEngine.getAudioPlaybackDevices();

            console.log('videoDevices', videoDevices);
            console.log('audioDevices', audioDevices);
            console.log('audioPlaybackDevices', audioPlaybackDevices);

            videoDevices && videoDevices.forEach((device, devicei) => {
                if (rtcEngine.cameraId === device.deviceId) {
                    state.camera = devicei;
                }
            });

            setState({...state, videoDevices, audioDevices, audioPlaybackDevices});
        })();
    }, [state.show_panel]);

    console.log('[CameraConfigPanel.js]:: quiz_engine', quiz_engine);

	const handleVideoProfile = e => {
		setState({
			videoProfile: Number(e.currentTarget.value)
		})
	}

	const handleAudioProfile = e => {
		setState({
			audioProfile: Number(e.currentTarget.value)
		})
	}

	const handleAudioScenario = e => {
		setState({
			audioScenario: Number(e.currentTarget.value)
		})
	}

	const handleCameraChange = e => {
        console.log('e.currentTarget.value', e.currentTarget.value);
        console.log('state.videoDevices', state.videoDevices);
        console.log('state.videoDevices[e.currentTarget.value].deviceId', state.videoDevices[e.currentTarget.value].deviceId)

		setState({...state, camera: state.videoDevices[e.currentTarget.value].deviceId });
		rtcEngine.setVideoDevice(state.videoDevices[e.currentTarget.value].deviceId);
	}

	const handleMicChange = e => {
		setState({ mic: e.currentTarget.value });
		rtcEngine.setAudioRecordingDevice(state.audioDevices[e.currentTarget.value].deviceid);
	}

	const handleSpeakerChange = e => {
		setState({ speaker: e.currentTarget.value });
		rtcEngine.setAudioPlaybackDevice(state.audioPlaybackDevices[e.currentTarget.value].deviceid);
	}

	const handleScreenSharing = e => {
		// getWindowInfo and open Modal
		let list = rtcEngine.getScreenInfo();

		let windowList = list.map(item => {
			return {
				ownerName: item.ownerName,
				name: item.name,
				windowId: item.windowId,
				image: base64Encode(item.image)
			}
		});

		console.log(windowList);

		setState({
			showWindowPicker: true,
			windowList: windowList
		});
	}

	const togglePlaybackTest = e => {
		if (!this.state.playbackTestOn) {
			let filepath = '/Users/menthays/Projects/Agora-RTC-SDK-for-Electron/example/temp/music.mp3';
			let result = this.rtcEngine.startAudioPlaybackDeviceTest(filepath);
			console.log(result);
		} else {
			this.rtcEngine.stopAudioPlaybackDeviceTest();
		}
		this.setState({
			playbackTestOn: !this.state.playbackTestOn
		})
	}

	const toggleRecordingTest = e => {
		if (!this.state.recordingTestOn) {
			let result = this.rtcEngine.startAudioRecordingDeviceTest(1000);
			console.log(result);
		} else {
			this.rtcEngine.stopAudioRecordingDeviceTest();
		}
		this.setState({
			recordingTestOn: !this.state.recordingTestOn
		})
	}

    return (
        <div className={'settings-item-panel'  + (state.first_time_load ? ' host-question-panel-first-time' : '') + (state.show_panel ? " host-question-panel-expand scale-in-ver-top" : "")}>
            {!state.show_panel ?
                <div onClick={() => setState({...state, show_panel: true})}
                style={{}}>
                        <img src={require('./list-512.png')} style={{width: '64px', height: '64px'}}/>
                    </div>
                : 
                <div>
					<div className="field">
						<label className="label">Role</label>
						<div className="control">
							<div className="select" style={{ width: '100%' }}>
								<select onChange={e => setState({ role: Number(e.currentTarget.value) })} value={state.role} style={{ width: '100%' }}>
									<option value={1}>Anchor</option>
									<option value={2}>Audience</option>
								</select>
							</div>
						</div>
					</div>
					<div className="field">
						<label className="label">VideoProfile</label>
						<div className="control">
							<div className="select" style={{ width: '100%' }}>
								<select onChange={handleVideoProfile} value={state.videoProfile} style={{ width: '100%' }}>
									{videoProfileList.map(item => (<option key={item.value} value={item.value}>{item.label}</option>))}
								</select>
							</div>
						</div>
					</div>
					<div className="field">
						<label className="label">AudioProfile</label>
						<div className="control">
							<div className="select" style={{ width: '50%' }}>
								<select onChange={handleAudioProfile} value={state.audioProfile} style={{ width: '100%' }}>
									{audioProfileList.map(item => (<option key={item.value} value={item.value}>{item.label}</option>))}
								</select>
							</div>
							<div className="select" style={{ width: '50%' }}>
								<select onChange={handleAudioScenario} value={state.audioScenario} style={{ width: '100%' }}>
									{audioScenarioList.map(item => (<option key={item.value} value={item.value}>{item.label}</option>))}
								</select>
							</div>
						</div>
					</div>
					<div className="field">
						<label className="label">Camera</label>
						<div className="control">
							<div className="select" style={{ width: '100%' }}>
								<select onChange={handleCameraChange} value={state.camera} style={{ width: '100%' }}>
									{state.videoDevices && state.videoDevices.map((item, index) => (<option key={index} value={index}>{item.label}</option>)) || null}
								</select>
							</div>
						</div>
					</div>
					<div className="field">
						<label className="label">Microphone</label>
						<div className="control">
							<div className="select" style={{ width: '100%' }}>
								<select onChange={handleMicChange} value={state.mic} style={{ width: '100%' }}>
									{state.audioDevices && state.audioDevices.map((item, index) => (<option key={index} value={index}>{item.label}</option>)) || null}
								</select>
							</div>
						</div>
					</div>
					<div className="field">
						<label className="label">Loudspeaker</label>
						<div className="control">
							<div className="select" style={{ width: '100%' }}>
								<select onChange={handleSpeakerChange} value={state.speaker} style={{ width: '100%' }}>
									{state.audioPlaybackDevices && state.audioPlaybackDevices.map((item, index) => (<option key={index} value={index}>{item.label}</option>)) || null}
								</select>
							</div>
						</div>
					</div>
					{/* <div className="field is-grouped is-grouped-right">
				<div className="control">
					<button onClick={handleAudioMixing} className="button is-link">Start/Stop Audio Mixing</button>
				</div>
				</div> */}
					<hr />
					<div className="field">
						<label className="label">Screen Share</label>
						<div className="control">
							<button onClick={handleScreenSharing} className="button is-link">Screen Share</button>
						</div>
					</div>

					<div className="field">
						<label className="label">Audio Playback Test</label>
						<div className="control">
							<button onClick={togglePlaybackTest} className="button is-link">{state.playbackTestOn ? 'stop' : 'start'}</button>
						</div>
					</div>
					<div className="field">
						<label className="label">Audio Recording Test</label>
						<div className="control">
							<button onClick={toggleRecordingTest} className="button is-link">{state.recordingTestOn ? 'stop' : 'start'}</button>
						</div>
					</div>
					<div className="field">
						<div className="control">
							<button onClick={() => setState({...state, show_panel: false})} className="button is-link">Close</button>
						</div>
					</div>
                </div>
            }
        </div>
    );
}