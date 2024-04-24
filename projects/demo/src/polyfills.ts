// @ts-nocheck
if (
  typeof MediaRecorder === 'undefined' ||
  !MediaRecorder.isTypeSupported('audio/webm')
) {
  Promise.all([
    import('audio-recorder-polyfill'),
    import('audio-recorder-polyfill/mpeg-encoder'),
  ])
    .then(([AudioRecorderModule, mpegEncoderModule]) => {
      const AudioRecorder = AudioRecorderModule.default;
      const mpegEncoder = mpegEncoderModule.default;

      AudioRecorder.encoder = mpegEncoder;
      AudioRecorder.prototype.mimeType = 'audio/mpeg';
      window.MediaRecorder = AudioRecorder;

      console.warn('Polyfilled MediaRecorder');
    })
    .catch((error) => {
      console.error('Error importing polyfill:', error);
    });
}
