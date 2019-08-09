/* global React, ReactDOM, AwesompleteTagger */

class Demo extends React.Component {
    constructor(props) { super(props) }

    render() {
        return (
              <AwesompleteTagger type="search" placeholder="poland, portugal"
                                 completion={this.completion.bind(this)} />
        )
    }

    async completion(user_input = '') { // simulate a request to a DB
        let array = await fetch('demo.json').then( r => r.json())
        user_input = user_input.toLowerCase()
        return array.filter( v => {
            return user_input ? v.toLowerCase().indexOf(user_input) !== -1 : true
        })
    }
}

document.addEventListener('DOMContentLoaded', () => {
    ReactDOM.render(<Demo />, document.querySelector('#demo'))
})
