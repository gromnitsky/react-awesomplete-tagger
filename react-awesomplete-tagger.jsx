/* global React, Awesomplete */

export default class AwesompleteTagger extends React.Component {
    constructor(props) {
        super(props)
        this.ctrl = React.createRef()
    }

    render() { return <input {...this.props} ref={this.ctrl} /> }

    componentDidMount() {
        let ctrl = this.ctrl.current

        let last_tag = s => s.match(/[^,]*$/)[0]
        let opt = Object.assign(this.props.opt || {}, {
            filter: function(text, input) {
                return Awesomplete.FILTER_CONTAINS(text, last_tag(input))
            },
            item: function(text, input) {
                return Awesomplete.ITEM(text, last_tag(input))
            },
            replace: function(text) {
                let before = this.input.value.match(/^.+,\s*|/)[0]
                this.input.value = before + text + ", "
            }
        })
        let awsmplt = new Awesomplete(ctrl, opt)
        ctrl.addEventListener('awesomplete-select', () => {
            // don't display suggestions until the next
            // this.props.completions() run
            awsmplt.list = []
        })

        let input_listener = debounce( evt => {
            let user_input = last_tag(evt.target.value).trim()
            if ( !(user_input.length >= awsmplt.minChars &&
                   this.props.completions)) return

            if (this.props.completions) this.props.completions(user_input)
                .then( v => {
                    awsmplt.list = v
                    awsmplt.evaluate()
                })
        }, this.props.debounce || 200)
        ctrl.addEventListener('input',  input_listener)
    }
}

// from underscore.js 1.8.3
function debounce(func, wait, immediate) {
    var timeout, args, context, timestamp, result;

    var later = function() {
        var last = Date.now() - timestamp;

        if (last < wait && last >= 0) {
            timeout = setTimeout(later, wait - last);
        } else {
            timeout = null;
            if (!immediate) {
                result = func.apply(context, args);
                if (!timeout) context = args = null;
            }
        }
    };

    return function() {
        context = this;
        args = arguments;
        timestamp = Date.now();
        var callNow = immediate && !timeout;
        if (!timeout) timeout = setTimeout(later, wait);
        if (callNow) {
            result = func.apply(context, args);
            context = args = null;
        }

        return result;
    };
}
