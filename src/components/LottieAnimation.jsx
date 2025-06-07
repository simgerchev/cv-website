import { Player } from '@lottiefiles/react-lottie-player';
import coolAnim from '../assets/lottie-animations/lottie-animation-seventh.json';

export default function LottieAnimation() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center'}}>
      <Player
        autoplay
        loop
        src={coolAnim}
        style={{ height: '200px', width: '200px' }}
      />
    </div>
  );
}