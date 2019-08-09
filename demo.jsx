/* global React, ReactDOM, AwesompleteTagger */

class Demo extends React.Component {
    constructor(props) { super(props) }

    render() {
        let opt = { maxItems: 5 } // pass down options to Awesomplete
        return (
              <AwesompleteTagger type="search" placeholder="poland, portugal"
                                 completions={this.completions.bind(this)}
                                 opt={opt} />
        )
    }

    async completions() {       // simulate a request to a DB
        return fetch('demo.json').then( r => r.json())
    }
}

document.addEventListener('DOMContentLoaded', () => {
    ReactDOM.render(<Demo />, document.querySelector('#demo'))
})
