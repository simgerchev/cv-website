import { Player } from '@lottiefiles/react-lottie-player';
import coolAnim from '../assets/lottie-animation-third.json';

export default function LottieAnimation() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', margin: '32px 0' }}>
      <Player
        autoplay
        loop
        src={coolAnim}
        style={{ height: '400px', width: '400px' }}
      />
    </div>
  );
}