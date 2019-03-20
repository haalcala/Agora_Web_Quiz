const EventEmitter = require('events').EventEmitter;

const OldRenderer = function () { };
const Renderer = function () { };

const { AgoraRTC } = global;

/**
 * @class AgoraRtcEngine
 */
class AgoraRtcEngine extends EventEmitter {
	streams = {};

	constructor() {
		super();

		this.client = AgoraRTC.createClient({ mode: 'live' });
	}

	initialize(appId) {
		const { client } = this;

		return new Promise((resolve, reject) => {
			client.init(appId, async () => {
				console.log("AgoraRTC client initialized");

				(await this.getVideoDevices()).map(device => {
					console.log('initialise(getVideoDevices):: device', device);

					if (!this.videoSource) {
						this.videoSource = device.deviceId;
					}
				});
				(await this.getAudioRecordingDevices()).map(device => {
					console.log('initialise(getAudioRecordingDevices):: device', device);

					if (!this.audioSource) {
						this.audioSource = device.deviceId;
					}
				});

				console.log('this', this);

				resolve();
			}, function (err) {
				console.log("AgoraRTC client init failed", err);

				reject(err);
			});

			  client.on('error', (err) => {
				console.log("Got error msg:", err.reason);
				if (err.reason === 'DYNAMIC_KEY_TIMEOUT') {
				  client.renewChannelKey(this._channel, ()=> {
					console.log("Renew channel key successfully");
				  }, (err)=> {
					console.log("Renew channel key failed: ", err);
				  });
				}
			  });
			
			  client.on('stream-added',  (evt) => {
				var stream = evt.stream;
				console.log("New stream added: " + stream.getId());
				console.log("Subscribe ", stream);
				// client.subscribe(stream,  (err) => {
				//   console.log("Subscribe stream failed", err);
				// });
				this.streams[stream.getId()] = stream;
			  });
			
			  client.on('stream-subscribed',  (evt) => {
				var stream = evt.stream;
				console.log("Subscribe remote stream successfully: " + stream.getId());
				// if ($('div#video #agora_remote'+stream.getId()).length === 0) {
				//   $('div#video').append('<div id="agora_remote'+stream.getId()+'" style="float:left; width:810px;height:607px;display:inline-block;"></div>');
				// }
				// stream.play('agora_remote' + stream.getId());
			  });
			
			  client.on('stream-removed',  (evt) => {
				var stream = evt.stream;
				stream.stop();
				// $('#agora_remote' + stream.getId()).remove();
				console.log("Remote stream is removed " + stream.getId());

				delete this.streams[stream.getId()];
			  });
			
			  client.on('peer-leave',  (evt) => {
				var stream = evt.stream;
				if (stream) {
				  stream.stop();
				//   $('#agora_remote' + stream.getId()).remove();
				  console.log(evt.uid + " leaved from this channel");
				  delete this.streams[stream.getId()];
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
		this.enable_video = true;
	};

	setLogFile = (path) => {

	};

	enableLocalVideo = (enable) => {
		this.enable_local_video = true;
	};

	enableWebSdkInteroperability = (enable) => {

	};

	setVideoProfile = (videoProfile, enable) => {

	};

	enableDualStreamMode = (enable) => {

	};

	enableAudioVolumeIndication = (p1, p2) => {

	};

	joinChannel(token, channel, info, uid) {
		return new Promise((resolve, reject) => {
			let { client } = this;
	
			client.join(token, channel, null, (uid) => {
				console.log("User " + uid + " join channel successfully");

				this._channel = channel;
				this.local = uid;

				let { client, videoSource, audioSource, local } = this;
	
				let camera = videoSource;
				let microphone = audioSource;
		
				let localStream = this.localStream = AgoraRTC.createStream({ streamID: uid, audio: true, cameraId: camera, microphoneId: microphone, video: true, screen: false });
				//localStream = AgoraRTC.createStream({streamID: uid, audio: false, cameraId: camera, microphoneId: microphone, video: false, screen: true, extensionId: 'minllpmhdgpndnkomcoccfekfegnlikg'});
	
				localStream.setVideoProfile('720p_3');
		
				// The user has granted access to the camera and mic. 
				localStream.on("accessAllowed", function () {
					console.log("accessAllowed");
				});
		
				// The user has denied access to the camera and mic.
				localStream.on("accessDenied", function () {
					console.log("accessDenied");
				});
		
				localStream.init(() => {
					console.log("getUserMedia successfully");
	
					client.publish(localStream, (err) => {
						console.log("Publish local stream error: " + err);
					});
					
					client.on('stream-published', (evt) => {
						console.log("Publish local stream successfully");
						setImmediate(this.emit.bind(this, 'joinedchannel', this._channel, this.local, 0));

						resolve(localStream);
					});
			
				}, function (err) {
					console.log("getUserMedia failed", err);
	
					reject(err);
				});

				// resolve(uid);
			}, function (err) {
				console.log("Join channel failed", err);

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

			console.log('[AgoraRtcEngine.js] subscribe:: remoteStream', remoteStream);
	
			if (remoteStream) {
				client.subscribe(remoteStream);
	
				remoteStream.play(dom.id, {fit: 'cover'});
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

	getVideoDevices() {
		return this.getDevices('videoinput')
	}

	getAudioRecordingDevices() {
		return this.getDevices('audioinput');
	}

	getAudioPlaybackDevices() {
		return this.getDevices('audiooutput');
	}
}

export default AgoraRtcEngine
