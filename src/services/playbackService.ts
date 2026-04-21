import TrackPlayer, { Event } from 'react-native-track-player';

// Servicio de fondo — requerido por react-native-track-player
// Los eventos RemoteNext/RemotePrevious se gestionan también en PrayScreen
// via useTrackPlayerEvents cuando la app está activa (pantalla bloqueada pero proceso vivo)
module.exports = async function () {
  TrackPlayer.addEventListener(Event.RemotePlay, () => TrackPlayer.play());
  TrackPlayer.addEventListener(Event.RemotePause, () => TrackPlayer.pause());
  TrackPlayer.addEventListener(Event.RemoteStop, () => TrackPlayer.stop());
};
