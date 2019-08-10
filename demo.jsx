/* global React, ReactDOM, AwesompleteTagger */

class Demo extends React.Component {
    render() {
        let opt = { maxItems: 5 } // pass down options to Awesomplete
        return (
            <AwesompleteTagger type="search" placeholder="poland, portugal"
                               completions={this.completions}
                               opt={opt} />
        )
    }

    completions(user_input) { // simulate a request to a DB
        return fetch('demo.json').then( r => r.json())
    }
}

document.addEventListener('DOMContentLoaded', () => {
    ReactDOM.render(<Demo />, document.querySelector('#demo'))
})
