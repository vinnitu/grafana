import React from 'react';
import * as MultiStatPanel from '../types';
import { getBGColor } from './utils';

const DEFAULT_COLOR = 'rgb(31, 120, 193)';

export interface BarStatProps {
  width: number;
  height: number;
  label: string;
  value: string;
  color?: string;
  colorValue?: boolean;
  valueOutOfBar?: boolean;
  direction?: MultiStatPanel.PanelLayout;
  style?: React.CSSProperties;
}

export class BarStat extends React.PureComponent<BarStatProps> {
  labelElem: any;
  valueElem: any;
  barElem: any;

  static defaultProps: Partial<BarStatProps> = {
    color: DEFAULT_COLOR,
    colorValue: false,
    valueOutOfBar: false,
    style: {},
  };

  constructor(props) {
    super(props);
  }

  render() {
    const valueColor = this.props.color || DEFAULT_COLOR;
    const bgColor = getBGColor(valueColor);
    const verticalDirection = this.props.direction === 'vertical';
    const valueOutOfBar = this.props.valueOutOfBar;

    let barWidth = 0;
    let valueContainerStyle: React.CSSProperties = {};
    let valueStyle: React.CSSProperties = {};
    let barLabelStyle: React.CSSProperties = {};
    let barStyle: React.CSSProperties = {};
    let barContainerStyle: React.CSSProperties = this.props.style || {};

    if (this.props.width && this.props.height) {
      barStyle.background = bgColor;
      if (verticalDirection) {
        barContainerStyle.height = this.props.height;
        barContainerStyle.width = this.props.width;
        barWidth = this.props.height * 0.8;
        barStyle.height = barWidth;
        barStyle.width = this.props.width;
        barContainerStyle.lineHeight = `${barWidth}px`;
      } else {
        barWidth = this.props.width * 0.8;
        barStyle.width = barWidth;
        barStyle.height = this.props.height - 10;
        barContainerStyle.height = this.props.height - 10;
        barContainerStyle.width = barWidth;
        const valueOffset = barWidth / 4;
        valueContainerStyle.bottom = valueOutOfBar ? this.props.height + valueOffset : 0;
        valueContainerStyle.width = barWidth;
        barLabelStyle.bottom = 5;
        barLabelStyle.left = barWidth / 2 - 10;
      }
    }

    const { labelFontSizePx, valueFontSizePx } = getFontSize(barWidth, verticalDirection);
    barLabelStyle.fontSize = labelFontSizePx;
    valueStyle.fontSize = valueFontSizePx;

    if (this.props.colorValue) {
      valueStyle.color = valueColor;
      if (verticalDirection) {
        barStyle.borderRightColor = valueColor;
      } else {
        barStyle.borderTopColor = valueColor;
      }
    }

    const barContainerClass = `multistat-bar-container multistat-bar-container--${this.props.direction}`;
    const barValueContainer = verticalDirection ? (
      <span className="bar-value" style={valueStyle} ref={el => (this.valueElem = el)}>
        {this.props.value}
      </span>
    ) : (
      <div className="value-container" style={valueContainerStyle}>
        <span className="bar-value" style={valueStyle} ref={el => (this.valueElem = el)}>
          {this.props.value}
        </span>
      </div>
    );

    return (
      <div className={barContainerClass} style={barContainerStyle}>
        <div className="multistat-bar" style={barStyle} ref={el => (this.barElem = el)}>
          <span className="bar-label bar-label--vertical" style={barLabelStyle} ref={el => (this.labelElem = el)}>
            {this.props.label}
          </span>
          {!this.props.valueOutOfBar && barValueContainer}
        </div>
        {this.props.valueOutOfBar && (
          <div className="value-container value-container--out-of-bar" style={valueContainerStyle}>
            <span className="bar-value" style={valueStyle} ref={el => (this.valueElem = el)}>
              {this.props.value}
            </span>
          </div>
        )}
      </div>
    );
  }
}

function getFontSize(barWidth, verticalDirection = false) {
  const barSize = barWidth;
  let increaseRatio = verticalDirection ? 1.5 : 1;

  const labelFontSize = Math.ceil(barSize / 5 * increaseRatio);
  const valueFontSize = Math.ceil(barSize / 5 * increaseRatio);
  const labelFontSizePx = labelFontSize + 'px';
  const valueFontSizePx = valueFontSize + 'px';

  return { labelFontSize, valueFontSize, labelFontSizePx, valueFontSizePx };
}