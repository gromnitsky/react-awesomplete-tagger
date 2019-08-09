/* global React, Awesomplete */

export default class AwesompleteTagger extends React.Component {
    constructor(props) {
        super(props)
        this.ctrl = React.createRef()
    }

    render() { return <input {...this.props} ref={this.ctrl} /> }

    componentDidMount() {
        let ctrl = this.ctrl.current

        let tags_parse = input => {
            let cursor = ctrl.selectionStart
            let left = input.slice(0, cursor).split(',')
            let right = input.slice(cursor).split(',')
            let normalize = a => a.map(v => v.trim()).filter(Boolean)
            return {
                cur: ((left[left.length-1] || '') + (right[0] || '')).trim(),
                left: normalize(left.slice(0, -1)),
                right: normalize(right.slice(1))
            }
        }

        let opt = Object.assign(this.props.opt || {}, {
            filter: function(text, input) {
                return Awesomplete.FILTER_CONTAINS(text, tags_parse(input).cur)
            },
            item: function(text, input) {
                return Awesomplete.ITEM(text, tags_parse(input).cur)
            },
            replace: function(text) {
                // inject a new tag to the current input
                let t = tags_parse(this.input.value)
                let other = a => a.join(', ') + (a.length ? ', ' : '')
                this.input.value = other(t.left) + text + ', ' + other(t.right)

                // set cursor position
                let cursor = other(t.left).length + text.length +
                    (t.right.length ? 0 : 2)
                this.input.selectionStart = cursor
                this.input.selectionEnd = cursor
            }
        })
        let awsmplt = new Awesomplete(ctrl, opt)
        ctrl.addEventListener('awesomplete-close', () => {
            // don't display suggestions until the next
            // this.props.completions() run
            awsmplt.list = []
        })

        let input_listener = debounce( evt => {
            let user_input = tags_parse(evt.target.value).cur
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
