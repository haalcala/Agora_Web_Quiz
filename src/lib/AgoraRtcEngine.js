const EventEmitter = require('events').EventEmitter;

const OldRenderer = function () { };
const Renderer = function () { };

const { AgoraRTC } = global;

/**
 * @class AgoraRtcEngine
 */
class AgoraRtcEngine extends EventEmitter {
	streams = {};

	local_stream_config = { streamID: null, audio: true, cameraId: null, microphoneId: null, video: true, screen: false }

	constructor() {
		super();

		this.client = AgoraRTC.createClient({ mode: 'live' });
	}

	initialize(appId) {
		const { client, local_stream_config } = this;

		console.log("[AgoraRtcEngine.js]:: initialize:: local_stream_config ", local_stream_config);

		return new Promise((resolve, reject) => {
			client.init(appId, async () => {
				console.log("AgoraRTC client initialized");

				(await this.getVideoDevices()).map(device => {
					console.log('[AgoraRtcEngine.js] initialize:: initialise(getVideoDevices):: device', device);

					if (!this.videoSource) {
						this.videoSource = device.deviceId;
					}
				});
				(await this.getAudioRecordingDevices()).map(device => {
					console.log('[AgoraRtcEngine.js] initialize:: initialise(getAudioRecordingDevices):: device', device);

					if (!this.audioSource) {
						this.audioSource = device.deviceId;
					}
				});

				console.log('[AgoraRtcEngine.js] initialize:: this', this);

				resolve();
			}, function (err) {
				console.log("[AgoraRtcEngine.js] initialize:: AgoraRTC client init failed", err);

				reject(err);
			});

			  client.on('error', (err) => {
				console.log("[AgoraRtcEngine.js] initialize:: Got error msg:", err.reason);
				if (err.reason === 'DYNAMIC_KEY_TIMEOUT') {
				  client.renewChannelKey(this._channel, ()=> {
					console.log("[AgoraRtcEngine.js] initialize:: Renew channel key successfully");
				  }, (err)=> {
					console.log("[AgoraRtcEngine.js] initialize:: Renew channel key failed: ", err);
				  });
				}
			  });
			
			  client.on('stream-added',  (evt) => {
				var stream = evt.stream;
				console.log("[AgoraRtcEngine.js] initialize:: New stream added: " + stream.getId());
				console.log("[AgoraRtcEngine.js] initialize:: Subscribe ", stream);
				// client.subscribe(stream,  (err) => {
				//   console.log("[AgoraRtcEngine.js] initialize:: Subscribe stream failed", err);
				// });
				this.streams[stream.getId()] = stream;
			  });
			
			  client.on('stream-subscribed',  (evt) => {
				var stream = evt.stream;
				console.log("[AgoraRtcEngine.js] initialize:: Subscribe remote stream successfully: " + stream.getId());
				// if ($('div#video #agora_remote'+stream.getId()).length === 0) {
				//   $('div#video').append('<div id="agora_remote'+stream.getId()+'" style="float:left; width:810px;height:607px;display:inline-block;"></div>');
				// }
				// stream.play('agora_remote' + stream.getId());
			  });
			
			  client.on('stream-removed',  (evt) => {
				var stream = evt.stream;
				stream.stop();
				// $('#agora_remote' + stream.getId()).remove();
				console.log("[AgoraRtcEngine.js] initialize:: Remote stream is removed " + stream.getId());

				delete this.streams[stream.getId()];

				setImmediate(this.emit.bind(this, 'removestream', stream.getId(), 'stream-removed'));
			  });
			
			  client.on('peer-leave',  (evt) => {
				var stream = evt.stream;
				if (stream) {
				  stream.stop();
				//   $('#agora_remote' + stream.getId()).remove();
				  console.log("[AgoraRtcEngine.js] initialize:: " + evt.uid + " leaved from this channel");
				  delete this.streams[stream.getId()];

				  setImmediate(this.emit.bind(this, 'leavechannel'));
				}
			  });
		});
	}

	setChannelProfile = (profile) => {

	};

	setClientRole = (role) => {

	};

	setAudioProfile = (p1, p2) => {

	};

	enableVideo = () => {
	};
	
	disableVideo = () => {
	};
	
	setLogFile = (path) => {
		
	};
	
	enableLocalVideo = (enable) => {
		this.local_stream_config.video = enable;
	};

	enableWebSdkInteroperability = (enable) => {

	};

	setVideoProfile = (videoProfile, enable) => {

	};

	enableDualStreamMode = (enable) => {

	};

	enableAudioVolumeIndication = (p1, p2) => {

	};

