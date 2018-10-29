import React from 'react';

interface QrcodeReactProps {
  value: string;
  renderAs?: 'canvas' | 'svg';
  size?: number; // default as 128
  bgColor?: string; // default as #FFFFFF
  level?: string; // one of 'L' 'M' 'Q' 'H' default as L
}

export default class QrcodeReact extends React.Component <QrcodeReactProps, {}> { }