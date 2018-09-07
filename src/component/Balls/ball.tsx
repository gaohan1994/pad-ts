
import React from 'react';
import Parabola from './parabola';
import styles from './ball.css';

interface BallProps {
  target: any;
  curvature: any;
  speed: any;
  changeFlyBallCount: any;
  id: any;
  x: number;
  y: number;
}

class Ball extends React.Component<BallProps, {}> {
  private container: any;
  private parabola: any;

  componentDidMount() {
    const {
      target,
      curvature,
      speed,
      changeFlyBallCount,
      id,
    } = this.props;

    const options = {
      curvature,
      speed,
      complete: () => changeFlyBallCount(id),
    };

    this.parabola = new Parabola(this.container, target, options);
    this.parabola.run();
  }

  componentWillUnmount() {
    this.parabola.stop();
  }

  render() {
    const { x = 0, y = 0 } = this.props;
    return (
      <div
        className={styles.flyBall}
        ref={c => this.container = c}
        style={{ top: y, left: x }}
      >
        1
      </div>
    );
  }
}

export default Ball;
