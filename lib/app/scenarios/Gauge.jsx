const PropTypes = require('prop-types');
const React = require('react');
const ProgressBar = require('progressbar.js');

const propTypes = {
  containerClassName: PropTypes.string,
  containerStyle: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  initialAnimate: PropTypes.bool, // eslint-disable-line react/no-unused-prop-types
  options: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  progress: PropTypes.number.isRequired,
  text: PropTypes.string
};

const defaultProps = {
  containerClassName: 'progressbar-container',
  containerStyle: {},
  initialAnimate: false,
  options: {},
  text: null
};

// [KE] based on https://github.com/NathanFlurry/react-progressbar.js/blob/master/src/main.js
class Gauge extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = { shape: null };

    this.animateShapeProgress = this.animateShapeProgress.bind(this);
    this.createProgressBar = this.createProgressBar.bind(this);
    this.destroyProgressBar = this.destroyProgressBar.bind(this);
    this.setShapeProgress = this.setShapeProgress.bind(this);
    this.setShapeText = this.setShapeText.bind(this);
  }

  componentDidMount() {
    this.createProgressBar(this.props);
  }

  componentWillReceiveProps(props) {
    if (JSON.stringify(this.props.options) !== JSON.stringify(props.options)) {
      this.destroyProgressBar();
      this.createProgressBar(props, this.props);

      return;
    }

    this.animateShapeProgress(props.progress);
    this.setShapeText(props.text);
  }

  componentWillUnmount() {
    this.destroyProgressBar();
  }

  setShapeProgress(progress) {
    this.state.shape.set(progress);
  }

  setShapeText(text) {
    if (text) {
      this.state.shape.setText(text);
    }
  }

  animateShapeProgress(progress) {
    this.state.shape.animate(progress);
  }

  createProgressBar(props, oldProps) {
    if (this.state.shape !== null) {
      throw new Error('Progressbar is already created');
    }

    this.state.shape = new ProgressBar.SemiCircle(
      this.$el,
      props.options
    );

    if (props.initialAnimate) {
      if (oldProps) {
        this.setShapeProgress(oldProps.progress);
      }

      this.animateShapeProgress(props.progress);
    } else {
      this.setShapeProgress(props.progress);
    }

    this.setShapeText(props.text);
  }

  destroyProgressBar() {
    if (this.state.shape) {
      this.state.shape.destroy();
      this.state.shape = null;
    }
  }

  render() {
    const style = this.props.containerStyle;
    const className = this.props.containerClassName;

    return <div className={className} style={style} ref={(c) => { this.$el = c; }} />;
  }
}

Gauge.defaultProps = defaultProps;
Gauge.propTypes = propTypes;

module.exports = Gauge;
