import config from '../../common/config';
import React, { Component } from 'react';
import Ball from './ball';

interface BallsProps {
  balls: any;
  target: any;
  curvature: any;
  speed: any;
  changeFlyBallCount: any;
}

interface BallsState {
  balls: any;
}

class Balls extends Component<BallsProps, BallsState> {
  constructor(props: BallsProps) {
    super(props);

    this.state = {
      balls: props.balls,
    };

    this.createFlyBall = this.createFlyBall.bind(this);
  }

  componentWillReceiveProps(nextProps: BallsProps) {
    this.setState({
      balls: nextProps.balls,
    });
  }

  createFlyBall = (item: any) => {
    const { 
      target, 
      curvature = 0.004, 
      speed = config.DEFAULT_BALL_SPEED, 
      changeFlyBallCount 
    } = this.props;
    return (
      <Ball
        {...item.position}
        target={target}
        key={item.id}
        id={item.id}
        curvature={curvature}
        speed={speed}
        changeFlyBallCount={changeFlyBallCount}
      />
    );
  }

  render() {
    const { balls } = this.state;
    return (
      <div style={{ position: 'absolute', zIndex: 1200 }}>
        {
          balls.map(this.createFlyBall)
        }
      </div>
    );
  }
}

export default Balls;