	joinChannel = (token, channel, info, uid) => {
		return new Promise((resolve, reject) => {
			let { client, local_stream_config } = this;
	
			console.log("[AgoraRtcEngine.js]:: joinChannel:: local_stream_config ", local_stream_config);

			client.join(token, channel, null, (uid) => {
				console.log("[AgoraRtcEngine.js]:: joinChannel:: User " + uid + " join channel successfully");

				this._channel = channel;
				this.local = uid;

				let { client, videoSource, audioSource, local } = this;

				console.log('[AgoraRtcEngine.js]:: joinChannel:: local_stream_config.video', local_stream_config.video)

				if (!local_stream_config.video) {
					setImmediate(this.emit.bind(this, 'joinedchannel', this._channel, this.local, 0));

					return;
				}
	
				let camera = videoSource;
				let microphone = audioSource;

				if (local_stream_config.video) {
					local_stream_config.cameraId = camera;
					local_stream_config.microphoneId = audioSource;
					local_stream_config.streamID = uid;
				}

				console.log('[AgoraRtcEngine.js]:: joinChannel:: creating local stream with local_stream_config', local_stream_config)

				let localStream = this.localStream = AgoraRTC.createStream(local_stream_config);
				//localStream = AgoraRTC.createStream({streamID: uid, audio: false, cameraId: camera, microphoneId: microphone, video: false, screen: true, extensionId: 'minllpmhdgpndnkomcoccfekfegnlikg'});
	
				localStream.setVideoProfile('720p_3');
		
				// The user has granted access to the camera and mic. 
				localStream.on("accessAllowed", function () {
					console.log("[AgoraRtcEngine.js]:: joinChannel:: accessAllowed");
				});
		
				// The user has denied access to the camera and mic.
				localStream.on("accessDenied", function () {
					console.log("[AgoraRtcEngine.js]:: joinChannel:: accessDenied");
				});
		
				localStream.init(() => {
					console.log("[AgoraRtcEngine.js]:: joinChannel:: getUserMedia successfully");
	
					client.publish(localStream, (err) => {
						console.log("[AgoraRtcEngine.js]:: joinChannel:: Publish local stream error: " + err);

						reject(err);
					});
					
					client.on('stream-published', (evt) => {
						console.log("[AgoraRtcEngine.js]:: joinChannel:: Publish local stream successfully");
						setImmediate(this.emit.bind(this, 'joinedchannel', this._channel, this.local, 0));

						resolve(localStream);
					});
			
				}, function (err) {
					console.log("[AgoraRtcEngine.js]:: joinChannel:: getUserMedia failed", err);
	
					reject(err);
				});

				// resolve(uid);
			}, function (err) {
				console.log("[AgoraRtcEngine.js]:: joinChannel:: Join channel failed", err);

				reject(err);
			});
		});
	}

	setupLocalVideo(dom) {
		console.log('setupLocalVideo:: dom', dom);

		return new Promise((resolve, reject) => {
			const  {client, localStream} = this;

			localStream.play(dom.id, {fit: 'cover', position: 'unset'});
	
			resolve();
		});
	}

	subscribe(uid, dom) {
		console.log('[AgoraRtcEngine.js] subscribe:: uid, dom', uid, dom);
		
		return new Promise((resolve, reject) => {
			let { client } = this;

			const remoteStream = this.streams[uid];
			// const remoteStream = AgoraRTC.createStream({streamID: uid, video: true, audio: true, local: false, screen: false});

			console.log('[AgoraRtcEngine.js] subscribe:: uid, remoteStream', uid, remoteStream);
	
			if (remoteStream) {
				const timer_id = setTimeout(() => {
					console.log('[AgoraRtcEngine.js] subscribe:: Trying to play stream for uid', uid);

					remoteStream.play(dom.id, {fit: 'cover'});
				}, 1000);

				client.subscribe(remoteStream, (err) => {
					console.log('[AgoraRtcEngine.js] subscribe:: err', err);

					clearTimeout(timer_id);
				});
			}

			resolve(remoteStream);
		});
	}

	getDevices(filter) {
		return new Promise(resolve => {
			AgoraRTC.getDevices(function (devices) {
				console.log('getDevices:: devices', devices, 'filter', filter);
				// for (var i = 0; i !== devices.length; ++i) {
				//   var device = devices[i];
				//   var option = document.createElement('option');
				//   option.value = device.deviceId;
				//   if (device.kind === 'audioinput') {
				//     option.text = device.label || 'microphone ' + (audioSelect.length + 1);
				//     audioSelect.appendChild(option);
				//   } else if (device.kind === 'videoinput') {
				//     option.text = device.label || 'camera ' + (videoSelect.length + 1);
				//     videoSelect.appendChild(option);
				//   } else {
				//     console.log('Some other kind of source/device: ', device);
				//   }
				// }

				resolve(devices.filter(device => device.kind === filter && device));
			});
		})
	}

	leaveChannel = async (channel) => {
		const {localStream, client} = this;

		if (localStream) {
			console.log('Unpublish local stream');
			await client.unpublish(localStream, function (err) {
				console.log("Unpublish local stream failed" + err);
			});
		}

		await client.leave();
	}

	getVideoDevices() {
		return this.getDevices('videoinput')
	}

	setVideoDevice(cameraId) {
		console.log('[AgoraRtcEngine.js] setVideoDevice:: cameraId', cameraId);

		this.cameraId = cameraId;

		this.localStream.switchDevice('video', cameraId);
	}

	getAudioRecordingDevices() {
		return this.getDevices('audioinput');
	}

	getAudioPlaybackDevices() {
		return this.getDevices('audiooutput');
	}
}

export default AgoraRtcEngine
