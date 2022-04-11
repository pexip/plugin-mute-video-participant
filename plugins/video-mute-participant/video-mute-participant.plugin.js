(function () {

  let state$ = window.PEX.pluginAPI.createNewState({});

  function load(participants$) {
    participants$.subscribe(participants => {
      let state = {};
      participants.forEach(participant => {
        if (participant.uuid === window.PEX.selfUUID) {
          if (participant.isVideoMuted) {
            window.PEX.dispatchAction({type: '[Conference] Mute Camera'});
          } else {
            window.PEX.dispatchAction({type: '[Conference] Unmute Camera'});
          }
        }
        const label = participant.isVideoMuted ? 'Video unmute' : 'Video mute';
        state = Object.assign(state, {
          [participant.uuid]: {
            label: label
          }
        });
      });
      if (state) {
        state$.next(state);
      }
    });
  }

  function videoMuteParticipant(participant) {
    if (participant.isVideoMuted) {
      window.PEX.pluginAPI.sendRequest('participants/' + participant.uuid + '/video_unmuted');
    } else {
      window.PEX.pluginAPI.sendRequest('participants/' + participant.uuid + '/video_muted');
    }
  }

  function unload() {
    console.log('Video Mute Participant Plugin', 'Unloaded');
  }

  PEX.pluginAPI.registerPlugin({
    id: 'video-mute-participant-plugin-1.0',
    load: load,
    unload: unload,
    videoMuteParticipant: videoMuteParticipant,
    state$: state$,
  });

})();